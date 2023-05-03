import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { GameLogicService } from '../game-logic.service';
import { GetmapService } from '../getmap.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit{

  @ViewChild('canvas') canvas !: ElementRef<HTMLCanvasElement>;

  public ngAfterViewInit() : void {
    this.canvas.nativeElement.width = window.innerWidth
    this.canvas.nativeElement.height = window.innerHeight 
    this.gameLogic.startDrawing(this.canvas.nativeElement);
  }
  
  //inject dependencies
  constructor(private gameLogic : GameLogicService){
  };

}
