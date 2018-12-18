package rating.repositories

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

import rating.models.{WinLossRecord, MonthTotal}

object StatsRepository {
  def getWinLossRecordsQuery(leagueId: Int) =
    sql"""
      select
        users.id,
        users.name,
        users.image,
        wins.num_wins,
        losses.num_losses
      from
        users
      inner join (
        select
          users.id as user_id,
          count(games.id) as num_wins
        from
          users
        left outer join (
          select * from games where games.league_id = ${leagueId}
        ) games
          on users.id = games.winner_id
        group by users.id
      ) wins
        on users.id = wins.user_id
      inner join (
        select
          users.id as user_id,
          count(games.id) as num_losses
        from
          users
        left outer join (
          select * from games where games.league_id = ${leagueId}
        ) games
          on users.id = games.loser_id
        group by users.id
      ) losses
        on users.id = losses.user_id
      where (wins.num_wins + losses.num_losses > 0)
      order by (wins.num_wins - losses.num_losses) desc;
      """.query[WinLossRecord]
      .to[List]

  def getMonthTotalsQuery(leagueId: Int) =
    sql"""
      WITH scores as
        (SELECT
          COALESCE(w.player_id, l.player_id) as player_id,
          COALESCE(w.month, l.month) as month,
          COALESCE(w.count, 0)-COALESCE(l.count,0) AS score
        FROM
          (SELECT
            winner_id AS player_id,
            EXTRACT(MONTH FROM date_played) AS month,
            COUNT(*)
          FROM games
          WHERE extract(year FROM date_played) = 2018
          AND league_id = ${leagueId}
          GROUP BY 1,2
        ) w
        FULL OUTER JOIN
          (SELECT
            loser_id AS player_id,
            EXTRACT(MONTH FROM date_played) AS month,
            COUNT(*) FROM games
            WHERE extract(year FROM date_played) = 2018
            AND league_id = ${leagueId}
            GROUP BY 1,2
          ) l
        ON w.player_id = l.player_id
        AND w.month = l.month
      )
      SELECT
        users.id,
        max(users.name),
        max(users.image),
        sum(CASE WHEN month = 1 THEN score ELSE 0 END) AS "January",
        sum(CASE WHEN month = 2 THEN score ELSE 0 END) AS "February",
        sum(CASE WHEN month = 3 THEN score ELSE 0 END) AS "March",
        sum(CASE WHEN month = 4 THEN score ELSE 0 END) AS "April",
        sum(CASE WHEN month = 5 THEN score ELSE 0 END) AS "May",
        sum(CASE WHEN month = 6 THEN score ELSE 0 END) AS "June",
        sum(CASE WHEN month = 7 THEN score ELSE 0 END) AS "July",
        sum(CASE WHEN month = 8 THEN score ELSE 0 END) AS "August",
        sum(CASE WHEN month = 9 THEN score ELSE 0 END) AS "September",
        sum(CASE WHEN month = 10 THEN score ELSE 0 END) AS "October",
        sum(CASE WHEN month = 11 THEN score ELSE 0 END) AS "November",
        sum(CASE WHEN month = 12 THEN score ELSE 0 END) AS "December"
      FROM scores
      INNER JOIN users
      ON users.id = scores.player_id
      GROUP BY users.id
      ORDER BY 15 desc;
    """.query[MonthTotal]
    .to[List]


  def getWinLossRecords(leagueId: Int)(implicit xb: Transactor[IO]): List[WinLossRecord] =
    getWinLossRecordsQuery(leagueId).transact(xb).unsafeRunSync

  def getMonthTotals(leagueId: Int)(implicit xb: Transactor[IO]): List[MonthTotal] =
    getMonthTotalsQuery(leagueId).transact(xb).unsafeRunSync
}
