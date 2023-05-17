import { Component } from '@angular/core';
import { PersistenceService, LeaderboardItem } from '../service/persistence.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {

  //get leaders from local persistence
  getLeaders = async () =>{
    const l = await this.persistence.getTopLeaders()
    if(l)
      //descending order
      this.leaderboardItems = l.reverse().slice(0, this.leaderCount);
  }
  
  //initialize leaderboard array
  leaderboardItems : Array<LeaderboardItem> = []

  //how many players we want to see
  leaderCount = 10

  public ngAfterViewInit() : void {
    this.getLeaders();
  }

  //Updates leaderboard with new Array
  //Overwrites orriginal array
  private updateLeaderBoard(newItems : Array<LeaderboardItem>){
    this.leaderboardItems = newItems;
  }
  //inject dependencies
  constructor(private persistence : PersistenceService,
    private formBuilder : FormBuilder){
  };

}
