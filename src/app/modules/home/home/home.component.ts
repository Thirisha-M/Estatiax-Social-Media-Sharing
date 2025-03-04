import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { ServicesComponent } from "../services/services.component";
import { FaqComponent } from "../faq/faq.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule, HeaderComponent, FooterComponent, ServicesComponent, FaqComponent],
  standalone:true,
})
export class HomeComponent {
  location: string = '';
  propertyType: string = 'flat';
  bhk: string = '1';
  minBudget: string = '5000000';
  maxBudget: string = '10000000';

  onSubmit() {
    console.log('Search for:', {
      location: this.location,
      propertyType: this.propertyType,
      bhk: this.bhk,
      minBudget: this.minBudget,
      maxBudget: this.maxBudget
    });
  }
}
