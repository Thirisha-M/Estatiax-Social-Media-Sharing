import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Property {
  id: number;
  image_01: string;
  name: string;
  address: string;
  price: number;
  type: string;
  offer: string;
  bhk: number;
  status: string;
  furnished: string;
  carpet: number;
  date: string;
  user: { id: number; name: string };
  saved: boolean;
  totalImages: number;
}

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
})
export class ListingsComponent {
  propertyList: Property[] = [
    {
      id: 101,
      image_01: 'home-1.jpg',
      name: 'Individual Home',
      address: 'MGR Nagar',
      price: 5000000,
      type: 'Villa',
      offer: 'For Sale',
      bhk: 4,
      status: 'Available',
      furnished: 'Fully Furnished',
      carpet: 3200,
      date: '2025-02-23',
      user: { id: 1, name: 'Thirisha' },
      saved: false,
      totalImages: 1
    },
    {
      id: 102,
      image_01: 'home-3.webp',
      name: 'Home',
      address: 'Madurai',
      price: 2500000,
      type: 'Apartment',
      offer: 'For Rent',
      bhk: 2,
      status: 'Occupied',
      furnished: 'Semi-Furnished',
      carpet: 1200,
      date: '2025-02-20',
      user: { id: 2, name: 'Divya' },
      saved: true,
      totalImages: 2
    }
  ];

  toggleSave(property: Property) {
    property.saved = !property.saved;
  }

  sendEnquiry(property: Property) {
    alert(`Enquiry sent for ${property.name}`);
  }

  getImagePath(imageName: string): string {
    if (!imageName) {
      return './assets/images/default.jpg'; // Fallback image
    }
    return './assets/images/' + imageName;
  }
}
