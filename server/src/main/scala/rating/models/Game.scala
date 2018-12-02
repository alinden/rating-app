package rating.models

import java.sql.Timestamp
import io.circe.generic.JsonCodec, io.circe.syntax._
import cats.syntax.either._

import rating.repositories.WithId

import TimestampEncoding._

@JsonCodec case class Game(
  league_id: Int,
  winner_id:Int,
  loser_id: Int,
  date_played: Option[Timestamp]
)
