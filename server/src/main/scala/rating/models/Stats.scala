package rating.models

import rating.repositories.WithId
import io.circe.generic.JsonCodec, io.circe.syntax._

@JsonCodec case class Stats(
  leagueIdAndWinLossRecords: List[(Int, List[WinLossRecord])],
  monthTotals: List[(Int, List[MonthTotal])]
)
