import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { League } from '../league';
import { WithId } from '../with-id';
import { LiveGame } from '../live-game';
import { GameType } from '../game-type';
import { CricketState, C } from '../cricket-state';

@Component({
  selector: 'app-keep-score',
  templateUrl: './keep-score.component.html',
  styleUrls: ['./keep-score.component.css']
})
export class KeepScoreComponent implements OnInit {
  leagueId: number;
  liveGame: LiveGame<any>;
  gameType: GameType;
  league: WithId<League>;
  rules: string;
  private sub: any;

  saveGame() {
    console.log('sav');
  }

  cancelGame() {
    console.log('cance');
  }

  startGame(gameType: GameType, numPlayers: number) {
    let state = {};
    switch (gameType) {
      case GameType.Cricket: {
        state = {
          scores: Array.from({ length : numPlayers },  k => 0),
          fifteens: Array.from({ length : numPlayers },  k => C.Zero),
          fifteenScores: Array.from({ length : numPlayers },  k => 0),
          sixteens: Array.from({ length : numPlayers },  k => C.Zero),
          sixteenScores: Array.from({ length : numPlayers },  k => 0),
          seventeens: Array.from({ length : numPlayers },  k => C.Zero),
          seventeenScores: Array.from({ length : numPlayers },  k => 0),
          eightteens: Array.from({ length : numPlayers },  k => C.Zero),
          eightteenScores: Array.from({ length : numPlayers },  k => 0),
          nineteens: Array.from({ length : numPlayers },  k => C.Zero),
          nineteenScores: Array.from({ length : numPlayers },  k => 0),
          twenties: Array.from({ length : numPlayers },  k => C.Zero),
          twentyScores: Array.from({ length : numPlayers },  k => 0),
          bullseyes: Array.from({ length : numPlayers },  k => C.Zero),
          bullseyeScores: Array.from({ length : numPlayers },  k => 0),
        } as CricketState;
        break;
      }
      case GameType.ThreeZeroOne: {
        break;
      }
    }
    this.liveGame = {
      summary: '0 - 0',
      players: [{
        user: {
          id: 3,
          entity: {
            name: 'Alex',
            image: 'alinden_github_image.png'
          }
        },
        rating: 1874
      }, {
        user: {
          id: 3,
          entity: {
            name: 'Robert',
            image: 'alinden_github_image.png'
          }
        },
        rating: 2041
      }],
      state: state
    };
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.leagueId = +params['leagueId']; // (+) converts string 'id' to a number
      if (this.leagueId === 1) {
        this.rules = 'cricket';
        this.gameType = GameType.Cricket;
        this.league = {
          id: 1,
          entity: {
            name: 'Cricket',
            image: 'dart_board.png'
          }
        };
        this.startGame(GameType.Cricket, 2);
      } else if (this.leagueId === 2) {
        this.rules = '301';
        this.gameType = GameType.ThreeZeroOne;
        this.league = {
          id: 2,
          entity: {
            name: '301',
            image: '301_darts.png'
          }
        };
      } else {
        this.rules = '';
        this.gameType = GameType.None;
        this.league = {
          id: 3,
          entity: {
            name: '8ball',
            image: '8ball.png'
          }
        };
      }
    });
  }
}
