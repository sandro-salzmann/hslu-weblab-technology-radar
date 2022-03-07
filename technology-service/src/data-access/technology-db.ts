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
  addTechnology: (technology: Technology) => void;
}

export const makeTechnologyDb: MakeTechnologyDbFn = ({ makeDb }) => ({
  findById: async ({ teamId, id }): Promise<Technology> => {
    try {
      const db = await makeDb();

      const result = await db.query<{
        id: string;
        team_id: string;
        category: TechnologyCategory;
        maturity: TechnologyMaturity;
        name: string;
        description: string;
        maturity_description: string;
      }>(
        "SELECT id, team_id, category, maturity, name, description, maturity_description FROM technology WHERE team_id = $1 AND id = $2",
        [teamId, id]
      );
      const technologyResult = result.rows[0];
      if (!technologyResult) throw new Error("Technology not found.");
      return makeTechnology({
        id: technologyResult.id,
        teamId: technologyResult.team_id,
        category: technologyResult.category,
        maturity: technologyResult.maturity,
        name: technologyResult.name,
        description: technologyResult.description,
        maturityDescription: technologyResult.maturity_description,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Failed to find technology.");
    }
  },
  previewAll: async ({ teamId, category }): Promise<TechnologyPreview[]> => {
    try {
      const db = await makeDb();

      type DbResultSet = {
        id: string;
        category: TechnologyCategory;
        maturity: TechnologyMaturity;
        name: string;
        description_preview: string;
      };
      let result;
      if (category) {
        result = await db.query<DbResultSet>(
          "SELECT id, category, maturity, name, substring(description from 0 for 50) AS description_preview FROM technology WHERE team_id = $1 AND category = $2::category",
          [teamId, category]
        );
      } else {
        result = await db.query<DbResultSet>(
          "SELECT id, category, maturity, name, substring(description from 0 for 50) AS description_preview FROM technology WHERE team_id = $1",
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
          descriptionPreview: technologyResult.description_preview,
        })
      );

      return technologies;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to find technologies.");
    }
  },
  addTechnology: async (technology) => {
    try {
      const db = await makeDb();

      await db.query(
        `INSERT INTO technology(id, team_id, category, maturity, name, description, maturity_description)
        VALUES($1,$2,$3,$4,$5,$6,$7)`,
        [
          technology.getId(),
          technology.getTeamId(),
          technology.getCategory(),
          technology.getMaturity(),
          technology.getName(),
          technology.getDescription(),
          technology.getMaturityDescription(),
        ]
      );
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add technologies.");
    }
  },
});
