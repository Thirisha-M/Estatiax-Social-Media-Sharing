import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
})
export class MyListingsComponent implements OnInit {
  properties: any[] = [];
  userId: string = 'USER_ID'; // Replace with actual user ID
  shareText: string = '';

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit() {
    this.loadProperties();
    this.checkOAuthParams(); // ✅ Keep Twitter OAuth Handling
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

  // ✅ Twitter OAuth Handling (Preserved from Current Code)
  getRequestToken(property: any) {
    this.propertyService.getRequestToken().subscribe(
      (res) => {
        console.log('✅ Request Token:', res.oauth_token);
        alert(`Request Token Generated for Property: ${property.property_name}`);
      },
      (err) => {
        console.error('❌ Token Error:', err);
        alert('Failed to Generate Twitter Token');
      }
    );
  }

  authorizeToken(property: any) {
    this.propertyService.getRequestToken().subscribe((res) => {
      console.log("✅ Authorize URL:", res.authorizeUrl);
      if (res.authorizeUrl) {
        window.open(res.authorizeUrl, "_self"); // 🔥 Navigates to Twitter
      } else {
        alert("❌ Twitter Authorization Failed");
      }
    });
  }

  checkOAuthParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("oauth_token");
    const oauthVerifier = urlParams.get("oauth_verifier");
    const userEmail = localStorage.getItem("user_id");

    if (oauthToken && oauthVerifier && userEmail) {
      this.propertyService.getAccessToken(oauthToken, oauthVerifier, userEmail).subscribe(
        (res: any) => {
          localStorage.setItem("access_token", res.oauth_token);
          localStorage.setItem("access_token_secret", res.oauth_token_secret);
          alert("✅ Twitter Token Stored Successfully");
        },
        (err) => {
          console.error("❌ OAuth Error:", err);
          alert("Twitter Token Storage Failed");
        }
      );
    }
  }

  shareToTwitter(property: any) {
    const tweet = prompt("Enter your tweet 📝");
    if (tweet) {
      const email = localStorage.getItem("userEmail");
      if (email !== null) {
        this.propertyService.postTweet(tweet, email).subscribe({
          next: (res: any) => {
            console.log("🎯 Tweet Response:", res);
            alert("🚀 Tweet Posted Successfully!");
          },
          error: (err) => {
            console.error("❌ API Error:", err);
            alert("Failed to Post Tweet!");
          },
        });
      } else {
        alert("❌ Email Not Found in Local Storage");
      }
    }
  }

  // ✅ Integrated WhatsApp & Web Share API (From Old Code)
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
        .then(() => console.log('✅ Property Shared Successfully'))
        .catch((error) => console.error('❌ Sharing Failed', error));
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
