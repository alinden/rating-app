package com.raybeam.rating.models

import com.raybeam.rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class RatedUser(
  user: WithId[User],
  rating: Int
)
