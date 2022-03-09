import { AccountData } from "common";
import { DataType, newDb } from "pg-mem";
import { v4 as uuidv4 } from "uuid";

const db = newDb();
const { Pool } = db.adapters.createPg();

const pool = new Pool();

// register enums
db.public.registerEquivalentType({
  name: "team_role",
  equivalentTo: DataType.text,
  isValid(val: string) {
    return ["LEADER", "MEMBER"].includes(val);
  },
});

// register functions
db.public.registerFunction({
  name: "uuid_generate_v4",
  args: [],
  returns: DataType.text,
  implementation: (x) => uuidv4(),
});

// init schema
db.public.query(`
CREATE TABLE team(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY
);

CREATE TABLE account (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_role team_role,
    team_id uuid,
    email varchar
);

ALTER TABLE account ADD CONSTRAINT some_fk FOREIGN KEY (team_id) REFERENCES team(id);`);

// make a database snapshot to restore from it later
const backup = db.backup();

export function restoreBackup() {
  backup.restore();
}

export function makeDb() {
  return pool;
}

export async function insertAccount({
  id,
  teamRole,
  teamId,
  email,
}: AccountData) {
  await pool.query("INSERT INTO team(id) VALUES($1)", [teamId]);
  await pool.query(
    "INSERT INTO account(id, team_role, team_id, email) VALUES($1, $2, $3, $4)",
    [id, teamRole, teamId, email]
  );
}
