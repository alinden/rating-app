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
    sql""
      .query[WinLossRecord]
      .to[List]

  def getWinLossRecords(leagueId: Int)(implicit xb: Transactor[IO]): List[WinLossRecord] =
    getWinLossRecordsQuery(leagueId).transact(xb).unsafeRunSync
}
