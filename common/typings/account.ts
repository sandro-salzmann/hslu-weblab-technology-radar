export type AccountRole = "MEMBER" | "LEADER";

export interface Authorization {
  accountId: string;
  teamId: string;
  teamRole: AccountRole;
}
