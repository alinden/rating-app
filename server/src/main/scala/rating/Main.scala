package rating

import cats.effect.{ExitCode, IO, IOApp}
import cats.implicits._
import cats.effect._

import cats.implicits._
import doobie._
import doobie.implicits._
import doobie.hikari._

object Main extends IOApp {

  val transactor: Resource[IO, HikariTransactor[IO]] =
    for {
      ce <- ExecutionContexts.fixedThreadPool[IO](32) // our connect EC
      te <- ExecutionContexts.cachedThreadPool[IO]    // our transaction EC
      xa <- HikariTransactor.newHikariTransactor[IO](
      "org.postgresql.Driver",                        // driver classname
      "jdbc:postgresql:ratings",                     // connect URL
      "postgres",                                   // username
      "",                                     // password
      ce,                                     // await connection here
      te                                      // execute JDBC operations here
    )
  } yield xa

  def run(args: List[String]) = {
    transactor.use{ implicit xa =>
      Server.stream[IO].compile.drain.as(ExitCode.Success)
    }
  }
}
