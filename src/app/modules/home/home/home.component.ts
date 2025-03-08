import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ServicesComponent } from '../services/services.component';
import { FaqComponent } from '../faq/faq.component';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    ServicesComponent,
    FaqComponent,
    
  ],
})
export class HomeComponent {
  location: string = '';
  propertyType: string = 'flat';
  bhk: string = '1';
  minBudget: string = '5000000';
  maxBudget: string = '10000000';

  isAuthorized: boolean = false;

  constructor(private propertyService: PropertyService, private router: Router) {} // 🔥 Injection Fixed ✅

  ngOnInit() {
    this.checkOAuthParams(); // Automatically check URL params on page load
  }

  onSubmit() {
    console.log('Search for:', {
      location: this.location,
      propertyType: this.propertyType,
      bhk: this.bhk,
      minBudget: this.minBudget,
      maxBudget: this.maxBudget,
    });
  }

  checkOAuthParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get('oauth_token');
    const oauthVerifier = urlParams.get('oauth_verifier');

    console.log('🔍 OAuth Token:', oauthToken); 
    console.log('🔍 OAuth Verifier:', oauthVerifier);

    if (oauthToken && oauthVerifier) {
      this.getAccessToken(oauthVerifier, oauthToken);
    }
  }

  getAccessToken(oauthVerifier: string, oauthToken: string) {
    const userEmail = localStorage.getItem('userEmail') ?? ''; // ✅ Email from session storage
    if (!userEmail) {
      console.error('🚫 Email is Missing');
      alert('User Email Not Found!');
      return;
    }

    this.propertyService.getAccessToken(oauthToken, oauthVerifier, userEmail).subscribe(
      (res: any) => {
        console.log('✅ Access Token API Response:', res);

        if (res) {
          alert('🎯 Twitter Access Token Generated & Stored Successfully!');
          sessionStorage.setItem('twitter_access_token', res.access_token); // Token Stored
          // this.redirectToMyListings(); // Redirect to My Listings Page
          
          this.propertyService.updateUserTokens(userEmail, res.oauth_token, res.oauth_token_secret);
          this.router.navigate(['/my-listings']);
          this.isAuthorized = true;
        }
      },
      (err: any) => {
        console.error('❌ Access Token Error:', err);
        alert('Failed to Generate Access Token');
      }
    );
  }

  redirectToMyListings() {
    window.location.href = '/my-listings'; // 🔥 Navigation Success
  }
}
