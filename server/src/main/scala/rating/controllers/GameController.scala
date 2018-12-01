package rating.controllers

import com.github.esap120.scala_elo.{Player => EloPlayer, KFactor}

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import rating.models.{Rating, Game, LeagueWithGames}
import rating.repositories.{GameRepository, LeagueRepository, RatingRepository, WithId}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}


trait GameController[F[_]]{
  def all: F[List[WithId[Game]]]
  def leaguesWithGames: F[List[LeagueWithGames]]
  def get(id: Int): F[WithId[Game]]
  def add(newGame: Game): F[Unit]
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
    implicit def gameWithRatingsEntityEncoder[F[_]: Applicative]: EntityEncoder[F, Game] =
      jsonEncoderOf[F, Game]
    implicit def leagueWithGamesEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[LeagueWithGames]] =
      jsonEncoderOf[F, List[LeagueWithGames]]
    implicit def newGameEntityDecoder[F[_]: Sync]: EntityDecoder[F, Game] =
      jsonOf[F, Game]
    implicit def gameEntityDecoder[F[_]: Sync]: EntityDecoder[F, WithId[Game]] =
      jsonOf[F, WithId[Game]]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): GameController[F] = new GameController[F]{

    def getNewRatings(
      oldWinnerRating: Rating,
      oldLoserRating: Rating,
      gameId: Int
    ): (Rating, Rating) = {
      val winnerEloPlayer: EloPlayer = new EloPlayer(rating=oldWinnerRating.new_rating)
      val loserEloPlayer: EloPlayer = new EloPlayer(rating=oldLoserRating.new_rating)
      winnerEloPlayer wins loserEloPlayer
      winnerEloPlayer.updateRating(KFactor.USCF)
      loserEloPlayer.updateRating(KFactor.USCF)
      val newWinnerRating = oldWinnerRating.copy(
        new_rating = winnerEloPlayer.rating,
        previous_rating = oldWinnerRating.new_rating,
        last_game_id = gameId
      )
      val newLoserRating = oldLoserRating.copy(
        new_rating = loserEloPlayer.rating,
        previous_rating = oldLoserRating.new_rating,
        last_game_id = gameId
      )
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
    def add(newGame: Game): F[Unit] = {
      for {
        game <- GameRepository.add(newGame)
        WithId(winnerRatingId, oldWinnerRating) <- RatingRepository
          .getByUserIdAndLeagueId(newGame.winner_id, newGame.league_id)
          .orElse(
            RatingRepository.add(Rating(newGame.league_id, newGame.winner_id, 0, 1500, 1500))
          )
        WithId(loserRatingId, oldLoserRating) <- RatingRepository
          .getByUserIdAndLeagueId(newGame.loser_id, newGame.league_id)
          .orElse(
            RatingRepository.add(Rating(newGame.league_id, newGame.loser_id, 0, 1500, 1500))
          )
        (newWinnerRating, newLoserRating) = getNewRatings(oldWinnerRating, oldLoserRating, game.id)
        _ = RatingRepository.add(newWinnerRating)
        _ = RatingRepository.add(newLoserRating)
      } yield ()
      ().pure[F]
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
