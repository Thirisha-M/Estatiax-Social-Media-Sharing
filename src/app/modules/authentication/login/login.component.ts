import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private propertyService: PropertyService,
    private authService: AuthService //  Inject AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.propertyService.getUserByEmail(email).subscribe(
        (response) => {
          console.log('CouchDB Response:', response);

          if (response.rows.length > 0) {
            const user = response.rows[0].value;
            console.log('User Data:', user);

            if (user.data.password === password) {
              // ✅ Store login state in AuthService & LocalStorage
              this.authService.login(user);
              alert('Login Successful!');

              this.router.navigate(['/']).then(() => {
                console.log('Navigation successful');
              }).catch(err => console.error('Navigation error:', err));

            } else {
              this.loginError = 'Incorrect password. Please try again.';
            }
          } else {
            this.loginError = 'User not found. Please register first.';
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
          this.loginError = 'Login failed. Please try again later.';
        }
      );
    } else {
      this.loginError = 'Please enter valid credentials.';
    }
  }
}
