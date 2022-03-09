CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE account CASCADE;

DROP TABLE team CASCADE;

DROP TYPE team_role;

CREATE TABLE team(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY
);

CREATE TYPE team_role AS ENUM ('LEADER', 'MEMBER');

CREATE TABLE account (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_role team_role,
    team_id uuid REFERENCES team(id),
    email varchar
);