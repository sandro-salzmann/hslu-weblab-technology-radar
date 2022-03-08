import { HistoryEvent, TechnologyData } from "common";
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
  maturity_description varchar,
  created_by uuid,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published boolean DEFAULT false,
  published_at TIMESTAMP,
  changed_by uuid,
  changed_at TIMESTAMP
);

CREATE TABLE history (
  technology_id uuid NOT NULL,
  team_id uuid NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  changed_by uuid,
  history_events json
);

ALTER TABLE history
ADD CONSTRAINT technology_id_fkey
FOREIGN KEY (technology_id)
REFERENCES technology(id)
ON DELETE CASCADE;

-- index history.technology_id to make search faster
CREATE INDEX history_technology_id_index
ON history (technology_id);
`);

// make a database snapshot to restore from it later
const backup = db.backup();

export function restoreBackup() {
  backup.restore();
}

export function makeDb() {
  return pool;
}

export async function insertTechnology({
  id,
  name,
  category,
  maturity,
  description,
  maturityDescription,
  teamId,
  publishedAt,
  published,
  changedBy,
  changedAt,
}: TechnologyData) {
  await pool.query(
    "INSERT INTO technology(id, team_id, category, maturity, name, description, maturity_description, published_at, published, changed_by, changed_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)",
    [
      id,
      teamId,
      category,
      maturity,
      name,
      description,
      maturityDescription,
      publishedAt,
      published,
      changedBy,
      changedAt,
    ]
  );
}

export async function insertTechnologyHistory({
  technologyId,
  teamId,
  historyEvents,
  changedBy,
}: {
  technologyId: string;
  teamId: string;
  historyEvents: HistoryEvent[];
  changedBy: string;
}) {
  await pool.query(
    `INSERT INTO history(technology_id, team_id, history_events, changed_by)
    VALUES($1,$2,$3,$4)`,
    [technologyId, teamId, JSON.stringify(historyEvents), changedBy]
  );
}
