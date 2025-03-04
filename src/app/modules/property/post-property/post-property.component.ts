import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PropertyService } from '../../../services/property.service';
import { v4 as uuidv4 } from 'uuid';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-property',
  templateUrl: './post-property.component.html',
  styleUrls: ['./post-property.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule]
})
export class PostPropertyComponent {
  propertyId: string | null = '';
  propertyForm: FormGroup;
  selectedImages: File[] = [];
  imagePreviews: string[] = [];
  userid = localStorage.getItem("userId") || '';
  formData = new FormData();

  numericFields = [
    { name: 'price', label: 'Price', placeholder: 'Enter price' },
    { name: 'carpet_area', label: 'Carpet Area (sqft)', placeholder: 'Enter carpet area' },
  ];

  dropdownFields = [
    { name: 'property_type', label: 'Property Type', options: [{ value: 'home', label: 'Home' }, { value: 'flat', label: 'Flat' }] },
    { name: 'nature_type', label: 'Nature Type', options: [{ value: 'sale', label: 'Sale' }, { value: 'rent', label: 'Rent' }] },
    { name: 'bhk', label: 'BHK Type', options: [{ value: '1 BHK', label: '1 BHK' }, { value: '2 BHK', label: '2 BHK' }, { value: '3 BHK', label: '3 BHK' }, { value: '4 BHK', label: '4 BHK' }, { value: '5 BHK', label: '5 BHK' }, { value: '6 BHK', label: '6 BHK' }, { value: '7 BHK', label: '7 BHK' }] },
    { name: 'furnished', label: 'Furnished Status', options: [{ value: 'furnished', label: 'Furnished' }, { value: 'unfurnished', label: 'Unfurnished' }] },
  ];

  facilities = [
    { name: 'lift', label: 'Lift' },
    { name: 'security_guard', label: 'Security Guard' },
    { name: 'gym', label: 'Gym' },
    { name: 'parking_area', label: 'Parking Area' },
    { name: 'shopping_mall', label: 'Shopping Mall' },
    { name: 'hospital', label: 'Hospital' },
    { name: 'school', label: 'School' },
    { name: 'playground', label: 'Playground' },
    { name: 'watersupply', label: 'Water Supply' },
    { name: 'marketarea', label: 'Market Area' }
  ];

  constructor(private fb: FormBuilder, private propertyService: PropertyService, private route: ActivatedRoute) {
    this.propertyForm = this.fb.group({
      property_name: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      address: ['', [Validators.required, Validators.maxLength(1000)]],
      location: ['', [Validators.required, Validators.maxLength(1000)]],
      facebook: [''],
      instagram: [''],
      twitter: ['']
    });

    this.numericFields.forEach(field => {
      this.propertyForm.addControl(field.name, this.fb.control(null, [Validators.required, Validators.min(0)]));
    });

    this.dropdownFields.forEach(field => {
      this.propertyForm.addControl(field.name, this.fb.control('', Validators.required));
    });

    this.facilities.forEach(facility => {
      this.propertyForm.addControl(facility.name, this.fb.control(false));
    });
  }

  ngOnInit() {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.propertyService.getPropertyById(propertyId).subscribe((res: any) => {
        this.propertyForm.patchValue(res.data);
        this.propertyId = propertyId;
      });
    }
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectedImages = Array.from(files);
      this.selectedImages.forEach((file: File) => this.formData.append('images', file));
    }
  }

  onSubmit() {
    const propertyId = `property_2_${uuidv4()}`;
    if (this.propertyForm.valid) {
      this.propertyService.onStorepropertyImage(this.userid, propertyId, this.formData).subscribe({
        next: (imageResponse) => {
          const formData = {
            _id: propertyId,
            data: {
              ...this.propertyForm.value,
              imageUrls: imageResponse,
              type: 'property',
              created_at: new Date().toISOString()
            }
          };

          this.propertyService.createProperty(formData).subscribe({
            next: () => {
              alert('Property posted successfully!');
              this.propertyForm.reset();
              this.imagePreviews = [];
              this.selectedImages = [];
            },
            error: () => alert('Failed to post property.')
          });
        },
        error: () => alert('Failed to upload images.')
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}