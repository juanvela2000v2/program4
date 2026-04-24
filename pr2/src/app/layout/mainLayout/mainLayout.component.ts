import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from "../header/header.component";

@Component({
  selector:'app-main-layout',
  standalone:true,
  templateUrl:'mainLayout.component.html',
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
})
export class MainLayoutComponent{

}
