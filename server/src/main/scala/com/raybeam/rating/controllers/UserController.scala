package com.raybeam.rating.controllers

import cats.effect.{ExitCode, IO, IOApp}

import cats.effect.Sync
import cats.Applicative
import cats.implicits._
import io.circe.{Encoder, Decoder, Json}
import org.http4s.{EntityEncoder, EntityDecoder}
import org.http4s.circe._

import com.raybeam.rating.models.User
import com.raybeam.rating.repositories.{WithId, UserRepository}

import doobie._
import doobie.implicits._
import doobie.hikari._

trait UserController[F[_]]{
  def all: F[List[WithId[User]]]
  def get(id: Int): F[WithId[User]]
  def add(newUser: User): F[WithId[User]]
  def update(user: WithId[User]): F[Unit]
  def delete(id: Int): F[Unit]
}

object UserController {
  implicit def apply[F[_]](implicit ev: UserController[F]): UserController[F] = ev

  object Encoders {
    implicit def userListEntityEncoder[F[_]: Applicative]: EntityEncoder[F, List[WithId[User]]] =
      jsonEncoderOf[F, List[WithId[User]]]
    implicit def userEntityEncoder[F[_]: Applicative]: EntityEncoder[F, WithId[User]] =
      jsonEncoderOf[F, WithId[User]]
    implicit def newUserEntityDecoder[F[_]: Sync]: EntityDecoder[F, User] =
      jsonOf[F, User]
    implicit def userEntityDecoder[F[_]: Sync]: EntityDecoder[F, WithId[User]] =
      jsonOf[F, WithId[User]]
  }

  def impl[F[_]: Applicative](implicit xb: Transactor[IO]): UserController[F] = new UserController[F]{
    def all: F[List[WithId[User]]] = UserRepository.getAll.pure[F]
    def get(id: Int): F[WithId[User]] = UserRepository.get(id.toInt).get.pure[F]
    def add(newUser: User): F[WithId[User]] = UserRepository.add(newUser).get.pure[F]
    def update(user: WithId[User]): F[Unit] = {
      UserRepository.update(user)
      ().pure[F]
    }
    def delete(id: Int): F[Unit] = {
      UserRepository.delete(id)
      ().pure[F]
    }
  }
}
