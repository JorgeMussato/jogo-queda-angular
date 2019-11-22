import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { repeat, delay, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  playerPosition = 5;

  enemyPositionLeft = 1;
  enemyPositionTop = 0;

  points = 0;

  difficulty = 500;

  enemySubj = new BehaviorSubject(this.createRandomPosition());

  ngOnInit() {
    this.enemySubj.subscribe(pos => {
      this.handleNewEnemy(pos);
    });
  }

  handleNewEnemy(position: number) {
    position = position !== 11 ? position : 10;
    this.enemyPositionLeft = position;
    const vertPosition = of(this.enemyPositionTop)
      .pipe(
        switchMap(() => of(this.enemyPositionTop++)),
        delay(this.difficulty),
        repeat(9),
        finalize(() => this.handleFinalize())
      )
      .subscribe();
  }

  handleFinalize(): void {
    if (this.playerPosition === this.enemyPositionLeft) {
      this.points++;
      this.getNewDifficulty();
      this.enemyPositionTop = 0;
      this.enemySubj.next(this.createRandomPosition());
    }
  }

  createRandomPosition() {
    const pos = Math.floor(Math.random() * 10);
    return pos === 11 ? 10 : pos;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyboardEvent(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowRight':
        this.playerPosition !== 9 ? this.playerPosition++ : null;
        break;
      case 'ArrowLeft':
        this.playerPosition !== 0 ? this.playerPosition-- : null;
        break;
    }
  }

  getNewDifficulty() {
    switch (this.points) {
      case 2:
        this.difficulty = 400;
        break;
      case 4:
        this.difficulty = 300;
        break;
      case 6:
        this.difficulty = 250;
        break;
      case 10:
        this.difficulty = 200;
        break;
      case 15:
        this.difficulty = 100;
        break;
      case 20:
        this.difficulty = 50;
        break;
    }
  }
}
