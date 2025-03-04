import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = [
    { title: 'Buy House', img: 'assets/images/icon-1.png', description: 'Lorem ipsum dolor sit amet consectetur.', link: '/buy-house' },
    { title: 'Rent House', img: 'assets/images/icon-2.png', description: 'Adipisicing elit. Doloremque, incidunt.', link: '/rent-house' },
    { title: 'Sell House', img: 'assets/images/icon-3.png', description: 'Doloremque incidunt repellat tempora quas.', link: '/sell-house' },
    { title: 'Flats & Buildings', img: 'assets/images/icon-4.png', description: 'Sed suscipit facilis obcaecati voluptatem.', link: '/flats-buildings' },
    { title: 'Shops & Malls', img: 'assets/images/icon-5.png', description: 'Perspiciatis mollitia iusto cupiditate earum.', link: '/shops-malls' },
    { title: '24/7 Service', img: 'assets/images/icon-6.png', description: 'Cumque accusamus veritatis sapiente.', link: '/support' }
  ];
}
