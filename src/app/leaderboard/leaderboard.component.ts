import { Component } from '@angular/core';
import { PersistenceService, leaderboardItem } from '../persistence.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  
  leaderboardItems : Array<leaderboardItem> = []

  leaderCount = 10

  public ngAfterViewInit() : void {
    this.persistence.getTopLeaders()
    .then((p)=>{
      console.log(p)
      if(p)
      this.leaderboardItems = p.reverse().slice(0, this.leaderCount);
    });
  }

  private updateLeaderBoard(newItems : Array<leaderboardItem>){
    this.leaderboardItems = newItems;
  }
  //inject dependencies
  constructor(private persistence : PersistenceService){
  };

}
