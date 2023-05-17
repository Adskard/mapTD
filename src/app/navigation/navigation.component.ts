import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  navItems : Array<navItem> = [{name: "MapTD", url: "/game"}, {name: "Documentation", url: "/docs"},
  {name: "Leaderboard", url: "/leaderboard"}] ;
}

//Item used for navigating the page
interface navItem{
  name : String;
  url? : String;
}