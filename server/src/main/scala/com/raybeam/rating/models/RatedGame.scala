package com.raybeam.rating.models

import com.raybeam.rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class RatedGame(
  winner: WithId[User],
  winnerRating: Int,
  loser: WithId[User],
  loserRating: Int,
)
