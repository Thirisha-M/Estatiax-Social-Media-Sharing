// update-property.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';

@Component({
  selector: 'app-update-property',
  templateUrl: './update-property.component.html',
  styleUrls: ['./update-property.component.css'],
  standalone:true,
  imports:[ReactiveFormsModule,FormsModule,RouterModule]
})
export class UpdatePropertyComponent {
  propertyForm: FormGroup;
  propertyId: string = '';
  rev: string = '';
  selectedImages: File[] = [];
  userId: string = '';
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      location: ['', Validators.required]
    });
  }
}  