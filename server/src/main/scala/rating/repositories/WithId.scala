package rating.repositories

import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class WithId[T](id: Int, entity: T)
