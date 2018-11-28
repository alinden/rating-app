select
  a.user_id,
  a.user_name,
  a.user_image,
  ratings.rating user_rating
from (
  select
    users.id as user_id,
    max(users.name) as user_name,
    max(users.image) as user_image,
    max(ratings.id) as user_rating_id
  from
    (select * from ratings where league_id = 1) ratings
    inner join users users
      on ratings.user_id = users.id
  group by users.id
) a
inner join ratings
  on a.user_rating_id = ratings.id;
