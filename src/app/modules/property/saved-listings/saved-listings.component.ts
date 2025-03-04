import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-saved-listings',
  templateUrl: './saved-listings.component.html',
  styleUrls: ['./saved-listings.component.css'],
  standalone: true,
  imports: [RouterModule],
})
export class SavedListingsComponent implements OnInit {
  savedProperties: any[] = [];
  userId: string = 'USER_ID_FROM_AUTH'; // Replace with actual user ID from auth service

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.getSavedProperties();
  }

  // ✅ Now correctly calls getSavedProperties from service
  getSavedProperties() {
    this.propertyService.getSavedProperties(this.userId).subscribe((data: any) => {
      this.savedProperties = data;
    });
  }

  // ✅ Toggle Save/Unsave property
  toggleSave(propertyId: string) {
    this.propertyService.saveProperty(propertyId, false).subscribe(() => {
      this.getSavedProperties(); // Refresh list after removing
    });
  }

  sendEnquiry() {
    alert('Enquiry sent successfully!');
  }
}
