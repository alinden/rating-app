package rating.models

import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class Rating(
  league_id: Int,
  user_id: Int,
  last_game_id: Int,
  rating: Int
)
