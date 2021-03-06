package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class LeagueWithGames(
  league: WithId[League],
  ratedGames: List[RatedGame]
)
