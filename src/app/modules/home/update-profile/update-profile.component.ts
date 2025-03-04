import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  updateProfileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Simulated user data (Replace this with actual data from CouchDB)
    const userData = {
      name: 'Thirisha',
      email: 'thirisha.m20@example.com',
      number: '6383099053'
    };

    // Initialize the form
    this.updateProfileForm = this.fb.group({
      name: [userData.name, [Validators.required, Validators.maxLength(50)]],
      email: [{ value: userData.email, disabled: true }, [Validators.required, Validators.email]], //  Correct way
      number: [userData.number, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      oldPass: ['', [Validators.required, Validators.minLength(6)]],
      newPass: ['', [Validators.required, Validators.minLength(6)]],
      cPass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  updateProfile() {
    if (this.updateProfileForm.valid) {
      console.log('Profile Updated:', this.updateProfileForm.getRawValue()); // Includes disabled fields
      alert('Profile updated successfully!');
    } else {
      alert('Please fill out the form correctly.');
    }
  }
}
