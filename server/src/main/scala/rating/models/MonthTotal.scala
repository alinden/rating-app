package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class MonthTotal(
  user: WithId[User],
  totals: (Int, Int, Int, Int, Int, Int,
           Int, Int, Int, Int, Int, Int)
)
