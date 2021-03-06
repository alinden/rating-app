package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class LeagueWithRatings(
  league: WithId[League],
  ratedUsers: List[RatedUser]
)
