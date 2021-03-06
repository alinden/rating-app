import { Component, OnInit, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { LeagueWithRatings } from '../league-with-ratings';

@Component({
  selector: 'app-ratings-distribution',
  templateUrl: './ratings-distribution.component.html',
  styleUrls: ['./ratings-distribution.component.css']
})
export class RatingsDistributionComponent implements OnInit {
  @Input() leagueWithRatings: LeagueWithRatings;
  histogramData: Object[]; // TODO: make this more precise.

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Rating';
  showYAxisLabel = false;
  yAxisLabel = 'Count';
  yAxisTicks = [];

  colorScheme = {
    domain: [
      '#ff3d00', '#bf360c', '#ff8f00', '#ff6f00', '#ff5722', '#e65100', '#ffca28', '#ffab00'
    ]
  };

  constructor() { }

  ngOnInit() {
    this.setHistogramData();
  }

  onSelect(event) {
    console.log(event);
  }

  setHistogramData() {
    const buckets: Map<number, number> = new Map();
    const bucketSize = 50;
    let minBucket, maxBucket;
    for (const ratedUser of this.leagueWithRatings.ratedUsers) {
      const rating = ratedUser.rating.entity.new_rating;
      const roundAmount = rating % bucketSize;
      const bucketedRating = rating - roundAmount;
      if (!minBucket || (minBucket > bucketedRating)) {
        minBucket = bucketedRating;
      }
      if (!maxBucket || (maxBucket < bucketedRating)) {
        maxBucket = bucketedRating;
      }
      let newBucketCount = 1;
      if (buckets.has(bucketedRating)) {
        newBucketCount = buckets.get(bucketedRating) + 1;
      }
      buckets.set(bucketedRating, newBucketCount);
    }
    const histogramData = [];
    for (let lowerBound = minBucket; lowerBound <= maxBucket; lowerBound = lowerBound + bucketSize) {
      const upperBound = lowerBound + bucketSize;
      const barName = '' + lowerBound + ' - ' + upperBound;
      let barCount = 0;
      if (buckets.has(lowerBound)) {
        barCount = buckets.get(lowerBound);
      }
      histogramData.push({
        name: barName,
        value: barCount
      });
    }
    this.histogramData = histogramData;
    this.setYAxisTicks();
  }

  setYAxisTicks() {
    let maxRating = 0;
    for (const ratedUser of this.leagueWithRatings.ratedUsers) {
      const rating = ratedUser.rating.entity.new_rating;
      if (rating > maxRating) {
        maxRating = rating;
      }
    }
    const ticks = [];
    for (let i = 0; i <= maxRating; i++) {
      ticks.push(i);
    }
    this.yAxisTicks = ticks;
  }

}
