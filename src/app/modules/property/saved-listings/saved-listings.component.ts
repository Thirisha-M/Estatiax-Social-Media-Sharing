import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-saved-listings',
  templateUrl: './saved-listings.component.html',
  styleUrls: ['./saved-listings.component.css']
})
export class SavedListingsComponent implements OnInit {
  savedProperties: any[] = [];
  userEmail: string = ""; // Get logged-in user email
  userId: string = localStorage.getItem('userEmail') ?? '';
  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
    this.loadSavedProperties();
    const email = localStorage.getItem("userEmail");
    console.log(email);
    const userId = localStorage.getItem("userId"); // Get logged-in user email
    // this.userId = userId
    console.log(this.userId);



    // this.userEmail=email
    //] console.log(this.userid);


  }

  loadSavedProperties() {
    if (this.userId) {
      this.propertyService.getSavedProperties(this.userId).subscribe({
        next: (response: any) => {
          console.log(response);

        },
        error: (error) => {
          console.error('Error fetching saved properties:', error);
        }
      });
    } else {
      console.error('User email is null');
    }
  }
}

