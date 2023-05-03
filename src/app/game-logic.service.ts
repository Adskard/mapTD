import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  private time = performance.now();
  public canvas !: HTMLCanvasElement;
  public ctx  !: CanvasRenderingContext2D;

  private updateTime(){
    this.time = performance.now();
  }

  private getTimeSinceLast(newTime : number) : number{
    let d  = newTime - this.time;
    this.updateTime();
    return d;
  }

  draw = (timestamp : number) => {
    const td = this.getTimeSinceLast(timestamp)
    this.ctx.fillStyle = "rgb(200, 0, 0)";
    this.ctx.fillRect(200,200, 50,50);
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(200, 100);
    this.ctx.stroke();

    requestAnimationFrame(this.draw);
  };

  startDrawing(canvas : HTMLCanvasElement) : void {
    this.canvas = canvas;
    this.ctx = this.getCanvasContext(canvas)
    this.updateTime();
    requestAnimationFrame(this.draw)
  }

  getCanvasContext = (canvas : HTMLCanvasElement) : CanvasRenderingContext2D =>{
    let context = canvas.getContext("2d");
    if(context === null){
      throw new Error("2d canvas is not supported by the browser")
    }

    return context
  }

  
  constructor() { }
}
