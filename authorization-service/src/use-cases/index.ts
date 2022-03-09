import { buildListAccount } from "./list-account";
import { accountsDb } from "../data-access";

export const listAccount = buildListAccount({ accountsDb });
