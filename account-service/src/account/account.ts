import { AccountData } from "common";
import { IdUtils } from "../Id";

export type AccountRole = "LEADER" | "MEMBER";

export interface Account {
  getId: () => string;
  getTeamId: () => string;
  getTeamRole: () => AccountRole;
  getAccountData: () => AccountData;
  getEmail: () => string | undefined;
}

interface BuildMakeAccountFnProps {
  Id: IdUtils;
}
export interface MakeAccountFnProps {
  id: string;
  teamId: string;
  teamRole: AccountRole;
  email?: string;
}
type BuildMakeAccountFn = (props: BuildMakeAccountFnProps) => MakeAccountFn;
type MakeAccountFn = (props: MakeAccountFnProps) => Account;

export const buildMakeAccount: BuildMakeAccountFn =
  ({ Id }) =>
  ({ id, teamId, teamRole = "MEMBER", email }) => {
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
      getEmail: () => email,
      getAccountData: () => ({
        id,
        teamId,
        teamRole,
        email,
      }),
    });
  };
