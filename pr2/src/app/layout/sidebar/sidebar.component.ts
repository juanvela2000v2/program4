import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector:'app-sidebar',
  templateUrl:'sidebar.component.html',
  imports: [RouterLink]
})
export class SidebarComponent{
  menuNav = [
    {
      text:'jardin',
      url:'/jardin',
      icon:'garden'
    },
    {
      text:'user',
      url:'/user',
      icon:'user'
    }
  ]
}
