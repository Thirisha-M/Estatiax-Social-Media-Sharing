import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-saved-listings',
  templateUrl: './saved-listings.component.html',
  styleUrls: ['./saved-listings.component.css']
})
export class SavedListingsComponent implements OnInit {
  savedProperties: any[] = [];
  userEmail: string | null = localStorage.getItem('userEmail'); // Get logged-in user email

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.loadSavedProperties();
  }

  loadSavedProperties() {
    if (this.userEmail) {
      this.propertyService.getSavedProperties(this.userEmail).subscribe((response: any) => {
      }, error => {
        console.error('Error fetching saved properties:', error);
      });
    } else {
      console.error('User email is null');
    }
  }
}

