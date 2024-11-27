DROP SCHEMA public cascade;
CREATE SCHEMA public;

CREATE TABLE panelists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL DEFAULT '',
    team VARCHAR(100) NOT NULL DEFAULT ''
);

CREATE TABLE periods (
    number INTEGER PRIMARY KEY,
    title VARCHAR(100) DEFAULT '',
    description VARCHAR(1000) DEFAULT '',
    panelist_type VARCHAR(100) DEFAULT '',
    point INTEGER DEFAULT 0,
    award_count INTEGER DEFAULT 0
);

CREATE TABLE questions (
    id INTEGER PRIMARY KEY,
    period INTEGER NOT NULL DEFAULT 0,
    idx INTEGER DEFAULT 0,
    question_format VARCHAR(100) DEFAULT '',
    option_format VARCHAR(100) DEFAULT '',
    text VARCHAR(100) DEFAULT '',
    thinking_second INTEGER DEFAULT 0,
    answer VARCHAR(100) DEFAULT ''
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    value VARCHAR(100) DEFAULT '',
    image_origin_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    image_origin_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    image_scale DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    panelist_id INTEGER DEFAULT 0,
    question_id INTEGER DEFAULT 0,
    answer VARCHAR(100) NOT NULL DEFAULT '',
    correct INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    elapsed_second DOUBLE PRECISION NOT NULL DEFAULT 0
);
