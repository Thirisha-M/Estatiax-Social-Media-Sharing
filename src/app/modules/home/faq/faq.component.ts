import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {
  faqs = [
    { question: 'How to cancel booking?', answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.', isOpen: true },
    { question: 'When will I get the possession?', answer: 'Repellendus veritatis ducimus aut accusantium sunt error esse laborum.', isOpen: true },
    { question: 'Where can I pay the rent?', answer: 'Cumque ipsum ab deserunt sit, excepturi non ad.', isOpen: false },
    { question: 'How to contact buyers?', answer: 'Accusantium sunt error esse laborum cumque ipsum.', isOpen: false },
    { question: 'Why is my listing not showing up?', answer: 'Lorem ipsum dolor sit amet consectetur.', isOpen: false },
    { question: 'How to promote my listing?', answer: 'Repellendus veritatis ducimus aut accusantium.', isOpen: false }
  ];

  toggleFAQ(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
