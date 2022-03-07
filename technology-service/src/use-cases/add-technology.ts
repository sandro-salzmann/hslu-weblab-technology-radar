import { PostTechnologyBody } from "common";
import { TechnologyDb } from "../data-access/technology-db";
import { makeTechnology } from "../technology";

export type AddTechnologyFn = (
  props: {
    teamId: string;
  } & PostTechnologyBody
) => Promise<{ id: string }>;

export const buildAddTechnology =
  ({ technologyDb }: { technologyDb: TechnologyDb }): AddTechnologyFn =>
  async (technology) => {
    const technologyToAdd = makeTechnology(technology);

    await technologyDb.addTechnology(technologyToAdd);

    return { id: technologyToAdd.getId() };
  };
