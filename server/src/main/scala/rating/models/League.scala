package rating.models
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class League(name: String, image: String)
