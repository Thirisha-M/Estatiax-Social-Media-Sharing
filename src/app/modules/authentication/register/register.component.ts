import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private propertyService: PropertyService) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, this.nameValidator.bind(this)]],

      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.com$/)
      ]],

      phone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.registerForm.reset();
  }

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const nameRegex = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*$/;
    const uppercaseCount = (value.match(/[A-Z]/g) || []).length;

    if (!nameRegex.test(value)) {
      return { invalidName: true };
    }

    if (uppercaseCount < 1 || uppercaseCount > 2) {
      return { uppercaseLimit: true };
    }

    return null;
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      const { name, email, phone, password } = this.registerForm.value;


      this.propertyService.getUserDetails(email).subscribe({
        next: (response: any) => {
          const emailExists = response.rows.some((user: any) => user.value.email === email);
          if (emailExists) {
            alert('The email address is already in use. Please use a different email.');
            this.registerForm.get('email')?.setErrors({ emailTaken: true });
          } else {
            const userData = {
              _id: `user_${uuidv4()}`,
              data: { name, email, phone, password, type: 'user' }
            };

            this.propertyService.addUser(userData).subscribe({
              next: () => {
                alert('Registration Successful!');
                this.registerForm.reset();
                this.router.navigate(['/login']);
              },
              error: (err) => {
                alert(`Registration Failed! Error: ${err.message}`);
              },
            });
          }
        },
        error: (err) => {
          alert(`Error occurred while verifying user: ${err.message}`);
        },
      });
    } else {
      alert('Please fill all fields correctly.');
      this.registerForm.markAllAsTouched();
    }
  }
}
