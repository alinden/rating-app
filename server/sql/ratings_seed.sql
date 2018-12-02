--
-- Create database for ratings app.
--

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    image varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS leagues (
    id SERIAL PRIMARY KEY,
    name varchar NOT NULL,
    image varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    league_id integer NOT NULL,
    winner_id integer NOT NULL,
    loser_id integer NOT NULL,
    date_played timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    league_id integer NOT NULL,
    user_id integer NOT NULL,
    last_game_id integer NOT NULL,
    previous_rating integer NOT NULL,
    new_rating integer NOT NULL
);

BEGIN;

TRUNCATE table users;
TRUNCATE table leagues;
TRUNCATE table games;
TRUNCATE table ratings;
ALTER SEQUENCE users_id_seq RESTART;
ALTER SEQUENCE leagues_id_seq RESTART;
ALTER SEQUENCE games_id_seq RESTART;
ALTER SEQUENCE ratings_id_seq RESTART;

INSERT INTO leagues VALUES (DEFAULT, '8 Ball', '8ball.jpeg');
INSERT INTO leagues VALUES (DEFAULT, '9 Ball', '9ball.png');
INSERT INTO leagues VALUES (DEFAULT, 'Cricket', 'dart_board.png');
INSERT INTO leagues VALUES (DEFAULT, '301', '301_darts.png');
INSERT INTO leagues VALUES (DEFAULT, 'Around the World', 'around_the_world.jpg');
INSERT INTO leagues VALUES (DEFAULT, 'Snooker', 'snooker.jpg');

INSERT INTO users VALUES (DEFAULT, 'Simba', 'simba.png');
INSERT INTO users VALUES (DEFAULT, 'Brady', 'brady.png');

COMMIT;

ANALYZE;

