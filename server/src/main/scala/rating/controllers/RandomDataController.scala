package rating.controllers

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import rating.models.{Rating, User, LeagueWithRatings, Game}
import rating.repositories.{LeagueRepository, RatingRepository, UserRepository, GameRepository, WithId}

import doobie._
import doobie.implicits._
import doobie.hikari._
import cats.effect.{ExitCode, IO, IOApp}



trait RandomDataController[F[_]]{
  def simulate: F[Unit]
}

object RandomDataController {
  implicit def apply[F[_]](implicit ev: RandomDataController[F]): RandomDataController[F] = ev

  object Encoders {
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): RandomDataController[F] = new RandomDataController[F]{
    def simulateGame(
      rng: scala.util.Random,
      users: List[WithId[User]]): (WithId[User], WithId[User]) = {
        val firstIndex = rng.nextInt(users.length)
        var secondIndex = rng.nextInt(users.length)
        while (firstIndex == secondIndex) {
          secondIndex = rng.nextInt(users.length)
        }
        val isFirstWinner = rng.nextBoolean()
        if (isFirstWinner) {
          (users(firstIndex), users(secondIndex))
        } else {
          (users(secondIndex), users(firstIndex))
        }
    }
    def simulate: F[Unit] = {
      val leagues = LeagueRepository.getAll
      val users = UserRepository.getAll
      val rng = new scala.util.Random()
      leagues.foreach{ league =>
        (1 to 5).foreach{ _ =>
          val (userA, userB) = simulateGame(rng, users)
          val newGame = Game(league.id, userA.id, userB.id, "")
          val _ = for {
            WithId(winnerRatingId, oldWinnerRating) <- RatingRepository
              .getByUserIdAndLeagueId(newGame.winner_id, newGame.league_id)
              .orElse(
                RatingRepository.add(Rating(newGame.league_id, newGame.winner_id, 0, 1500))
              )
            newWinnerRating = oldWinnerRating.copy(rating=oldWinnerRating.rating + 50)
            _ = RatingRepository.add(newWinnerRating)
            WithId(loserRatingId, oldLoserRating) <- RatingRepository
              .getByUserIdAndLeagueId(newGame.loser_id, newGame.league_id)
              .orElse(
                RatingRepository.add(Rating(newGame.league_id, newGame.loser_id, 0, 1500))
              )
            newLoserRating = oldLoserRating.copy(rating=oldLoserRating.rating - 50)
            _ = RatingRepository.add(newLoserRating)
            game <- GameRepository.add(newGame)
          } yield ()
        }
      }
      ()
    }.pure[F]
  }
}
