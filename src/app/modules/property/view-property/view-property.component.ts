import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../home/header/header.component";
import { FooterComponent } from "../../home/footer/footer.component";

@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.css'],
  imports: [CommonModule, HeaderComponent, FooterComponent],
  standalone: true
})
export class ViewPropertyComponent implements OnInit {
  property: any;
  user: any;
  isSaved: boolean = false;
  propertyDetails: any[] = [];
  amenities: any[] = [];
  selectedImage: string = '';

  constructor(private route: ActivatedRoute, private propertyService: PropertyService) {}

  ngOnInit() {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.propertyService.getPropertyById(propertyId).subscribe(data => {
        if (data) {
          console.log("Property Data: ", data);
          
          // Assign the property data before using it
          this.property = data;
          this.isSaved = data.isSaved;
          
          // Ensure there are images available before setting selectedImage
          if (data.data.imageUrls?.filePaths?.length > 0) {
            this.selectedImage = data.data.imageUrls.filePaths[0]; // Set first image as default
          }

          this.propertyDetails = [
            { label: 'Rooms', value: data.data.bhk ? `${data.data.bhk} BHK` : 'N/A' },
            { label: 'Deposit', value: data.data.deposit || 'N/A' },
            { label: 'Status', value: data.data.status || 'N/A' },
            { label: 'Carpet Area', value: data.data.carpet_area ? `${data.data.carpet_area} sqft` : 'N/A' },
            { label: 'Property Age', value: data.data.property_age || 'N/A' },
            { label: 'Total Floors', value: data.data.total_floors || 'N/A' }
          ];

          this.amenities = [
            { label: 'Lift', value: data.data.lift },
            { label: 'Security Guard', value: data.data.security_guard },
            { label: 'Gym', value: data.data.gym },
            { label: 'Parking Area', value: data.data.parking_area },
            { label: 'Shopping Mall', value: data.data.shopping_mall },
            { label: 'Hospital', value: data.data.hospital },
            { label: 'School', value: data.data.school },
            { label: 'Water Supply', value: data.data.watersupply }
          ];

          // Assign user details if available
          if (data.user) {
            this.user = data.user;
          }
        } else {
          console.error("Property not found!");
        }
      });
    }
  }

  toggleSave(propertyId: string) {
    this.isSaved = !this.isSaved;
    this.propertyService.saveProperty(propertyId, this.isSaved).subscribe(() => {
      alert(this.isSaved ? 'Property Saved Successfully!' : 'Property Unsaved!');
    });
  }

  sendEnquiry() {
    alert('Enquiry sent successfully!');
  }
}
