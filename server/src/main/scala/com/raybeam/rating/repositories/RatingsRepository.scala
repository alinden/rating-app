package com.raybeam.rating.repositories

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

import com.raybeam.rating.models.{Rating, RatedUser, League}

object RatingRepository extends Repository[Rating] {
  override val getAllQuery =
    sql"select id, league_id, user_id, last_game_id, rating from ratings"
      .query[WithId[Rating]]
      .to[List]

  override def getQuery(id: Int) =
    sql"""
      select
        id,
        league_id,
        user_id,
        last_game_id,
        rating
      from ratings where id = ${id}
    """.query[WithId[Rating]]
      .option

  def getByUserIdAndLeagueIdQuery(userId: Int, leagueId: Int) =
    sql"""
      select
        ratings.id,
        ratings.league_id,
        ratings.user_id,
        ratings.last_game_id,
        ratings.rating
      from ratings
      inner join (
        select
          max(id) id,
          user_id user_id,
          league_id league_id
        from ratings
        group by user_id, league_id
      ) recent_ratings
      on ratings.id = recent_ratings.id
      where ratings.user_id = ${userId}
      and ratings.league_id = ${leagueId}
    """.query[WithId[Rating]]
      .option


  def getByLeagueQuery(league: WithId[League]) =
    sql"""
      select
        a.user_id,
        a.user_name,
        a.user_image,
        ratings.rating user_rating
      from (
        select
          users.id as user_id,
          max(users.name) as user_name,
          max(users.image) as user_image,
          max(ratings.id) as user_rating_id
        from
          (select * from ratings where league_id = ${league.id}) ratings
          inner join users users
            on ratings.user_id = users.id
        group by users.id
      ) a
      inner join ratings
        on a.user_rating_id = ratings.id
      order by ratings.rating desc;
    """
      .query[RatedUser]
      .to[List]

  override def addQuery(newRating: Rating) =
    sql"""
      insert into ratings (league_id, user_id, last_game_id, rating)
      values (
        ${newRating.league_id},
        ${newRating.user_id},
        ${newRating.last_game_id},
        ${newRating.rating}
      ) returning id
    """.query[Int]
      .option

  override def updateQuery(rating: WithId[Rating]) =
    sql"""
      update ratings set
        league_id = ${rating.entity.league_id},
        user_id = ${rating.entity.user_id},
        last_game_id = ${rating.entity.last_game_id},
        rating = ${rating.entity.rating}
      where id = ${rating.id}
    """.update
      .run

  override def deleteQuery(id: Int) =
    sql"delete from ratings where id = $id"
      .update
      .run

  override def getAll(implicit xb: Transactor[IO]): List[WithId[Rating]] = getAllQuery.transact(xb).unsafeRunSync
  override def get(id: Int)(implicit xb: Transactor[IO]): Option[WithId[Rating]] = getQuery(id).transact(xb).unsafeRunSync
  def getByUserIdAndLeagueId(userId: Int, leagueId: Int)(implicit xb: Transactor[IO]): Option[WithId[Rating]] =
    getByUserIdAndLeagueIdQuery(userId, leagueId).transact(xb).unsafeRunSync
  def getByLeague(league: WithId[League])(implicit xb: Transactor[IO]): List[RatedUser] = getByLeagueQuery(league).transact(xb).unsafeRunSync
  override def add(newRating: Rating)(implicit xb: Transactor[IO]): Option[WithId[Rating]] = for {
    id <- addQuery(newRating).transact(xb).unsafeRunSync
    rating <- getQuery(id).transact(xb).unsafeRunSync
  } yield rating
  override def update(rating: WithId[Rating])(implicit xb: Transactor[IO]): Int = updateQuery(rating).transact(xb).unsafeRunSync
  override def delete(id: Int)(implicit xb: Transactor[IO]): Int = deleteQuery(id).transact(xb).unsafeRunSync
}
