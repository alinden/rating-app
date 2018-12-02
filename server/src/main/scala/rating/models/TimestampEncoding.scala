package rating.models

import java.sql.Timestamp
import cats.syntax.either._
import io.circe.{ Decoder, Encoder }

object TimestampEncoding {

  implicit val encodeTimestamp: Encoder[Timestamp] = Encoder.encodeString.contramap[Timestamp](_.toString)

  implicit val decodeTimestamp: Decoder[Timestamp] = Decoder.decodeString.emap { str =>
    Either.catchNonFatal(Timestamp.valueOf(str)).leftMap(t => "Timestamp")
  }
}
