import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-property',
  standalone: true,
  templateUrl: './search-property.component.html',
  styleUrls: ['./search-property.component.css'],
  imports:[ReactiveFormsModule,RouterModule,FormsModule,]
})
export class SearchPropertyComponent {
  searchFilters = {
    location: '',
    offer: '',
    type: '',
    bhk: '',
    min: '',
    max: '',
    status: '',
    furnished: ''
  };

  bhkOptions = Array.from({ length: 9 }, (_, i) => `${i + 1} BHK`);
  budgetOptions = [
    { value: 5000, label: '5k' },
    { value: 10000, label: '10k' },
    { value: 15000, label: '15k' },
    { value: 20000, label: '20k' },
    { value: 30000, label: '30k' },
    { value: 40000, label: '40k' },
    { value: 50000, label: '50k' },
    { value: 100000, label: '1 lac' },
    { value: 500000, label: '5 lac' },
    { value: 1000000, label: '10 lac' },
    { value: 5000000, label: '50 lac' },
    { value: 10000000, label: '1 Cr' },
    { value: 50000000, label: '5 Cr' },
    { value: 100000000, label: '10 Cr' }
  ];
  
  offerTypes = ['Sale', 'Resale', 'Rent'];
  propertyTypes = ['Flat', 'House', 'Shop'];
  statuses = ['Ready to Move', 'Under Construction'];
  furnishedOptions = ['Unfurnished', 'Furnished', 'Semi-Furnished'];

  searchProperties() {
    console.log('Filters Applied:', this.searchFilters);
    // Implement the API call or filtering logic here
  }
}
