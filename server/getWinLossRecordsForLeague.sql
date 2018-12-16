select
  users.id,
  users.name,
  users.image,
  wins.num_wins,
  losses.num_losseS
from
  users
inner join (
  select
    users.id as user_id,
    count(1) as num_winS
  from
    users
  left outer join games
    on users.id = games.winner_id
  group by users.id
) wins
  on users.id = wins.user_id
inner join (
  select
    users.id as user_id,
    count(1) as num_losses
  from
    users
  left outer join games
    on users.id = games.loser_id
  group by users.id
) losses
  on users.id = losses.user_id
order by (wins.num_wins - losses.num_losses) desc;

