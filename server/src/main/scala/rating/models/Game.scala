package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class Game(
  league_id: Int,
  winner_id:Int,
  loser_id: Int,
  date_played: String
)

@JsonCodec case class GameWithRatings(
  game: WithId[Game],
  winner_rating: WithId[Rating],
  loser_rating: WithId[Rating]
)
