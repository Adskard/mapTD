import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, Output } from '@angular/core';
import { GameLogicService } from '../service/game-logic.service';
import { FormBuilder } from '@angular/forms';
import { PersistenceService } from '../service/persistence.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit{

  @ViewChild('canvas') canvas !: ElementRef<HTMLCanvasElement>;


  //getters for game values
  get health() : number{
    return this.gameLogic.game.curr_health
  }  
  get wave() : number{
    return this.gameLogic.game.waveNumber
  } 
  get money() : number{
    return this.gameLogic.game.money
  } 
  get score() : number{
    return this.gameLogic.game.score
  } 
  get gameEnd() : boolean{
    return this.gameLogic.game.gameEnd
  } 

  //for selecting towers to place
  clickTower = (e: string) : void =>{
    this.gameLogic.game.selectTower(e)
  }

  //After game score form
  scoreForm = this.formBuilder.group({
    player_name: ""
  })

  //game control
  get paused() : boolean{
    return this.gameLogic.game.gameStopped
  }

  playAgain() {
    console.log("btn pres")
    this.gameLogic.restart()
  }

  stop(){
    this.gameLogic.stop()
  }

  resume(){
    this.gameLogic.resume()
  }

  get hideForm(){
    return this.scoreForm.disabled
  }

  //submit score to localDB
  onSubmit() : void  {
    let n = this.scoreForm.value.player_name;
    let s = this.gameLogic.game.score

    if(n && s){
      this.persistence.addLeader({
        name: n,
        score: s,
      })
    }
    this.scoreForm.disable();
  }

  public ngAfterViewInit() : void {
    //this.canvas.nativeElement.width = window.innerWidth
    //this.canvas.nativeElement.height = window.innerHeight 
    this.gameLogic.startDrawing(this.canvas.nativeElement);
  }
  
  //inject dependencies
  constructor(private gameLogic : GameLogicService, private persistence : PersistenceService,
    private formBuilder : FormBuilder){
  }
}
