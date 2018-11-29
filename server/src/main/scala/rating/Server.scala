package rating

import cats.effect.{ConcurrentEffect, Effect, ExitCode, IO, IOApp, Timer, ContextShift}
import cats.implicits._
import org.http4s.server.blaze.BlazeServerBuilder
import org.http4s.client.blaze.BlazeClientBuilder
import org.http4s.implicits._
import fs2.Stream
import scala.concurrent.ExecutionContext.global

import rating.controllers._

import org.http4s.server.middleware.Logger

import cats.effect.{ExitCode, IO, IOApp}
import cats.implicits._
import cats.effect._

import cats.implicits._
import doobie._
import doobie.implicits._
import doobie.hikari._

object Server {

  def stream[F[_]: ConcurrentEffect](implicit xa: Transactor[IO], T: Timer[F], C: ContextShift[F]): Stream[F, Nothing] = {

    for {
      client <- BlazeClientBuilder[F](global).stream

      userController = UserController.impl[F]
      leagueController = LeagueController.impl[F]
      gameController = GameController.impl[F]
      ratingController = RatingController.impl[F]
      randomDataController = RandomDataController.impl[F]

      // Combine Service Routes into an HttpApp
      // Can also be done via a Router if you
      // want to extract a segments not checked
      // in the underlying routes.
      httpApp = (
        Routes.randomDataRoutes[F](randomDataController) <+>
        Routes.userRoutes[F](userController) <+>
        Routes.leagueRoutes[F](leagueController) <+>
        Routes.gameRoutes[F](gameController) <+>
        Routes.ratingRoutes[F](ratingController)
      ).orNotFound

      // With Middlewares in place
      finalHttpApp = Logger(true, true)(httpApp)


      exitCode <- BlazeServerBuilder[F]
        .bindHttp(8080, "0.0.0.0")
        .withHttpApp(finalHttpApp)
        .serve
    } yield exitCode
  }.drain
}
