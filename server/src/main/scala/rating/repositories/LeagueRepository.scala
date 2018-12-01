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
    sql"""
      select league_id, league_name, league_image from (
        select
          leagues.id league_id, leagues.name league_name, leagues.image league_image, max(ratings.id) rating_id
        from leagues
        left join ratings
          on ratings.league_id = leagues.id
        group by leagues.id, leagues.name, leagues.image
      ) leagues_with_max_rating_id
      order by case when rating_id is null then 1 else 0 end, rating_id desc;
    """.query[WithId[League]]
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
