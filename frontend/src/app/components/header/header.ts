import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material/material-module';

@Component({
  selector: 'app-header',
  imports: [ MaterialModule ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isLoggedIn: boolean = false;

  ngOnInit(): void { 
    setInterval(() => {
      // this.isLoggedIn = this.authService.isLogged;
    }, 1000);   
  }

  onLogout() {
    // this.authService.SignOut();
    // window.location.href = "/home";
  }
}
