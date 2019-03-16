package rating.models

import java.sql.Timestamp
import io.circe.generic.JsonCodec, io.circe.syntax._

import TimestampEncoding._

@JsonCodec case class RatingHistory(
  name: String,
  series: List[RatingHistoryRecord]
)

@JsonCodec case class RatingHistoryRecord(
  value: Int,
  name: Timestamp
)
