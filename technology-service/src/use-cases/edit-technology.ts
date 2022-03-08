import { AccountRole, PatchTechnologyBody } from "common";
import { TechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import { Technology } from "../technology/technology";

export type EditTechnologyFn = (
  props: {
    teamId: string;
  } & PatchTechnologyBody,
  accountId: string,
  teamRole: AccountRole
) => Promise<Technology>;

export const buildEditTechnology =
  ({ technologyDb }: { technologyDb: TechnologyDb }): EditTechnologyFn =>
  async (changes, accountId, teamRole) => {
    if (teamRole !== "LEADER") {
      throw new Error("You don't have permissions to edit technologies.");
    }
    if (!accountId || !Id.isValidId(accountId)) {
      throw new Error("You must supply a accountId");
    }
    if (!changes?.id || !Id.isValidId(changes.id)) {
      throw new Error("You must supply a valid technology id");
    }

    const technology = await technologyDb.findById({
      teamId: changes.teamId,
      id: changes.id,
    });
    // TODO: persist technology for history

    // TODO: update fields

    // publishing
    if (changes.published) technology.publish();

    await technologyDb.update(technology);

    return technology;
  };
