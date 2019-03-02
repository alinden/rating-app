package rating.repositories

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._
import com.github.nscala_time.time.Imports._

import scala.concurrent.ExecutionContext

import rating.models.{WinLossRecord, MonthTotal}

object StatsRepository {

  def getConditionalWinLossRecordsQuery(leagueId: Int, userId: Int) =
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
          and games.loser_id = ${userId}
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
          and games.winner_id = ${userId}
        ) games
          on users.id = games.loser_id
        group by users.id
      ) losses
        on users.id = losses.user_id
      where (wins.num_wins + losses.num_losses > 0)
      order by (wins.num_wins - losses.num_losses) desc;
      """.query[WinLossRecord]
      .to[List]


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

  def getMonthTotalsQuery(leagueId: Int, months: List[Int], years: List[Int]) =
    sql"""
      WITH scores as
        (SELECT
          COALESCE(w.player_id, l.player_id) as player_id,
          COALESCE(w.month, l.month) as month,
          COALESCE(w.year, l.year) as year,
          COALESCE(w.count, 0)-COALESCE(l.count,0) AS score
        FROM
          (SELECT
            winner_id AS player_id,
            EXTRACT(MONTH FROM date_played) AS month,
            EXTRACT(YEAR FROM date_played) AS year,
            COUNT(*)
          FROM games
          WHERE league_id = ${leagueId}
          GROUP BY 1,2,3
        ) w
        FULL OUTER JOIN
          (SELECT
            loser_id AS player_id,
            EXTRACT(MONTH FROM date_played) AS month,
            EXTRACT(YEAR FROM date_played) AS year,
            COUNT(*)
          FROM games
          WHERE league_id = ${leagueId}
          GROUP BY 1,2,3
        ) l
        ON w.player_id = l.player_id
        AND w.month = l.month
        AND w.year = l.year
      )
      SELECT
        users.id,
        max(users.name),
        max(users.image),
        sum(CASE WHEN month = ${months(0)} AND year = ${years(0)} THEN score ELSE 0 END) AS "First",
        sum(CASE WHEN month = ${months(1)} AND year = ${years(1)} THEN score ELSE 0 END) AS "Second",
        sum(CASE WHEN month = ${months(2)} AND year = ${years(2)} THEN score ELSE 0 END) AS "Third",
        sum(CASE WHEN month = ${months(3)} AND year = ${years(3)} THEN score ELSE 0 END) AS "Fourth",
        sum(CASE WHEN month = ${months(4)} AND year = ${years(4)} THEN score ELSE 0 END) AS "Fifth",
        sum(CASE WHEN month = ${months(5)} AND year = ${years(5)} THEN score ELSE 0 END) AS "Sixth",
        sum(CASE WHEN month = ${months(6)} AND year = ${years(6)} THEN score ELSE 0 END) AS "Seventh",
        sum(CASE WHEN month = ${months(7)} AND year = ${years(7)} THEN score ELSE 0 END) AS "Eigth",
        sum(CASE WHEN month = ${months(8)} AND year = ${years(8)} THEN score ELSE 0 END) AS "Nineth",
        sum(CASE WHEN month = ${months(9)} AND year = ${years(9)} THEN score ELSE 0 END) AS "Tenth",
        sum(CASE WHEN month = ${months(10)} AND year = ${years(10)} THEN score ELSE 0 END) AS "Eleventh",
        sum(CASE WHEN month = ${months(11)} AND year = ${years(11)} THEN score ELSE 0 END) AS "Twelth"
      FROM scores
      INNER JOIN users
      ON users.id = scores.player_id
      GROUP BY users.id
      ORDER BY 15 desc;
    """.query[MonthTotal]
    .to[List]

  def getConditionalMonthsQuery(leagueId: Int, months: List[Int], years: List[Int], userId: Int) =
    sql"""
      WITH scores as
        (SELECT
          COALESCE(w.player_id, l.player_id) as player_id,
          COALESCE(w.month, l.month) as month,
          COALESCE(w.year, l.year) as year,
          COALESCE(w.count, 0)-COALESCE(l.count,0) AS score
        FROM
          (SELECT
            winner_id AS player_id,
            EXTRACT(MONTH FROM date_played) AS month,
            EXTRACT(YEAR FROM date_played) AS year,
            COUNT(*)
          FROM games
          WHERE league_id = ${leagueId}
          AND loser_id = ${userId}
          GROUP BY 1,2,3
        ) w
        FULL OUTER JOIN
          (SELECT
            loser_id AS player_id,
            EXTRACT(MONTH FROM date_played) AS month,
            EXTRACT(YEAR FROM date_played) AS year,
            COUNT(*)
          FROM games
          WHERE league_id = ${leagueId}
          AND winner_id = ${userId}
          GROUP BY 1,2,3
        ) l
        ON w.player_id = l.player_id
        AND w.month = l.month
        AND w.year = l.year
      )
      SELECT
        users.id,
        max(users.name),
        max(users.image),
        sum(CASE WHEN month = ${months(0)} AND year = ${years(0)} THEN score ELSE 0 END) AS "First",
        sum(CASE WHEN month = ${months(1)} AND year = ${years(1)} THEN score ELSE 0 END) AS "Second",
        sum(CASE WHEN month = ${months(2)} AND year = ${years(2)} THEN score ELSE 0 END) AS "Third",
        sum(CASE WHEN month = ${months(3)} AND year = ${years(3)} THEN score ELSE 0 END) AS "Fourth",
        sum(CASE WHEN month = ${months(4)} AND year = ${years(4)} THEN score ELSE 0 END) AS "Fifth",
        sum(CASE WHEN month = ${months(5)} AND year = ${years(5)} THEN score ELSE 0 END) AS "Sixth",
        sum(CASE WHEN month = ${months(6)} AND year = ${years(6)} THEN score ELSE 0 END) AS "Seventh",
        sum(CASE WHEN month = ${months(7)} AND year = ${years(7)} THEN score ELSE 0 END) AS "Eigth",
        sum(CASE WHEN month = ${months(8)} AND year = ${years(8)} THEN score ELSE 0 END) AS "Nineth",
        sum(CASE WHEN month = ${months(9)} AND year = ${years(9)} THEN score ELSE 0 END) AS "Tenth",
        sum(CASE WHEN month = ${months(10)} AND year = ${years(10)} THEN score ELSE 0 END) AS "Eleventh",
        sum(CASE WHEN month = ${months(11)} AND year = ${years(11)} THEN score ELSE 0 END) AS "Twelth"
      FROM scores
      INNER JOIN users
      ON users.id = scores.player_id
      GROUP BY users.id
      ORDER BY 15 desc;
    """.query[MonthTotal]
    .to[List]

  def getConditionalWinLossRecords(leagueId: Int, userId: Int)(implicit xb: Transactor[IO]): List[WinLossRecord] =
    getConditionalWinLossRecordsQuery(leagueId, userId).transact(xb).unsafeRunSync

  def getWinLossRecords(leagueId: Int)(implicit xb: Transactor[IO]): List[WinLossRecord] =
    getWinLossRecordsQuery(leagueId).transact(xb).unsafeRunSync

  def getMonthTotals(leagueId: Int)(implicit xb: Transactor[IO]): List[MonthTotal] = {
    val now = DateTime.now
    val (months, years) = (0 to 11).foldRight[(List[Int], List[Int])]((List(), List())){ case (n, (months, years)) =>
      val date = now.plusMonths((-1)*n)
      (date.month.get::months, date.year.get::years)
    }
    getMonthTotalsQuery(leagueId, months.reverse, years.reverse).transact(xb).unsafeRunSync
  }

  def getConditionalMonths(leagueId: Int, userId: Int)(implicit xb: Transactor[IO]): List[MonthTotal] = {
    val now = DateTime.now
    val (months, years) = (0 to 11).foldRight[(List[Int], List[Int])]((List(), List())){ case (n, (months, years)) =>
      val date = now.plusMonths((-1)*n)
      (date.month.get::months, date.year.get::years)
    }
    getConditionalMonthsQuery(leagueId, months.reverse, years.reverse, userId).transact(xb).unsafeRunSync
  }
}
