import { Component } from '@angular/core';
import { DashboardService, DashboardPayload } from '../../services/home.service';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material/material-module';

@Component({
  selector: 'app-home',
  imports: [ MaterialModule ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
loading = true;
  error = '';
  data: DashboardPayload | null = null;

  constructor(
    private dash: DashboardService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.dash.getDashboard().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load error', err);
        this.error = err?.error?.error || err?.message || 'Failed to load dashboard';
        this.loading = false;
      }
    });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
