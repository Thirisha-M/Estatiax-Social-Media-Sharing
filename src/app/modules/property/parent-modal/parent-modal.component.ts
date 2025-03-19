import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { ModalComponent } from '../modal/modal.component';
@Component({
  selector: 'app-parent-modal',
  standalone: true,
  imports: [],
  templateUrl: './parent-modal.component.html',
  styleUrl: './parent-modal.component.css'
})
export class ParentModalComponent {

  userEmail: string;
  isModalOpen: boolean = false;

  constructor(private propertyService: PropertyService,private modalComponent: ModalComponent) { 
    this.userEmail = 'user@example.com'; // Initialize with a default value or fetch it from a service
  }
  shareToTwitter(property: any) {
    if (!property) {
      alert("Property details are missing!");
      return;
    }
  
    const tweetText = `
      🏡 Property For Sale!
      📍 Location: ${property.data.address}
      💰 Price: ₹${property.data.price}
      🔗 View: ${window.location.origin}/view-property/${property._id}
    `;
  
    this.propertyService.postTweet(tweetText, this.userEmail).subscribe({
      next: () => {
        alert('✅ Tweet Posted Successfully!');
        this.isModalOpen = false;
      },
      error: (err) => {
        console.error('❌ Failed to Post Tweet:', err);
        alert(`Tweet Failed: ${err.error?.message || 'Unknown error'}`);
      },
    });
  }
  
}
