import { PostTechnologyBody } from "common";
import { TechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import { makeTechnology } from "../technology";

export type AddTechnologyFn = (
  props: {
    teamId: string;
  } & PostTechnologyBody,
  accountId: string
) => Promise<{ id: string }>;

export const buildAddTechnology =
  ({ technologyDb }: { technologyDb: TechnologyDb }): AddTechnologyFn =>
  async (technology, accountId) => {
    const technologyToAdd = makeTechnology(technology);
    if(!accountId || !Id.isValidId(accountId)){
      throw new Error("You must supply a accountId");
    }

    await technologyDb.addTechnology(technologyToAdd, accountId);

    return { id: technologyToAdd.getId() };
  };
