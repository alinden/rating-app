package rating.controllers

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import rating.models.{Rating, LeagueWithRatings, RatingHistory}
import rating.repositories.{RatingRepository, LeagueRepository, WithId}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}


trait RatingController[F[_]]{
  def leagueWithRatings(id: Int): F[LeagueWithRatings]
  def getRatingHistory(userId: Int, leagueId: Int): F[RatingHistory]
}

object RatingController {
  implicit def apply[F[_]](implicit ev: RatingController[F]): RatingController[F] = ev

  object Encoders {
    implicit def ratingListEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[WithId[Rating]]] =
      jsonEncoderOf[F, List[WithId[Rating]]]
    implicit def ratingEntityEncoder[F[_]: Applicative]: EntityEncoder[F, WithId[Rating]] =
      jsonEncoderOf[F, WithId[Rating]]
    implicit def newRatingEntityDecoder[F[_]: Sync]: EntityDecoder[F, Rating] =
      jsonOf[F, Rating]
    implicit def ratingEntityDecoder[F[_]: Sync]: EntityDecoder[F, WithId[Rating]] =
      jsonOf[F, WithId[Rating]]
    implicit def leagueWithRatingsEntityEncoder[F[_]: Applicative]: EntityEncoder[F, LeagueWithRatings] =
      jsonEncoderOf[F, LeagueWithRatings]
    implicit def ratingHistoryEntityEncoder[F[_]: Applicative]: EntityEncoder[F, RatingHistory] =
      jsonEncoderOf[F, RatingHistory]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): RatingController[F] = new RatingController[F]{
    def leagueWithRatings(id: Int): F[LeagueWithRatings] = {
      val league = LeagueRepository.get(id).get
      LeagueWithRatings(league, RatingRepository.getByLeague(league)).pure[F]
    }
    def getRatingHistory(userId: Int, leagueId: Int): F[RatingHistory] = {
      val league = LeagueRepository.get(leagueId).get
      val records = RatingRepository.getRatingHistoryRecords(userId, leagueId)
      RatingHistory(league.entity.name, records).pure[F]
    }
  }
}
