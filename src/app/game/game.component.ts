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
  //player Health
  get health() : number{
    return this.gameLogic.game.curr_health
  }  

  //gets wave #
  get wave() : number{
    return this.gameLogic.game.waveNumber
  } 

  //gets player money$
  get money() : number{
    return this.gameLogic.game.money
  }
  
  //gets player score
  get score() : number{
    return this.gameLogic.game.score
  } 

  //if game ended or not
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

  //Restarts the game after game end
  playAgain() {
    console.log("btn pres")
    this.gameLogic.restart()
  }

  //Pauses the game
  stop(){
    this.gameLogic.stop()
  }

  //resumes the paused game
  resume(){
    this.gameLogic.resume()
  }

  //if form should be hidden or not
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

  //Do after component init
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
