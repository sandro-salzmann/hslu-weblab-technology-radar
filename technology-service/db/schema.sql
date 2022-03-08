CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE technology CASCADE;

DROP TYPE category;
DROP TYPE maturity;

CREATE TYPE category AS ENUM ('techniques', 'platforms', 'tools', 'languages');

CREATE TYPE maturity AS ENUM ('assess', 'trial', 'adopt', 'hold');

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
