import {
  HistoryEvent,
  TechnologyCategory,
  TechnologyHistoryData,
  TechnologyMaturity,
} from "common";
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
  addTechnology: (technology: Technology, accountId: string) => void;
  update: (technology: Technology, accountId: string) => void;
  getHistoryEvents: (props: {
    teamId: string;
    technologyId: string;
  }) => Promise<TechnologyHistoryData>;
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
        published: boolean;
        published_at: string;
        changed_by: string;
        changed_at: string;
      }>(
        "SELECT id, team_id, category, maturity, name, description, maturity_description, published, published_at, changed_by, changed_at FROM technology WHERE team_id = $1 AND id = $2",
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
        published: technologyResult.published,
        publishedAt: technologyResult.published_at,
        changedBy: technologyResult.changed_by,
        changedAt: technologyResult.changed_at,
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
        published: boolean;
      };
      let result;
      if (category) {
        result = await db.query<DbResultSet>(
          "SELECT id, category, maturity, name, substring(description from 0 for 50) AS description_preview, published FROM technology WHERE team_id = $1 AND category = $2::category",
          [teamId, category]
        );
      } else {
        result = await db.query<DbResultSet>(
          "SELECT id, category, maturity, name, substring(description from 0 for 50) AS description_preview, published FROM technology WHERE team_id = $1",
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
          published: technologyResult.published,
        })
      );

      return technologies;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to find technologies.");
    }
  },
  addTechnology: async (technology, accountId) => {
    try {
      const db = await makeDb();

      await db.query(
        `INSERT INTO technology(id, team_id, category, maturity, name, description, maturity_description, created_by, changed_at, changed_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          technology.getId(),
          technology.getTeamId(),
          technology.getCategory(),
          technology.getMaturity(),
          technology.getName(),
          technology.getDescription(),
          technology.getMaturityDescription(),
          accountId,
          technology.getChangedAt(),
          technology.getChangedBy(),
        ]
      );
    } catch (error) {
      console.log(error);
      throw new Error("Failed to add technologies.");
    }
  },
  update: async (technology, accountId) => {
    try {
      const db = await makeDb();

      await db.query(
        `UPDATE technology SET
          category = COALESCE($1, category),
          maturity = COALESCE($2, maturity),
          name = COALESCE($3, name),
          description = COALESCE($4, description),
          maturity_description = COALESCE($5, maturity_description),
          published = COALESCE($6, published),
          published_at = COALESCE($7, published_at),
          changed_at = COALESCE($8, changed_at),
          changed_by = COALESCE($9, changed_by)
        WHERE id = $10
        AND team_id = $11`,
        [
          technology.getCategory(),
          technology.getMaturity(),
          technology.getName(),
          technology.getDescription(),
          technology.getMaturityDescription(),
          technology.getPublished(),
          technology.getPublishedAt(),
          technology.getChangedAt(),
          technology.getChangedBy(),
          technology.getId(),
          technology.getTeamId(),
        ]
      );

      const newHistoryEvents = technology.getNewHistoryEvents();
      if (newHistoryEvents.length > 0) {
        await db.query(
          `INSERT INTO history(technology_id, team_id, history_events, changed_by)
          VALUES($1,$2,$3,$4)`,
          [
            technology.getId(),
            technology.getTeamId(),
            JSON.stringify(newHistoryEvents),
            accountId,
          ]
        );
      }
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update technology.");
    }
  },
  getHistoryEvents: async ({ teamId, technologyId }) => {
    try {
      const db = await makeDb();

      type DbResultSet = {
        timestamp: string;
        history_events: HistoryEvent;
        changed_by: string;
      };
      let result = await db.query<DbResultSet>(
        "SELECT timestamp, history_events, changed_by FROM history WHERE team_id = $1 AND technology_id = $2",
        [teamId, technologyId]
      );

      const historiesResult = result.rows;
      if (!historiesResult) throw new Error("Failed to get history.");
      const history = historiesResult.map((historyResult) => ({
        timestamp: new Date(historyResult.timestamp).toISOString(),
        historyEvents: historyResult.history_events,
        changedBy: historyResult.changed_by,
      }));

      return history;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to find history.");
    }
  },
});
