package rating.controllers

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import rating.models.League
import rating.repositories.{WithId, LeagueRepository}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}


trait LeagueController[F[_]]{
  def all: F[List[WithId[League]]]
  def get(id: Int): F[WithId[League]]
  def add(newLeague: League): F[WithId[League]]
  def update(league: WithId[League]): F[Unit]
  def delete(id: Int): F[Unit]
}

object LeagueController {
  implicit def apply[F[_]](implicit ev: LeagueController[F]): LeagueController[F] = ev

  object Encoders {
    implicit def leagueListEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[WithId[League]]] =
      jsonEncoderOf[F, List[WithId[League]]]
    implicit def leagueEntityEncoder[F[_]: Applicative]: EntityEncoder[F, WithId[League]] =
      jsonEncoderOf[F, WithId[League]]
    implicit def newLeagueEntityDecoder[F[_]: Sync]: EntityDecoder[F, League] =
      jsonOf[F, League]
    implicit def leagueEntityDecoder[F[_]: Sync]: EntityDecoder[F, WithId[League]] =
      jsonOf[F, WithId[League]]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): LeagueController[F] = new LeagueController[F]{
    def all: F[List[WithId[League]]] = LeagueRepository.getAll.pure[F]
    def get(id: Int): F[WithId[League]] = LeagueRepository.get(id).get.pure[F]
    def add(newLeague: League): F[WithId[League]] = {
      LeagueRepository.add(newLeague).get.pure[F]
    }
    def update(league: WithId[League]): F[Unit] = {
      LeagueRepository.update(league)
      ().pure[F]
    }
    def delete(id: Int): F[Unit] = {
      LeagueRepository.delete(id)
      ().pure[F]
    }
  }
}
