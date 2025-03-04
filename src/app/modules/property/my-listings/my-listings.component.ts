import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-my-listings',
  standalone: true,
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css'],
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
})
export class MyListingsComponent implements OnInit {
  properties: any[] = [];
  userId: string = 'USER_ID';// Replace with actual user ID
  shareUrl: string = '';
  shareText: string = '';
  previewProperty: any = null;
  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getUserProperties(this.userId).subscribe((data: any) => {
      this.properties = data.map((property: any) => {
        return {
          ...property,
          data: property.data || {},
          imageUrls: property.data.imageUrls
            ? { filePaths: property.data.imageUrls.filePaths }
            : { filePaths: [] }
        };
      });
      console.log(this.properties);
    });
  }

  deleteProperty(propertyId: string) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.propertyService.deleteProperty(propertyId).subscribe(() => {
        this.properties = this.properties.filter((prop) => prop._id !== propertyId);
      });
    }
  }


  async shareOnWhatsApp(property: any) {
    // const imageUrl = await this.urlToFile(property.data.imageUrls.filePaths[0], 'property.jpg', 'image/jpeg');
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(property.data.address)} ${encodeURIComponent(property.data.imageUrls.filePaths[0])}`;
    window.open(whatsappUrl, '_blank');
  }


  async shareProperty(property: any) {
    //  Here is your Details
    this.shareText = `
   Location: ${property.data.location}
   Address: ${property.data.address}
   Price: ₹${property.data.price}
  Click Here to View Full Property 
  ${window.location.origin}/view-property/${property._id}
    `;

    const shareOptions: any = {
      title: property.data.property_name,
      text: this.shareText, //  Fixed this line
      url: `${window.location.origin}/view-property/${property._id}`,
      files: []
    };

    //  Convert Images to Files
    if (property.data.imageUrls.filePaths.length > 0) {
      for (let imgUrl of property.data.imageUrls.filePaths) {
        const imageFile = await this.urlToFile(imgUrl, 'property.jpg', 'image/jpeg');
        shareOptions.files.push(imageFile);
      }
    }

    //  Final Sharing Code
    if (navigator.canShare && navigator.canShare(shareOptions)) {
      navigator.share(shareOptions)
        .then(() => console.log('Property Shared Successfully '))
        .catch((error) => console.error('Sharing Failed', error));
    } else {
      alert('Sharing not supported on this browser');
    }
  }

  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  }


}  