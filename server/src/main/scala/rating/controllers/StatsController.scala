package rating.controllers

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import rating.models.{Stats, WinLossRecord, MonthTotal}
import rating.repositories.{StatsRepository, LeagueRepository}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}


trait StatsController[F[_]]{
  def getStats: F[Stats]
}

object StatsController {
  implicit def apply[F[_]](implicit ev: StatsController[F]): StatsController[F] = ev

  object Encoders {
    implicit def statsEntityEncoder[F[_]: Applicative]: EntityEncoder[F, Stats] =
      jsonEncoderOf[F, Stats]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): StatsController[F] = new StatsController[F]{
    def getStats: F[Stats] = {
      val leagues = LeagueRepository.getAll
      val leagueIdAndWinLossRecords: List[(Int, List[WinLossRecord])] = leagues.map(league => {
        (league.id, StatsRepository.getWinLossRecords(league.id)),
      })
      val leagueIdAndMonthTotals: List[(Int, List[MonthTotal])] = leagues.map(league => {
        (league.id, StatsRepository.getMonthTotals(league.id)),
      })
      Stats(
        leagueIdAndWinLossRecords,
        leagueIdAndMonthTotals
      ).pure[F]
    }
  }

}
