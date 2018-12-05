package rating.controllers

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import rating.models.{Rating, LeagueWithRatings}
import rating.repositories.{RatingRepository, LeagueRepository, WithId}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}


trait RatingController[F[_]]{
  def all: F[List[WithId[Rating]]]
  def get(id: Int): F[WithId[Rating]]
  def leaguesWithRatings: F[List[LeagueWithRatings]]
  def leagueWithRatings(id: Int): F[LeagueWithRatings]
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
    implicit def leaguesWithRatingsEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[LeagueWithRatings]] =
      jsonEncoderOf[F, List[LeagueWithRatings]]
    implicit def leagueWithRatingsEntityEncoder[F[_]: Applicative]: EntityEncoder[F, LeagueWithRatings] =
      jsonEncoderOf[F, LeagueWithRatings]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): RatingController[F] = new RatingController[F]{
    def leaguesWithRatings: F[List[LeagueWithRatings]] = {
      val leagues = LeagueRepository.getAll
      val leaguesWithRatings = leagues
        .map(x => LeagueWithRatings(x, RatingRepository.getByLeague(x)))
      leaguesWithRatings.pure[F]
    }
    def leagueWithRatings(id: Int): F[LeagueWithRatings] = {
      val league = LeagueRepository.get(id).get
      LeagueWithRatings(league, RatingRepository.getByLeague(league)).pure[F]
    }
    def all: F[List[WithId[Rating]]] = RatingRepository.getAll.pure[F]
    def get(id: Int): F[WithId[Rating]] = RatingRepository.get(id).get.pure[F]
  }
}
