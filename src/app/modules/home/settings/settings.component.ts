import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';
import { ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from "../../property/modal/modal.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [ModalComponent, RouterModule, CommonModule],
  standalone: true,
})
export class SettingsComponent implements OnInit {
  hasTwitterToken = false;
  hasInstagramToken = false;
  hasFacebookToken = false;
  userEmail: string | null = '';

  showModal = false;
  selectedPlatform = ''; // Holds which platform is being unauthorized

  constructor(private propertyService: PropertyService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail');
    if (this.userEmail) {
      this.checkOAuthParams();
      this.checkUserToken();
    }
  }

  checkOAuthParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("oauth_token");
    const oauthVerifier = urlParams.get("oauth_verifier");

    if (oauthToken && oauthVerifier && this.userEmail) {
      this.propertyService.getAccessToken(oauthToken, oauthVerifier, this.userEmail).subscribe(
        (res: any) => {
          localStorage.setItem("access_token", res.oauth_token);
          localStorage.setItem("access_token_secret", res.oauth_token_secret);
          this.hasTwitterToken = true;
          this.cdRef.detectChanges();
          alert("Twitter Token Stored Successfully");
        },
        (err) => {
          console.error("OAuth Error:", err);
          alert("Twitter Token Storage Failed");
        }
      );
    }
  }

  checkUserToken() {
    if (!this.userEmail) return;

    this.propertyService.getUserDetails(this.userEmail).subscribe(
      (res: any) => {
        if (res.rows.length > 0) {
          const user = res.rows[0].value;
          this.hasTwitterToken = !!(user.data.oauth_token && user.data.oauth_token_secret);
          this.cdRef.detectChanges();
        }
      },
      (err) => console.error('Failed to fetch user details:', err)
    );
  }

  authorizeTwitter() {
    this.propertyService.getRequestToken().subscribe((res) => {
      if (res.authorizeUrl) {
        window.open(res.authorizeUrl, "_self");
      } else {
        alert("Twitter Authorization Failed");
      }
    });
  }

  openConfirmationModal(platform: string) {
    this.selectedPlatform = platform;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmUnauthorize() {
    switch (this.selectedPlatform) {
      case 'twitter':
        this.unauthorizeTwitter();
        break;
      case 'instagram':
        this.unauthorizeInstagram();
        break;
      case 'facebook':
        this.unauthorizeFacebook();
        break;
      default:
        break;
    }

    this.showModal = false;
  }

  unauthorizeTwitter() {
    if (!this.userEmail) return;

    this.propertyService.removeUserTokens(this.userEmail).subscribe(
      () => {
        this.hasTwitterToken = false;
        this.cdRef.detectChanges();
        alert("Twitter Token Removed Successfully");
      },
      (err) => {
        console.error("Error Removing Token:", err);
        alert("Failed to Remove Twitter Token");
      }
    );
  }

  authorizeInstagram() {
    this.hasInstagramToken = true;
    this.cdRef.detectChanges();
  }

  unauthorizeInstagram() {
    this.hasInstagramToken = false;
    this.cdRef.detectChanges();
  }

  authorizeFacebook() {
    this.hasFacebookToken = true;
    this.cdRef.detectChanges();
  }

  unauthorizeFacebook() {
    this.hasFacebookToken = false;
    this.cdRef.detectChanges();
  }
}
