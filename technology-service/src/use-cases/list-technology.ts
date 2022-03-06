import { TechnologyData } from "common";
import { TechnologyDb } from "../data-access/technology-db";

interface BuildListTechnologyFnProps {
  technologyDb: TechnologyDb;
}
interface ListTechnologyFnProps {
  technologyId: string;
  teamId: string;
}
type BuildListTechnologyFn = (
  props: BuildListTechnologyFnProps
) => ListTechnologyFn;
export type ListTechnologyFn = (
  props: ListTechnologyFnProps
) => Promise<TechnologyData>;

export const buildListTechnology: BuildListTechnologyFn =
  ({ technologyDb }) =>
  async ({ technologyId, teamId }) => {
    if (!technologyId) {
      throw new Error("You must supply a technology id.");
    }
    if (!teamId) {
      throw new Error("You must supply a team id.");
    }

    const technology = await technologyDb.findById({
      id: technologyId,
      teamId,
    });

    return technology.getTechnologyData();
  };
