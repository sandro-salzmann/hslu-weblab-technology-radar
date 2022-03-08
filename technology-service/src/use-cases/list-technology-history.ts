import { TechnologyHistoryData } from "common";
import { TechnologyDb } from "../data-access/technology-db";

interface BuildListTechnologyHistoryFnProps {
  technologyDb: TechnologyDb;
}
interface ListTechnologyHistoryFnProps {
  technologyId: string;
  teamId: string;
}
type BuildListTechnologyHistoryFn = (
  props: BuildListTechnologyHistoryFnProps
) => ListTechnologyHistoryFn;
export type ListTechnologyHistoryFn = (
  props: ListTechnologyHistoryFnProps
) => Promise<TechnologyHistoryData>;

export const buildListTechnologyHistory: BuildListTechnologyHistoryFn =
  ({ technologyDb }) =>
  async ({ technologyId, teamId }) => {
    if (!technologyId) {
      throw new Error("You must supply a technology id.");
    }
    if (!teamId) {
      throw new Error("You must supply a team id.");
    }

    const history = await technologyDb.getHistoryEvents({
      technologyId,
      teamId,
    });
    return history;
  };
