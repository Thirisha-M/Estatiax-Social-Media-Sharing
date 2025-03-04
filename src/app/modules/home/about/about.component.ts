import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [CommonModule, RouterModule]
})
export class AboutComponent {
  aboutImage: string = 'assets/images/about-img.svg';

  steps = [
    { img: 'assets/images/step-1.png', title: 'Search Property', desc: 'Find your dream property easily.' },
    { img: 'assets/images/step-2.png', title: 'Contact Agents', desc: 'Get in touch with professional agents.' },
    { img: 'assets/images/step-3.png', title: 'Enjoy Property', desc: 'Move in and start your new journey!' }
  ];

  reviews = [
    { img: 'assets/images/sugu.webp', name: 'Sugunesan', rating: 4.5, review: 'Great service and support throughout the process!' },
    { img: 'assets/images/balaji.webp', name: 'Balaji', rating: 5, review: 'Highly recommended for anyone buying a property!' },
    { img: 'assets/images/Brijith.webp', name: 'Brijith', rating: 4, review: 'Smooth process and excellent customer service!' },
    { img: 'assets/images/asswin.webp', name: 'Raja Aswin', rating: 5, review: 'Fast response time and great guidance!' },
    { img: 'assets/images/arul.webp', name: 'ArulKumaran', rating: 4.5, review: 'Professional service from start to finish!' },
    { img: '/assets/images/rahul.webp', name: 'Rahul', rating: 5, review: 'I found my dream home thanks to them!' },
  ];
}
