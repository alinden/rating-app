package rating.models

import java.sql.Timestamp
import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

import TimestampEncoding._

@JsonCodec case class RatedGame(
  winner: WithId[User],
  winner_rating: WithId[Rating],
  loser: WithId[User],
  loser_rating: WithId[Rating],
  date_played: Timestamp
)
