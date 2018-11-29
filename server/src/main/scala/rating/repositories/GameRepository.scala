package rating.repositories

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

import rating.models.{RatedGame, Game, League}

object GameRepository extends Repository[Game] {
  override val getAllQuery =
    sql"select id, league_id, winner_id, loser_id, date_played from games order by id desc"
      .query[WithId[Game]]
      .to[List]

  override def getQuery(id: Int) =
    sql"select id, league_id, winner_id, loser_id, date_played from games where id = ${id}"
      .query[WithId[Game]]
      .option

  def getByLeagueQuery(league: WithId[League]) =
    sql"""
      select
        winners.id as winner_id,
        winners.name as winner_name,
        winners.image as winner_image,
        winner_ratings.rating as winner_rating,
        losers.id as loser_id,
        losers.name as loser_name,
        losers.image as loser_image,
        loser_ratings.rating as loser_rating
      from
        (select * from games where league_id = ${league.id}) games
        inner join users winners
          on games.winner_id = winners.id
        inner join (
          select
            recent_ratings.id id,
            recent_ratings.user_id user_id,
            ratings.rating
          from (
            select
              max(ratings.id) id,
              ratings.user_id
            from ratings
            group by ratings.user_id
          ) recent_ratings
          inner join ratings
          on recent_ratings.id = ratings.id
        ) winner_ratings
          on winner_ratings.user_id = games.winner_id
        inner join users losers
          on games.loser_id = losers.id
        inner join (
          select
            recent_ratings.id id,
            recent_ratings.user_id user_id,
            ratings.rating
          from (
            select
              max(ratings.id) id,
              ratings.user_id
            from ratings
            group by ratings.user_id
          ) recent_ratings
          inner join ratings
          on recent_ratings.id = ratings.id
        ) loser_ratings
          ON losers.id = loser_ratings.user_id
      order by games.id desc;
    """
      .query[RatedGame]
      .to[List]

  override def addQuery(newGame: Game) =
    sql"insert into games (league_id, winner_id, loser_id, date_played) values (${newGame.league_id}, ${newGame.winner_id}, ${newGame.loser_id}, ${newGame.date_played}) returning id"
      .query[Int]
      .option

  override def updateQuery(game: WithId[Game]) =
    sql"update games set league_id = ${game.entity.league_id}, winner_id = ${game.entity.winner_id}, loser_id = ${game.entity.loser_id}, date_played = ${game.entity.date_played}  where id = ${game.id}"
      .update
      .run

  override def deleteQuery(id: Int) =
    sql"delete from games where id = $id"
      .update
      .run

  override def getAll(implicit xb: Transactor[IO]): List[WithId[Game]] = getAllQuery.transact(xb).unsafeRunSync
  override def get(id: Int)(implicit xb: Transactor[IO]): Option[WithId[Game]] = getQuery(id).transact(xb).unsafeRunSync
  def getByLeague(league: WithId[League])(implicit xb: Transactor[IO]): List[RatedGame] = getByLeagueQuery(league).transact(xb).unsafeRunSync
  override def add(newGame: Game)(implicit xb: Transactor[IO]): Option[WithId[Game]] = for {
    id <- addQuery(newGame).transact(xb).unsafeRunSync
    game <- getQuery(id).transact(xb).unsafeRunSync
  } yield game
  override def update(game: WithId[Game])(implicit xb: Transactor[IO]): Int = updateQuery(game).transact(xb).unsafeRunSync
  override def delete(id: Int)(implicit xb: Transactor[IO]): Int = deleteQuery(id).transact(xb).unsafeRunSync
}
