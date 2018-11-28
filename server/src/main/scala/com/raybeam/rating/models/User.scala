package com.raybeam.rating.models
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class User(name: String, image: String)
