import { IdUtils } from "../Id";

export type AccountRole = "LEADER" | "MEMBER";

export interface AccountData {
  id: string;
  teamId: string;
  teamRole: AccountRole;
}

export interface Account {
  getId: () => string;
  getTeamId: () => string;
  getTeamRole: () => AccountRole;
  getAccountData: () => AccountData;
}

interface BuildMakeAccountFnProps {
  Id: IdUtils;
}
export interface MakeAccountFnProps {
  id: string;
  teamId: string;
  teamRole: AccountRole;
}
type BuildMakeAccountFn = (props: BuildMakeAccountFnProps) => MakeAccountFn;
type MakeAccountFn = (props: MakeAccountFnProps) => Account;

export const buildMakeAccount: BuildMakeAccountFn =
  ({ Id }) =>
  ({ id, teamId, teamRole = "MEMBER" }) => {
    if (!id || !Id.isValidId(id)) {
      throw new Error("Account must have a valid id.");
    }
    if (!teamId || !Id.isValidId(teamId)) {
      throw new Error("Account must have a valid teamId.");
    }
    if (!["LEADER", "MEMBER"].includes(teamRole)) {
      throw new Error("Account must have a valid teamRole.");
    }

    return Object.freeze({
      getId: () => id,
      getTeamId: () => teamId,
      getTeamRole: () => teamRole,
      getAccountData: () => ({
        id,
        teamId,
        teamRole,
      }),
    });
  };
