package rating.repositories

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

import rating.models.League

object LeagueRepository extends Repository[League] {
  override val getAllQuery =
    sql"select id, name, image from leagues"
      .query[WithId[League]]
      .to[List]

  override def getQuery(id: Int) =
    sql"select id, name, image from leagues where id = ${id}"
      .query[WithId[League]]
      .option

  override def addQuery(newLeague: League) =
    sql"insert into leagues (name, image) values (${newLeague.name}, ${newLeague.image}) returning id"
      .query[Int]
      .option

  override def updateQuery(league: WithId[League]) =
    sql"update leagues set name = ${league.entity.name}, image = ${league.entity.image} where id = ${league.id}"
      .update
      .run

  override def deleteQuery(id: Int) =
    sql"delete from leagues where id = $id"
      .update
      .run

  override def getAll(implicit xb: Transactor[IO]): List[WithId[League]] = getAllQuery.transact(xb).unsafeRunSync
  override def get(id: Int)(implicit xb: Transactor[IO]): Option[WithId[League]] = getQuery(id).transact(xb).unsafeRunSync
  override def add(newLeague: League)(implicit xb: Transactor[IO]): Option[WithId[League]] = for {
    id <- addQuery(newLeague).transact(xb).unsafeRunSync
    league <- getQuery(id).transact(xb).unsafeRunSync
  } yield league
  override def update(league: WithId[League])(implicit xb: Transactor[IO]): Int = updateQuery(league).transact(xb).unsafeRunSync
  override def delete(id: Int)(implicit xb: Transactor[IO]): Int = deleteQuery(id).transact(xb).unsafeRunSync
}
