package com.raybeam.rating.controllers

import com.github.esap120.scala_elo.{Player => EloPlayer, KFactor}

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import com.raybeam.rating.models.{Rating, Game, GameWithRatings, LeagueWithGames}
import com.raybeam.rating.repositories.{GameRepository, LeagueRepository, RatingRepository, WithId}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}


trait GameController[F[_]]{
  def all: F[List[WithId[Game]]]
  def leaguesWithGames: F[List[LeagueWithGames]]
  def get(id: Int): F[WithId[Game]]
  def add(newGame: Game): F[GameWithRatings]
  def update(game: WithId[Game]): F[Unit]
  def delete(id: Int): F[Unit]
}

object GameController {
  implicit def apply[F[_]](implicit ev: GameController[F]): GameController[F] = ev

  object Encoders {
    implicit def gameListEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[WithId[Game]]] =
      jsonEncoderOf[F, List[WithId[Game]]]
    implicit def gameEntityEncoder[F[_]: Applicative]: EntityEncoder[F, WithId[Game]] =
      jsonEncoderOf[F, WithId[Game]]
    implicit def gameWithRatingsEntityEncoder[F[_]: Applicative]: EntityEncoder[F, GameWithRatings] =
      jsonEncoderOf[F, GameWithRatings]
    implicit def leagueWithGamesEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[LeagueWithGames]] =
      jsonEncoderOf[F, List[LeagueWithGames]]
    implicit def newGameEntityDecoder[F[_]: Sync]: EntityDecoder[F, Game] =
      jsonOf[F, Game]
    implicit def gameEntityDecoder[F[_]: Sync]: EntityDecoder[F, WithId[Game]] =
      jsonOf[F, WithId[Game]]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): GameController[F] = new GameController[F]{
    def getNewRatings(oldWinnerRating: Rating, oldLoserRating: Rating): (Rating, Rating) = {
      val winnerEloPlayer: EloPlayer = new EloPlayer(rating=oldWinnerRating.rating)
      val loserEloPlayer: EloPlayer = new EloPlayer(rating=oldLoserRating.rating)
      winnerEloPlayer wins loserEloPlayer
      winnerEloPlayer.updateRating(KFactor.USCF)
      loserEloPlayer.updateRating(KFactor.USCF)
      val newWinnerRating = oldWinnerRating.copy(rating=winnerEloPlayer.rating)
      val newLoserRating = oldLoserRating.copy(rating=loserEloPlayer.rating)
      (newWinnerRating, newLoserRating)
    }
    def leaguesWithGames: F[List[LeagueWithGames]] = {
      val leagues = LeagueRepository.getAll
      val leaguesWithGames = leagues
        .map(x => LeagueWithGames(x, GameRepository.getByLeague(x)))
      leaguesWithGames.pure[F]
    }
    def all: F[List[WithId[Game]]] = GameRepository.getAll.pure[F]
    def get(id: Int): F[WithId[Game]] = GameRepository.get(id).get.pure[F]
    /**
     * Add a new game.
     *
     * This will update the ratings of both players.
     */
    def add(newGame: Game): F[GameWithRatings] = {
      val gameWithRatings = for {
        WithId(winnerRatingId, oldWinnerRating) <- RatingRepository
          .getByUserIdAndLeagueId(newGame.winner_id, newGame.league_id)
          .orElse(
            RatingRepository.add(Rating(newGame.league_id, newGame.winner_id, 0, 1500))
          )
        WithId(loserRatingId, oldLoserRating) <- RatingRepository
          .getByUserIdAndLeagueId(newGame.loser_id, newGame.league_id)
          .orElse(
            RatingRepository.add(Rating(newGame.league_id, newGame.loser_id, 0, 1500))
          )
        (newWinnerRating, newLoserRating) = getNewRatings(oldWinnerRating, oldLoserRating)
        _ = RatingRepository.add(newWinnerRating)
        _ = RatingRepository.add(newLoserRating)
        game <- GameRepository.add(newGame)
      } yield GameWithRatings(game, WithId(winnerRatingId, newWinnerRating), WithId(loserRatingId, newLoserRating))
      gameWithRatings.get.pure[F]
    }
    def update(game: WithId[Game]): F[Unit] = {
      GameRepository.update(game)
      ().pure[F]
    }
    def delete(id: Int): F[Unit] = {
      GameRepository.delete(id)
      ().pure[F]
    }
  }
}
