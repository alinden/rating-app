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
        winners.id,
        winners.name,
        winners.image,
        winner_ratings.id,
        winner_ratings.league_id,
        winner_ratings.user_id,
        winner_ratings.last_game_id,
        winner_ratings.new_rating,
        winner_ratings.previous_rating,
        losers.id,
        losers.name,
        losers.image,
        loser_ratings.id,
        loser_ratings.league_id,
        loser_ratings.user_id,
        loser_ratings.last_game_id,
        loser_ratings.new_rating,
        loser_ratings.previous_rating,
        games.date_played
      from
        (select * from games where league_id = ${league.id}) games
        inner join users winners
          on games.winner_id = winners.id
        inner join users losers
          on games.loser_id = losers.id
        inner join ratings winner_ratings
          on games.id = winner_ratings.last_game_id and winners.id = winner_ratings.user_id
        inner join ratings loser_ratings
          on games.id = loser_ratings.last_game_id and losers.id = loser_ratings.user_id
      order by games.id desc;
    """
      .query[RatedGame]
      .to[List]

  def getByUserAndLeagueQuery(userId: Int, leagueId: Int) =
    sql"""
      select
        winners.id,
        winners.name,
        winners.image,
        winner_ratings.id,
        winner_ratings.league_id,
        winner_ratings.user_id,
        winner_ratings.last_game_id,
        winner_ratings.new_rating,
        winner_ratings.previous_rating,
        losers.id,
        losers.name,
        losers.image,
        loser_ratings.id,
        loser_ratings.league_id,
        loser_ratings.user_id,
        loser_ratings.last_game_id,
        loser_ratings.new_rating,
        loser_ratings.previous_rating,
        games.date_played
      from
        (select * from games where league_id = ${leagueId} and (winner_id = ${userId} or loser_id = ${userId})) games
        inner join users winners
          on games.winner_id = winners.id
        inner join users losers
          on games.loser_id = losers.id
        inner join ratings winner_ratings
          on games.id = winner_ratings.last_game_id and winners.id = winner_ratings.user_id
        inner join ratings loser_ratings
          on games.id = loser_ratings.last_game_id and losers.id = loser_ratings.user_id
      order by games.id desc;
    """
      .query[RatedGame]
      .to[List]

  override def addQuery(newGame: Game) =
    sql"""
      insert into games
        (league_id, winner_id, loser_id, date_played)
        values (
          ${newGame.league_id},
          ${newGame.winner_id},
          ${newGame.loser_id},
          CURRENT_TIMESTAMP
        ) returning id
      """.query[Int]
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
  def getByUserAndLeague(userId: Int, leagueId: Int)(implicit xb: Transactor[IO]): List[RatedGame] =
    getByUserAndLeagueQuery(userId, leagueId).transact(xb).unsafeRunSync
  override def add(newGame: Game)(implicit xb: Transactor[IO]): Option[WithId[Game]] = for {
    id <- addQuery(newGame).transact(xb).unsafeRunSync
    game <- getQuery(id).transact(xb).unsafeRunSync
  } yield game
  override def update(game: WithId[Game])(implicit xb: Transactor[IO]): Int = updateQuery(game).transact(xb).unsafeRunSync
  override def delete(id: Int)(implicit xb: Transactor[IO]): Int = deleteQuery(id).transact(xb).unsafeRunSync
}
