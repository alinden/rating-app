package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class MonthTotal(
  user: WithId[User],
  jan: Int,
  feb: Int,
  mar: Int,
  apr: Int,
  may: Int,
  jun: Int,
  jul: Int,
  aug: Int,
  sep: Int,
  oct: Int,
  nov: Int,
  dec: Int,
)
