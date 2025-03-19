import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-saved-listings',
  templateUrl: './saved-listings.component.html',
  styleUrls: ['./saved-listings.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SavedListingsComponent implements OnInit {
toggleSave(arg0: any) {
throw new Error('Method not implemented.');
}
  savedProperties: any[] = [];
  userId: string = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    // ✅ Get the logged-in user ID
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.userId = user.data._id;  // Ensure the correct user ID is used
        this.getSavedProperties();
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }

  getSavedProperties() {
    this.propertyService.getSavedProperties(this.userId).subscribe(
      (properties) => {
        this.savedProperties = properties;
      },
      (error) => {
        console.error("Error fetching saved properties:", error);
      }
    );
  }
}
