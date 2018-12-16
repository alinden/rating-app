package rating.repositories

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

import rating.models.{WinLossRecord}

object StatsRepository {
  def getWinLossRecordsQuery(leagueId: Int) =
    sql"""
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
          count(1) as num_wins
        from
          users
        left outer join games
          on users.id = games.winner_id
        where games.league_id = ${leagueId}
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
        where games.league_id = ${leagueId}
        group by users.id
      ) losses
        on users.id = losses.user_id;
      """.query[WinLossRecord]
      .to[List]

  def getWinLossRecords(leagueId: Int)(implicit xb: Transactor[IO]): List[WinLossRecord] =
    getWinLossRecordsQuery(leagueId).transact(xb).unsafeRunSync
}
