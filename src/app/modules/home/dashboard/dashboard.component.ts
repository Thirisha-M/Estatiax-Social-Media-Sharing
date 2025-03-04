import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user = { name: 'John Doe', id: 1 }; // Replace with real user data
  totalProperties = 5; // Fetch from backend
  totalRequestsReceived = 3; // Fetch from backend
  totalRequestsSent = 2; // Fetch from backend
  totalSavedProperties = 4; // Fetch from backend

  // Simulate API fetch (replace this with actual backend call)
  fetchUserData() {
    // Call backend API here
    this.user.name = 'Lalitha'; // Example update
  }
}
