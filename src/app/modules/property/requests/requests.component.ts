import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Request {
  id: number;
  sender: { name: string; number: string; email: string };
  property: { id: number; propertyName: string };
}

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent {
  requests: Request[] = [
    {
      id: 1,
      sender: { name: 'John Doe', number: '9876543210', email: 'john.doe@example.com' },
      property: { id: 101, propertyName: 'Luxury Villa' }
    },
    {
      id: 2,
      sender: { name: 'Jane Smith', number: '9123456789', email: 'jane.smith@example.com' },
      property: { id: 102, propertyName: 'Modern Apartment' }
    }
  ];

  deleteRequest(requestId: number) {
    if (confirm('Remove this request?')) {
      this.requests = this.requests.filter(req => req.id !== requestId);
      alert('Request deleted successfully.');
    }
  }
}
