import { Component } from '@angular/core';
import { PersistenceService, LeaderboardItem } from '../service/persistence.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {

  scoreForm = this.formBuilder.group({
    player_name: "",
    player_score: ""
  })

  onSubmit() : void  {
    let n = this.scoreForm.value.player_name;
    let s = Number(this.scoreForm.value.player_score);
    console.log(n)
    console.log(s)

    if(n && s){
      this.persistence.addLeader({
        name: n,
        score: s,
      })
      this.getLeaders();
    }
    this.scoreForm.reset();
  }

  getLeaders = async () =>{
    const l = await this.persistence.getTopLeaders()
    if(l)
      this.leaderboardItems = l.reverse().slice(0, this.leaderCount);
  }
  
  leaderboardItems : Array<LeaderboardItem> = []

  leaderCount = 10

  public ngAfterViewInit() : void {
    this.getLeaders();
  }

  private updateLeaderBoard(newItems : Array<LeaderboardItem>){
    this.leaderboardItems = newItems;
  }
  //inject dependencies
  constructor(private persistence : PersistenceService,
    private formBuilder : FormBuilder){
  };

}
