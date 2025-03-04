import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name: string = '';
  email: string = '';
  number: string = '';
  message: string = '';

  sendMessage() {
    if (this.name && this.email && this.number && this.message) {
      alert('Message sent successfully!');
      // Here, you can integrate backend API call to submit form data.
      console.log({ name: this.name, email: this.email, number: this.number, message: this.message });
      
      // Reset fields after submission
      this.name = '';
      this.email = '';
      this.number = '';
      this.message = '';
    } else {
      alert('Please fill in all fields before submitting.');
    }
  }
}
