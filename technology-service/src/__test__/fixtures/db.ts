import { TechnologyData } from "common";
import { DataType, newDb } from "pg-mem";
import { v4 as uuidv4 } from "uuid";

const db = newDb();
const { Pool } = db.adapters.createPg();

const pool = new Pool();

// register enums
db.public.registerEquivalentType({
  name: "category",
  equivalentTo: DataType.text,
  isValid(val: string) {
    return ["techniques", "platforms", "tools", "languages"].includes(val);
  },
});
db.public.registerEquivalentType({
  name: "maturity",
  equivalentTo: DataType.text,
  isValid(val: string) {
    return ["assess", "trial", "adopt", "hold"].includes(val);
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
CREATE TABLE technology (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id uuid NOT NULL,
  category category,
  maturity maturity,
  name varchar,
  description varchar,
  maturity_description varchar
);`);

// make a database snapshot to restore from it later
const backup = db.backup();

export function restoreBackup() {
  backup.restore();
}

export function makeDb() {
  return pool;
}

export async function insertTechnology(
  {
    id,
    name,
    category,
    maturity,
    description,
    descriptionClassification,
  }: TechnologyData,
  teamId: string
) {
  await pool.query(
    "INSERT INTO technology(id, team_id, category, maturity, name, description, maturity_description) VALUES($1,$2,$3,$4,$5,$6,$7)",
    [
      id,
      teamId,
      category,
      maturity,
      name,
      description,
      maturityDescription,
    ]
  );
}
