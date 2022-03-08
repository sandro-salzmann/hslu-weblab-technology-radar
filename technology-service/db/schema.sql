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
    published_at TIMESTAMP
);
