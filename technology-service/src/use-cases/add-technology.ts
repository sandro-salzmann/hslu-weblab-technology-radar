import { AccountRole, PostTechnologyBody } from "common";
import { TechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import { makeTechnology } from "../technology";

export type AddTechnologyFn = (
  props: {
    teamId: string;
  } & PostTechnologyBody,
  accountId: string,
  teamRole: AccountRole
) => Promise<{ id: string }>;

export const buildAddTechnology =
  ({ technologyDb }: { technologyDb: TechnologyDb }): AddTechnologyFn =>
  async (technology, accountId, teamRole) => {
    if (teamRole !== "LEADER") {
      throw new Error("You don't have permissions to create technologies.");
    }

    const technologyToAdd = makeTechnology(technology);
    if (!accountId || !Id.isValidId(accountId)) {
      throw new Error("You must supply a accountId");
    }

    await technologyDb.addTechnology(technologyToAdd, accountId);

    return { id: technologyToAdd.getId() };
  };
