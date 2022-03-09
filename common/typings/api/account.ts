import { AccountRole } from "../account";

export interface AccountData {
  id: string;
  teamId: string;
  teamRole: AccountRole;
  email?: string;
}
