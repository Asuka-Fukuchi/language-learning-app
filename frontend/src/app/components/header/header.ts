import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material/material-module';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { User, UserService } from '../../services/user';

@Component({
  selector: 'app-header',
  imports: [ MaterialModule, RouterModule ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  isLoggedIn: boolean = false;

  currentUser$!: Observable<User | null>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
