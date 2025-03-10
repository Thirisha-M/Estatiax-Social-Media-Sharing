import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, ModalComponent],
})
export class MyListingsComponent implements OnInit {
  properties: any[] = [];
  userId: string = 'USER_ID'; // Replace with actual user ID
  shareText: string = '';
  selectedProperty: any = null;
  isModalOpen: boolean = false;
  hasTwitterToken = false; //  Track if the user has an access token
  userEmail: string | null = '';


  constructor(private propertyService: PropertyService, private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadProperties();
    this.checkOAuthParams(); //  Keep Twitter OAuth Handling
    this.checkUserToken(); //  Check if the user has a stored Twitter token

    this.loadProperties();
    this.userEmail = localStorage.getItem('userEmail'); //Get email from localStorage
    if (this.userEmail) {
      console.log(' User Email Found:', this.userEmail);
      this.checkUserToken(); //  Check if the user has an OAuth token
    } else {
      console.log(' No User Email Found in Local Storage');
    }
  }

  loadProperties() {
    this.propertyService.getUserProperties(this.userId).subscribe((data: any) => {
      this.properties = data.map((property: any) => {
        return {
          ...property,
          data: property.data || {},
          imageUrls: property.data.imageUrls
            ? { filePaths: property.data.imageUrls.filePaths }
            : { filePaths: [] },
        };
      });
      console.log(this.properties);
    });
  }

  deleteProperty(propertyId: string) {
    if (confirm('Are you sure you want to delete this listing?')) {
      this.propertyService.deleteProperty(propertyId).subscribe(() => {
        this.properties = this.properties.filter((prop) => prop._id !== propertyId);
        alert('Property Deleted Successfully');
      });
    }
  }

  //  Twitter OAuth Handling (Preserved from Current Code)
  getRequestToken(property: any) {
    this.propertyService.getRequestToken().subscribe(
      (res) => {
        console.log('Request Token:', res.oauth_token);
        alert(`Request Token Generated for Property: ${property.property_name}`);
      },
      (err) => {
        console.error(' Token Error:', err);
        alert('Failed to Generate Twitter Token');
      }
    );
  }

  authorizeToken(property: any) {
    this.propertyService.getRequestToken().subscribe((res) => {
      console.log("Authorize URL:", res.authorizeUrl);
      if (res.authorizeUrl) {
        window.open(res.authorizeUrl, "_self"); //  Navigates to Twitter
      } else {
        alert(" Twitter Authorization Failed");
      }
    });
  }

  //  Check if the user already has an access token in CouchDB
  checkUserToken() {
    if (!this.userEmail) return;

    this.propertyService.getUserDetails(this.userEmail).subscribe(
      (res: any) => {
        console.log('🔍 Checking User Token:', res);
        if (res.rows.length > 0) {
          const user = res.rows[0].value;
          this.hasTwitterToken = !!(user.data.oauth_token && user.data.oauth_token_secret);
          console.log(' Has Twitter Token:', this.hasTwitterToken);
        } else {
          console.log(' No User Data Found in CouchDB');
        }
      },
      (err) => console.error(' Failed to fetch user details:', err)
    );
  }
  checkOAuthParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("oauth_token");
    const oauthVerifier = urlParams.get("oauth_verifier");
    const userEmail = localStorage.getItem("userEmail");

    if (oauthToken && oauthVerifier && userEmail) {
      this.propertyService.getAccessToken(oauthToken, oauthVerifier, userEmail).subscribe(
        (res: any) => {
          localStorage.setItem("access_token", res.oauth_token);
          localStorage.setItem("access_token_secret", res.oauth_token_secret);
          this.hasTwitterToken = true; //Immediately show "Post Tweet" button
          this.cdRef.detectChanges(); //Force UI update
          alert("Twitter Token Stored Successfully");
        },
        (err) => {
          console.error("OAuth Error:", err);
          alert("Twitter Token Storage Failed");
        }
      );
    }
  }


  openModal(property: any) {
    this.selectedProperty = property;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedProperty = null;
  }

  shareToTwitter() {
    if (this.selectedProperty) {
      const tweetText = `
         Property For Sale!
         Location: ${this.selectedProperty.data.address}
         Price: ₹${this.selectedProperty.data.price}
         View: ${window.location.origin}/view-property/${this.selectedProperty._id}
      `;
      const email = localStorage.getItem('userEmail');
      if (email) {
        this.propertyService.postTweet(tweetText, email).subscribe({
          next: () => {
            alert('Tweet Posted Successfully!');
            this.closeModal();
          },
          error: () => {
            alert('Failed to Post Tweet!');
          },
        });
      } else {
        alert('Email Not Found in Local Storage');
      }
    }
  }

  // Integrated WhatsApp & Web Share API (From Old Code)
  async shareProperty(property: any) {
    this.shareText = `
      Location: ${property.data.location}
      Address: ${property.data.address}
      Price: ₹${property.data.price}
      Click Here to View Full Property 
      ${window.location.origin}/view-property/${property._id}
    `;

    const shareOptions: any = {
      title: property.data.property_name,
      text: this.shareText,
      url: `${window.location.origin}/view-property/${property._id}`,
      files: [],
    };

    // Convert Image URLs to Files
    if (property.data.imageUrls.filePaths.length > 0) {
      for (let imgUrl of property.data.imageUrls.filePaths) {
        const imageFile = await this.urlToFile(imgUrl, 'property.jpg', 'image/jpeg');
        shareOptions.files.push(imageFile);
      }
    }

    if (navigator.canShare && navigator.canShare(shareOptions)) {
      navigator.share(shareOptions)
        .then(() => console.log('Property Shared Successfully'))
        .catch((error) => console.error(' Sharing Failed', error));
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
