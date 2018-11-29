package rating.repositories

import doobie.hikari.imports._

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

trait Repository[T] {

  implicit val han = LogHandler.jdkLogHandler

  def getAllQuery: ConnectionIO[List[WithId[T]]]
  def getQuery(id: Int): ConnectionIO[Option[WithId[T]]]
  def addQuery(newT: T): ConnectionIO[Option[Int]]
  def updateQuery(t: WithId[T]): ConnectionIO[Int]
  def deleteQuery(id: Int): ConnectionIO[Int]

  def getAll(implicit xb: Transactor[IO]): List[WithId[T]]
  def get(id: Int)(implicit xb: Transactor[IO]): Option[WithId[T]]
  def add(newT: T)(implicit xb: Transactor[IO]): Option[WithId[T]]
  def update(t: WithId[T])(implicit xb: Transactor[IO]): Int
  def delete(id: Int)(implicit xb: Transactor[IO]): Int

  // Uncomment for simple sql connection without the connection pool.
  //
  // // We need a ContextShift[IO] before we can construct a Transactor[IO]. The passed ExecutionContext
  // // is where nonblocking operations will be executed.
  // implicit val cs = IO.contextShift(ExecutionContext.global)

  // // A transactor that gets connections from java.sql.DriverManager and excutes blocking operations
  // // on an unbounded pool of daemon threads. See the chapter on connection handling for more info.
  // val xa = Transactor.fromDriverManager[IO](
  //   "org.postgresql.Driver", // driver classname
  //   "jdbc:postgresql:ratings", // connect URL (driver-specific)
  //   "postgres",              // user
  //   ""                       // password
  // )

}
