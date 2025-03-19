import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit() {
    this.checkOAuthParams();
    this.checkUserAuthorization(); //  Check if user is already authorized
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

    console.log(' OAuth Token:', oauthToken);
    console.log('OAuth Verifier:', oauthVerifier);

    if (oauthToken && oauthVerifier) {
      this.getAccessToken(oauthVerifier, oauthToken, );
    }
  }

  getAccessToken(oauthVerifier: string, oauthToken: string, ) {
    const userEmail = localStorage.getItem('userEmail') ?? '';
    if (!userEmail) {
      console.error('Email is Missing');
      alert('User Email Not Found!');
      return;
    }
  
    this.propertyService.getAccessToken(oauthToken, oauthVerifier, userEmail).subscribe(
      (res: any) => {
        console.log('Access Token API Response:', res);
  
        if (res && res.oauth_token && res.oauth_token_secret) {
          alert('Twitter Access Token Stored Successfully!');
  
          sessionStorage.setItem('twitter_access_token', res.oauth_token);
          sessionStorage.setItem('twitter_access_token_secret', res.oauth_token_secret);
  
          this.propertyService.updateUserTokens(userEmail, res.oauth_token, res.oauth_token_secret);
          this.isAuthorized = true;
  
          this.router.navigate(['/my-listings',]);  
        } else {
          alert('Invalid Token Response from API');
        }
      },
      (err: any) => {
        console.error('Access Token Error:', err);
        alert('Failed to Generate Access Token');
      }
    );
  }
  
  
  checkUserAuthorization() {
    const twitterAccessToken = sessionStorage.getItem('twitter_access_token'); //Check Token
    this.isAuthorized = !!twitterAccessToken; //If token exists, user is authorized
  }

  redirectToMyListings() {
    window.location.href = '/my-listings';
  }
}
