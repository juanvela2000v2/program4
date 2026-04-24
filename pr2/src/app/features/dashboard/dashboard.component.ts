import { Component } from "@angular/core";

@Component({
  selector:'app-dashboard',
  templateUrl:'dashboard.component.html',
  standalone:true
})
export class DashboardComponent{
//....
  constructor(){
    //console.log("token del navegador",localStorage.getItem('token'));
  }
}
