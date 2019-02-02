import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { League } from '../league';
import { RatedUser } from '../rated-user';
import { WithId } from '../with-id';
import { LiveGame } from '../live-game';
import { GameType } from '../game-type';
import { CricketState, C } from '../cricket-state';
import { DartShot } from '../dart-shot';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keep-score',
  templateUrl: './keep-score.component.html',
  styleUrls: ['./keep-score.component.css']
})
export class KeepScoreComponent implements OnInit {
  @ViewChild('grid') grid: MatGridList;
  @Input() playerOneId: number;
  @Input() playerTwoId: number;

  leagueId: number;
  liveGame: LiveGame<any>;
  gameType: GameType;
  league: WithId<League>;
  rules: string;
  mode: string;
  shotHistory: DartShot[] = [];

  gridRowHeightByBreakpoint = {
    xl: 'fit',
    lg: 'fit',
    md: '704px',
    sm: '704px',
    xs: '540px'
  };

  private sub: any;

  enterGameMode() {
    this.mode = 'game';
  }

  enterLagMode() {
    this.mode = 'lag';
  }

  recordLag() {
    const playerOne = this.client.getRatedUserById(this.playerOneId, this.leagueId);
    const playerTwo = this.client.getRatedUserById(this.playerTwoId, this.leagueId);
    this.startGame([playerOne, playerTwo]);
    this.enterGameMode();
  }

  nextTurn() {
    const shotsSkipped = 3 - this.liveGame.state.shotsRemaining;
    this.liveGame.state.shotsRemaining = 3;
    const beforeTurnIndex = this.liveGame.state.turnIndex;
    const afterTurnIndex = (this.liveGame.state.turnIndex + 1) % 2;
    if (afterTurnIndex < beforeTurnIndex) {
      this.liveGame.state.turnCount++;
    }
    this.liveGame.state.turnIndex = afterTurnIndex;
    this.shotHistory.push({ value: -1, count: shotsSkipped , appliedCount: shotsSkipped});
  }

  undo() {
    if (!this.shotHistory.length) {
      // Can't undo at the beginning of the game.
      return;
    } else {
      const prevShot = this.shotHistory.pop();
      this.liveGame.state.rewind(prevShot, this.liveGame.players.length);
    }
  }

  saveGame() {
    if (this.liveGame.state.isOver) {
      this.liveGame.winner = this.liveGame.players[this.liveGame.state.turnIndex].user;
      this.liveGame.loser = this.liveGame.players[((this.liveGame.state.turnIndex + 1) % 2)].user;
      this.client.addGame(
        this.league.id,
        this.liveGame.winner.id,
        this.liveGame.loser.id
      );
      this.router.navigate(['/games']);
    }
  }

  recordShot(shot: DartShot) {
    if (!this.liveGame.state.isOver) {
      this.liveGame.state.run(shot, this.liveGame.players.length);
      this.shotHistory.push(shot);
      if (this.liveGame.state.isOver) {
        // Game ended on this turn.
        this.liveGame.winner = this.liveGame.players[this.liveGame.state.turnIndex].user;
        this.liveGame.loser = this.liveGame.players[((this.liveGame.state.turnIndex + 1) % 2)].user;
      }
    }
  }

  startGame(players: RatedUser[]) {
    const numPlayers = players.length;
    const state = new CricketState(numPlayers);
    this.liveGame = {
      players: players,
      state: state,
      winner: null,
      loser: null
    };
  }

  constructor(
    private route: ActivatedRoute,
    private client: ClientService,
    private mediaObserver: MediaObserver,
    private router: Router
  ) {}

  ngOnInit() {
    this.mediaObserver.media$.subscribe((change: MediaChange) => {
      this.grid.rowHeight = this.gridRowHeightByBreakpoint[change.mqAlias];
    });

    this.sub = this.route.params.subscribe(params => {
      this.leagueId = +params['leagueId'];
    });
    if (!this.client.initialized) {
      this.client.loadAllData();
      this.league = this.client.getLeagueById(this.leagueId);
    } else {
      this.league = this.client.getLeagueById(this.leagueId);
    }
    this.enterLagMode();
  }
}
