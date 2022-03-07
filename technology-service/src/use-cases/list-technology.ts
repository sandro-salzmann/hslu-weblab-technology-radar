import { AccountRole, TechnologyData } from "common";
import { TechnologyDb } from "../data-access/technology-db";

interface BuildListTechnologyFnProps {
  technologyDb: TechnologyDb;
}
interface ListTechnologyFnProps {
  technologyId: string;
  teamId: string;
  teamRole: AccountRole;
}
type BuildListTechnologyFn = (
  props: BuildListTechnologyFnProps
) => ListTechnologyFn;
export type ListTechnologyFn = (
  props: ListTechnologyFnProps
) => Promise<TechnologyData>;

export const buildListTechnology: BuildListTechnologyFn =
  ({ technologyDb }) =>
  async ({ technologyId, teamId, teamRole }) => {
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

    if (teamRole === "MEMBER" && !technology.getPublished()) {
      throw new Error(
        "You don't have permissions to view unpublished technologies."
      );
    }

    return technology.getTechnologyData();
  };
