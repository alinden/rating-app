BEGIN;

ALTER TABLE games DROP COLUMN date_played;
ALTER TABLE games ADD COLUMN date_played timestamp;
UPDATE games SET date_played = DEFAULT;

ALTER TABLE ratings RENAME COLUMN rating new_rating;
ALTER TABLE ratings ADD COLUMN previous_rating;
UPDATE ratings SET previous_rating = 1500;

COMMIT;
