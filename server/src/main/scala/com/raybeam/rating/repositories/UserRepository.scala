package com.raybeam.rating.repositories

import cats.effect.{ExitCode, IO, IOApp}

import doobie._
import doobie.implicits._
import cats._
import cats.effect._
import cats.implicits._

import scala.concurrent.ExecutionContext

import com.raybeam.rating.models.User

object UserRepository extends Repository[User] {
  override val getAllQuery =
    sql"select id, name, image from users"
      .query[WithId[User]]
      .to[List]

  override def getQuery(id: Int) =
    sql"select id, name, image from users where id = ${id}"
      .query[WithId[User]]
      .option

  override def addQuery(newUser: User) =
    sql"insert into users (name, image) values (${newUser.name}, ${newUser.image}) returning id"
      .query[Int]
      .option

  override def updateQuery(user: WithId[User]) =
    sql"update users set name = ${user.entity.name}, image = ${user.entity.image} where id = ${user.id}"
      .update
      .run

  override def deleteQuery(id: Int) =
    sql"delete from users where id = $id"
      .update
      .run

  override def getAll(implicit xb: Transactor[IO]): List[WithId[User]] = getAllQuery.transact(xb).unsafeRunSync
  override def get(id: Int)(implicit xb: Transactor[IO]): Option[WithId[User]] = getQuery(id).transact(xb).unsafeRunSync
  override def add(newUser: User)(implicit xb: Transactor[IO]): Option[WithId[User]] = for {
    id <- addQuery(newUser).transact(xb).unsafeRunSync
    user <- getQuery(id).transact(xb).unsafeRunSync
  } yield user
  override def update(user: WithId[User])(implicit xb: Transactor[IO]): Int = updateQuery(user).transact(xb).unsafeRunSync
  override def delete(id: Int)(implicit xb: Transactor[IO]): Int = deleteQuery(id).transact(xb).unsafeRunSync
}
