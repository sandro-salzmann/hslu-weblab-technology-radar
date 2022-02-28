import { Pool } from "pg";
import { makeAccountsDb } from "./accounts-db";

// config is set implicitly with env variables
const pool = new Pool();

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export type MakeDbFn = () => Pool;

const makeDb: MakeDbFn = () => pool;

export const accountsDb = makeAccountsDb({ makeDb });
