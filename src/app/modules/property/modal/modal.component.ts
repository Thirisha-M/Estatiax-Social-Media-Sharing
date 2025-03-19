import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PropertyService } from '../../../services/property.service';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule, TitleCasePipe],
  standalone: true,
})
export class ModalComponent {
  @Input() property: any;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() shareTweet = new EventEmitter<void>();
  @Output() shareInstagram = new EventEmitter<void>();
  @Output() shareFacebook = new EventEmitter<void>();

  hasTwitterToken: boolean = false;
  hasInstagramToken: boolean = false;
  hasFacebookToken: boolean = false;

  selectedPlatform: string = '';
  errorMessage: string = '';
  isPosting: boolean = false; // Prevent multiple clicks
  authorizedPlatforms: Set<string> = new Set(); // Stores authorized platforms for tick effect

  constructor(
    private propertyService: PropertyService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchAuthorizationStatus();

    this.route.paramMap.subscribe(params => {
      const propertyId = params.get('id');
      if (propertyId) {
        this.fetchPropertyDetails(propertyId);
      }
    });
  }

  fetchAuthorizationStatus() {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      console.error('User Email Not Found in Local Storage!');
      return;
    }

    this.propertyService.getAuthorizationStatus(email).subscribe(
      (authData) => {
        this.hasTwitterToken = !!authData.twitterToken;
        this.hasInstagramToken = !!authData.instagramToken;
        this.hasFacebookToken = !!authData.facebookToken;

        // Update authorized platforms
        if (this.hasTwitterToken) this.authorizedPlatforms.add('twitter');
        if (this.hasInstagramToken) this.authorizedPlatforms.add('instagram');
        if (this.hasFacebookToken) this.authorizedPlatforms.add('facebook');

        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching authorization status:', error);
      }
    );
  }

  fetchPropertyDetails(propertyId: string) {
    this.propertyService.getPropertyById(propertyId).subscribe(
      (property) => {
        this.property = property;
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error Fetching Property:', error);
      }
    );
  }

  close() {
    this.closeModal.emit();
    this.router.navigate(['/my-listings']);
  }

  selectPlatform(platform: string) {
    this.selectedPlatform = platform;
    this.errorMessage = ''; // Clear previous errors

    // Show a warning if the platform is not authorized
    if (!this.isAuthorized()) {
      this.errorMessage = `❌ You need to authorize ${platform} in settings before sharing.`;
    }
  }

  share() {
    if (!this.property) {
      this.errorMessage = 'No property selected! Please select a property before sharing.';
      return;
    }

    if (!this.isAuthorized()) {
      alert(`${this.selectedPlatform} authorization required! Please go to Settings to authorize.`);
      this.router.navigate(['/settings']);
      return;
    }

    const email = localStorage.getItem('userEmail');
    if (!email) {
      this.errorMessage = 'User Email Not Found in Local Storage!';
      return;
    }

    // Disable button while posting
    this.isPosting = true;

    const postText = `
      Property For Sale!
      Location: ${this.property.data?.address || 'Unknown'}
      Price: ₹${this.property.data?.price || 'N/A'}
      View: ${window.location.origin}/view-property/${this.property._id}
    `;

    // Call the service method before emitting event
    this.propertyService.postTweet(postText, email).subscribe({
      next: () => {
        alert('Tweet Posted Successfully!');
        this.authorizedPlatforms.add(this.selectedPlatform); // Add tick effect
        this.isPosting = false;
        this.closeModal.emit(); // Close modal after successful share
      },
      error: (err) => {
        console.error('Failed to Post Tweet:', err);
        this.errorMessage = `Error: ${err.error?.message || 'Unknown error'}`;
        this.isPosting = false;
      },
    });

    switch (this.selectedPlatform) {
      case 'twitter':
        this.shareTweet.emit();
        break;
      case 'instagram':
        this.shareInstagram.emit();
        break;
      case 'facebook':
        this.shareFacebook.emit();
        break;
      default:
        this.errorMessage = 'Please select a platform to share.';
        break;
    }
  }

  isAuthorized(): boolean {
    switch (this.selectedPlatform) {
      case 'twitter': return this.hasTwitterToken;
      case 'instagram': return this.hasInstagramToken;
      case 'facebook': return this.hasFacebookToken;
      default: return false;
    }
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
}
