package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class MonthTotal(
  user: WithId[User],
  month: String,
  net_wins: Int,
)
