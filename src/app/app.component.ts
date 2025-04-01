import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { UserComponent } from "./usuario/usuario.component";
import { AuthService } from './services/auth.service';
import { UserTagComponent } from "./tag/user-tag.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { WelcomeComponent } from './welcome/welcome.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, LoginComponent, RegisterComponent,UserTagComponent,UserComponent, WelcomeComponent, NgxPaginationModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'EA_FrontEnd_G3';
  loggedin: boolean = false;
  constructor(private authService: AuthService){
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.loggedin = loggedIn;
    });
  }
  logout(){
    this.authService.logout();
  }
}
