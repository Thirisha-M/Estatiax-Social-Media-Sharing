// update-property.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-update-property',
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.css'],
  standalone:true,
  imports:[ReactiveFormsModule,FormsModule,RouterModule]
})
export class UpdatePropertyComponent implements OnInit {
  propertyForm: FormGroup;
  propertyId: string = '';
  rev: string = '';
  selectedImages: File[] = [];
  userId: string = '';
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    console.log('User ID:', this.userId);

    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.getPropertyDetails();
  }

  getPropertyDetails() {
    this.propertyService.getPropertyById(this.propertyId).subscribe((property) => {
      if (property) {
        this.rev = property._rev;
        this.propertyForm.patchValue({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location
        });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedImages = Array.from(event.target.files);
  }
 

  onUpdateProperty() {
    if (this.propertyForm.valid) {
      this.isLoading = true; // Start loading spinner
      const updatedData = this.propertyForm.value;
      this.propertyService.updateProperty(this.propertyId, updatedData, this.rev).subscribe({
        next: (response) => {
          if (this.selectedImages.length > 0) {
            const formData = new FormData();
            this.selectedImages.forEach((file: File) => formData.append('images', file));
            this.propertyService.onStorepropertyImage(this.userId, this.propertyId, formData).subscribe({
              next: (imageResponse) => {
                console.log('Images uploaded successfully:', imageResponse);
                this.isLoading = false; // Stop loading spinner
                alert('Property Updated Successfully');
                this.router.navigate(['/my-listings']);
              },
              error: (err: any) => {
                console.error('Failed to upload images:', err);
                this.isLoading = false;
              }
            });
          } else {
            this.isLoading = false; // Stop spinner if no images
            alert('Property Updated Successfully');
            this.router.navigate(['/my-listings']);
          }
        },
        error: (err: any) => {
          console.error('Failed to update property:', err);
          this.isLoading = false;
          alert('Failed to update property');
        }
      });
    }
  }
}  