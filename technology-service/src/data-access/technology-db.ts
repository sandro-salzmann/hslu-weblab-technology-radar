import { TechnologyCategory, TechnologyMaturity } from "common";
import { MakeDbFn } from ".";
import { makeTechnology, makeTechnologyPreview } from "../technology";
import { Technology } from "../technology/technology";
import { TechnologyPreview } from "../technology/technology-preview";

interface MakeTechnologyDbFnProps {
  makeDb: MakeDbFn;
}
type MakeTechnologyDbFn = (props: MakeTechnologyDbFnProps) => TechnologyDb;
export interface TechnologyDb {
  findById: (props: { teamId: string; id: string }) => Promise<Technology>;
  previewAll: (props: {
    teamId: string;
    category?: TechnologyCategory;
  }) => Promise<TechnologyPreview[]>;
}

export const makeTechnologyDb: MakeTechnologyDbFn = ({ makeDb }) => ({
  findById: async ({ teamId, id }): Promise<Technology> => {
    const db = await makeDb();

    const result = await db.query<{
      id: string;
      category: TechnologyCategory;
      maturity: TechnologyMaturity;
      name: string;
      description: string;
      descriptionclassification: string;
    }>(
      "SELECT id, category, maturity, name, description, descriptionClassification FROM technology WHERE team_id = $1 AND id = $2",
      [teamId, id]
    );
    const technologyResult = result.rows[0];
    if (!technologyResult) throw new Error("Technology not found.");
    return makeTechnology({
      id: technologyResult.id,
      category: technologyResult.category,
      maturity: technologyResult.maturity,
      name: technologyResult.name,
      description: technologyResult.description,
      descriptionClassification: technologyResult.descriptionclassification,
    });
  },
  previewAll: async ({ teamId, category }): Promise<TechnologyPreview[]> => {
    const db = await makeDb();

    type DbResultSet = {
      id: string;
      category: TechnologyCategory;
      maturity: TechnologyMaturity;
      name: string;
      descriptionpreview: string;
    };
    let result;
    if (category) {
      result = await db.query<DbResultSet>(
        "SELECT id, category, maturity, name, substring(description from 0 for 50) AS descriptionpreview FROM technology WHERE team_id = $1 AND category = $2::category",
        [teamId, category]
      );
    } else {
      result = await db.query<DbResultSet>(
        "SELECT id, category, maturity, name, substring(description from 0 for 50) AS descriptionpreview FROM technology WHERE team_id = $1",
        [teamId]
      );
    }

    const technologiesResult = result.rows;
    if (!technologiesResult) throw new Error("Failed to get technologies.");
    const technologies = technologiesResult.map((technologyResult) =>
      makeTechnologyPreview({
        id: technologyResult.id,
        category: technologyResult.category,
        maturity: technologyResult.maturity,
        name: technologyResult.name,
        descriptionPreview: technologyResult.descriptionpreview,
      })
    );

    return technologies;
  },
});
