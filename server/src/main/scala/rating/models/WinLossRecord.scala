package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class WinLossRecord(
  user: WithId[User],
  wins: Int,
  losses: Int
)
