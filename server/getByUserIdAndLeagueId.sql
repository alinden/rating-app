select
  ratings.id,
  ratings.league_id,
  ratings.user_id,
  ratings.last_game_id,
  ratings.rating
from ratings
inner join (
  select
    max(id) id,
    user_id user_id,
    league_id league_id
  from ratings
  group by user_id, league_id
) recent_ratings
on ratings.id = recent_ratings.id
where ratings.user_id = 1
and ratings.league_id = 1
