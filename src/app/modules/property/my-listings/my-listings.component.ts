import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent,RouterModule],
})
export class MyListingsComponent implements OnInit {
  properties: any[] = [];
  userEmail: string = '';
  userId: string = '';
  selectedProperty: any = null;
  isModalOpen: boolean = false;

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.userId = localStorage.getItem('userId') || '';
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getUserProperties(this.userId).subscribe((data: any) => {
      this.properties = data.filter((property: any) => property.data.userid === this.userId);
    });
  }

  openModal(property: any) {
    this.selectedProperty = property;
    this.router.navigate(['/modal', property._id]);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProperty = null;
  }

  goBack() {
    this.router.navigate(['']); // Replace '/home' with your actual listings page route
  }

}
