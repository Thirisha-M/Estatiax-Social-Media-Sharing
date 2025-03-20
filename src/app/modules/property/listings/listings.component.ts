import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, ModalComponent],
})
export class ListingsComponent implements OnInit {
  properties: any[] = [];
  loggedInUser: any = null; // Store logged-in user details
  selectedProperty: any = null;
  isModalOpen: boolean = false;
  userId = localStorage.getItem('user_id'); // Get logged-in user email

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit() {
    this.getLoggedInUser();
    this.loadAllProperties();
  }

  // Retrieve logged-in user details from local storage
  getLoggedInUser() {
    const userData = localStorage.getItem('userDetails');
    if (userData) {
      this.loggedInUser = JSON.parse(userData);
    }
  }

  loadAllProperties() {
    this.propertyService.getAllProperties().subscribe((data: any) => {
      console.log(data);
      if (data.rows.length > 0) {
        this.properties = data.rows.map((property: any) => property.value);
      }
      console.log('All Properties:', this.properties);
    });
  }

  openModal(property: any) {
    this.selectedProperty = property;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProperty = null;
  }
  goBack() {
    this.router.navigate(['']); // Replace '/home' with your actual listings page route
  }
  saveProperty(propertyId: string) {
    if (this.userId) {
      this.propertyService.saveProperty(propertyId,this.userId).subscribe(() => {
        alert('Property saved successfully!');
      }, error => {
        alert('Error saving property!');
      });
    } else {
      alert('User email is not available!');
    }
  }

}
