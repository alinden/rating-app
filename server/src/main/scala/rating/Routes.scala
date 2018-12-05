package rating

import cats.effect.{Sync, ContextShift, IO}
import cats.implicits._
import io.circe.Json
import org.http4s.circe._
import org.http4s.dsl.Http4sDsl
import org.http4s.dsl.io._
import org.http4s.{HttpRoutes, StaticFile}
import java.io.File
import java.util.concurrent._
import scala.concurrent.ExecutionContext

import rating.models._
import rating.repositories.WithId
import rating.controllers._

object Routes {

  val blockingEc = ExecutionContext.fromExecutorService(Executors.newFixedThreadPool(4))

  def userRoutes[F[_]: Sync](U: UserController[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    import UserController.Encoders._
    HttpRoutes.of[F] {
      case GET -> Root / "api" / "users" =>
        for {
          user <- U.all
          response <- Ok(user)
        } yield response
      case GET -> Root / "api" / "users" / id => Ok(U.get(id.toInt))
      case req @ POST -> Root / "api"/ "users" => for {
        newUser <- req.as[User]
        resp <- Ok(U.add(newUser))
      } yield resp
      case req @ PUT -> Root / "api" / "users" / id => for {
        user <- req.as[User]
        resp <- Ok(U.update(WithId(id.toInt, user)))
      } yield resp
      case req @ DELETE -> Root / "api" / "users" / id => for {
        resp <- Ok(U.delete(id.toInt))
      } yield resp
    }
  }

  def leagueRoutes[F[_]: Sync](U: LeagueController[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    import LeagueController.Encoders._
    HttpRoutes.of[F] {
      case GET -> Root / "api" / "leagues" =>
        for {
          league <- U.all
          response <- Ok(league)
        } yield response
      case GET -> Root / "api" / "leagues" / id => Ok(U.get(id.toInt))
      case req @ POST -> Root / "api" / "leagues" => for {
        newLeague <- req.as[League]
        resp <- Ok(U.add(newLeague))
      } yield resp
      case req @ PUT -> Root / "api" / "leagues" / id => for {
        league <- req.as[League]
        resp <- Ok(U.update(WithId(id.toInt, league)))
      } yield resp
      case req @ DELETE -> Root / "api" / "leagues" / id => for {
        resp <- Ok(U.delete(id.toInt))
      } yield resp
    }
  }

  def gameRoutes[F[_]: Sync](U: GameController[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    import GameController.Encoders._
    HttpRoutes.of[F] {
      case GET -> Root / "api" / "games" =>
        for {
          game <- U.all
          response <- Ok(game)
        } yield response
      case GET -> Root / "api" / "leagues-with-games" =>
        for {
          leaguesWithGames <- U.leaguesWithGames
          response <- Ok(leaguesWithGames)
        } yield response
      case GET -> Root / "api" / "league-with-games" / id =>
        for {
          leagueWithGames <- U.leagueWithGames(id.toInt)
          response <- Ok(leagueWithGames)
        } yield response
      case GET -> Root / "api" / "games" / id => Ok(U.get(id.toInt))
      case req @ POST -> Root / "api" / "games" => for {
        newGame <- req.as[Game]
        resp <- Ok(U.add(newGame))
      } yield resp
      case req @ PUT -> Root / "api" / "games" / id => for {
        game <- req.as[Game]
        resp <- Ok(U.update(WithId(id.toInt, game)))
      } yield resp
      case req @ DELETE -> Root / "api" / "games" / id => for {
        resp <- Ok(U.delete(id.toInt))
      } yield resp
    }
  }

  def ratingRoutes[F[_]: Sync](U: RatingController[F]): HttpRoutes[F] = {
    val dsl = new Http4sDsl[F]{}
    import dsl._
    import RatingController.Encoders._
    HttpRoutes.of[F] {
      case GET -> Root / "api" / "ratings" =>
        for {
          rating <- U.all
          response <- Ok(rating)
        } yield response
      case GET -> Root / "api" / "ratings" / id => Ok(U.get(id.toInt))
      case GET -> Root / "api" / "leagues-with-ratings" =>
        for {
          leaguesWithRatings <- U.leaguesWithRatings
          response <- Ok(leaguesWithRatings)
        } yield response
      case GET -> Root / "api" / "league-with-ratings" / id =>
        for {
          leagueWithRatings <- U.leagueWithRatings(id.toInt)
          response <- Ok(leagueWithRatings)
        } yield response
    }
  }
}
