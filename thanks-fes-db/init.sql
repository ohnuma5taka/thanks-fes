drop schema if exists public cascade;

create schema public;

SET
    search_path TO public;

SET
    TIME ZONE 'Asia/Tokyo';

CREATE TABLE teams (
    name TEXT PRIMARY KEY,
    color TEXT NOT NULL DEFAULT ''
);

CREATE TABLE panelists (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL DEFAULT '',
    team TEXT NOT NULL DEFAULT ''
);

CREATE TABLE periods (
    number INTEGER PRIMARY KEY DEFAULT 0,
    title TEXT DEFAULT '',
    description TEXT DEFAULT '',
    read_text TEXT DEFAULT '',
    panelist_type TEXT DEFAULT '',
    award_count INTEGER DEFAULT 0
);

CREATE TABLE questions (
    id TEXT PRIMARY KEY DEFAULT '',
    period INTEGER NOT NULL DEFAULT 0,
    idx INTEGER DEFAULT 0,
    question_format TEXT DEFAULT '',
    option_format TEXT DEFAULT '',
    text TEXT DEFAULT '',
    read_text TEXT DEFAULT '',
    thinking_second INTEGER DEFAULT 0,
    answer TEXT DEFAULT '',
    point INTEGER DEFAULT 0
);

CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    question_id TEXT NOT NULL,
    value TEXT DEFAULT '',
    image_origin_x DOUBLE PRECISION NOT NULL DEFAULT 0,
    image_origin_y DOUBLE PRECISION NOT NULL DEFAULT 0,
    image_scale DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    panelist_id INTEGER NOT NULL,
    question_id TEXT NOT NULL,
    answer TEXT NOT NULL DEFAULT '',
    correct INTEGER NOT NULL DEFAULT 0,
    score INTEGER NOT NULL DEFAULT 0,
    elapsed_second DOUBLE PRECISION NOT NULL DEFAULT 0
);
