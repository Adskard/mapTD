import { ElementRef, Injectable } from '@angular/core';
import { Game } from './game/Entities';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  public time = performance.now();
  public canvas !: HTMLCanvasElement;
  public ctx  !: CanvasRenderingContext2D;
  public game = new Game();
  public requestId :number = 0;

  private updateTime(){
    this.time = performance.now();
  }

  private getTimeSinceLast(newTime : number) : number{
    let d  = newTime - this.time;
    this.updateTime();
    return d;
  }

  draw = (timestamp : number) : void => {
    const td = this.getTimeSinceLast(timestamp)
    this.game.playGame(td);
    if (!this.game.gameStopped){
      this.requestId = requestAnimationFrame(this.draw);
    }
    else{
      cancelAnimationFrame(this.requestId)
    }
  };

  restart(){
    console.log("restard")
    this.game.gameStopped = true;
    this.game = new Game()
    this.game.setCanvas(this.ctx, this.canvas)
    this.startDrawing(this.canvas)
  }

  stop(){
    console.log("stop")
    this.game.gameStopped = true;
    cancelAnimationFrame(this.requestId)
  }

  resume(){
    console.log("resume")
    this.game.gameStopped = false;
    this.requestId = requestAnimationFrame(this.draw)
  }

  startDrawing(canvas : HTMLCanvasElement) : void {
    this.canvas = canvas;
    this.ctx = this.getCanvasContext(canvas)
    this.game.setCanvas(this.ctx, canvas);
    this.updateTime();
    this.requestId = requestAnimationFrame(this.draw)
  }

  getCanvasContext = (canvas : HTMLCanvasElement) : CanvasRenderingContext2D =>{
    let context = canvas.getContext("2d");
    if(context === null){
      throw new Error("2d canvas is not supported by the browser")
    }
    return context;
  }
  
  constructor() {
    
  }
}
