select
  winners.id as winner_id,
  winners.name as winner_name,
  winners.image as winner_image,
  winner_ratings.rating as winner_rating,
  losers.id as loser_id,
  losers.name as loser_name,
  losers.image as loser_image,
  loser_ratings.rating as loser_rating
from
  (select * from games where league_id = 1) games
  inner join users winners
    on games.winner_id = winners.id
  inner join (
    select
      recent_ratings.id id,
      recent_ratings.user_id user_id,
      ratings.rating
    from (
      select
        max(ratings.id) id,
        ratings.user_id
      from ratings
      group by ratings.user_id
    ) recent_ratings
    inner join ratings
    on recent_ratings.id = ratings.id
  ) winner_ratings
    on winner_ratings.user_id = games.winner_id
  inner join users losers
    on games.loser_id = losers.id
  inner join (
    select
      recent_ratings.id id,
      recent_ratings.user_id user_id,
      ratings.rating
    from (
      select
        max(ratings.id) id,
        ratings.user_id
      from ratings
      group by ratings.user_id
    ) recent_ratings
    inner join ratings
    on recent_ratings.id = ratings.id
  ) loser_ratings
    ON losers.id = loser_ratings.user_id;
