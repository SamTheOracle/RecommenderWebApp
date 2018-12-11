import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { User } from './components/register/model/user';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../animations';
import { SidebarComponent } from './components/sidebar/sidebar.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [slideInAnimation]
})
export class AppComponent implements OnInit {


  private sidebarComponent: SidebarComponent;

  showWelcome: boolean;
  userIsLoggedIn: boolean;
  constructor(private router: Router) { }

  onActivatedComponent(event) {
    this.sidebarComponent = event;
  }

  onSideNaveToggle(event: boolean) {
    this.sidebarComponent.toggleSideBar()

  }

  ngOnInit(): void {
    this.userIsLoggedIn = sessionStorage["user"] != undefined;

    if (!this.userIsLoggedIn) {
      this.showWelcome = true;
      this.router.navigate(["/registration/login"])
    }
    var observer = this.router.events.subscribe((event: NavigationStart) => {
      this.userIsLoggedIn = sessionStorage["user"] != undefined;
      if (event.url == "/" && this.userIsLoggedIn) {
        this.showWelcome = false;
        this.router.navigate(["/home/diary"]);
      }
      if (event.url == "/" && !this.userIsLoggedIn) {
        this.router.navigate(["/registration/login"])
      }
      if ((event.url == "/registration/login" || event.url == "/registration/signup")) {

        this.showWelcome = true

      }
    })
  }


}
