import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class ModalComponent {
  @Input() property: any;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() shareTweet = new EventEmitter<void>();
  @Output() shareInstagram = new EventEmitter<void>();
  @Output() shareFacebook = new EventEmitter<void>();

  selectedPlatform: string = '';

  close() {
    this.closeModal.emit();
  }

  selectPlatform(platform: string) {
    this.selectedPlatform = platform;
  }

  share() {
    if (this.selectedPlatform === 'twitter') {
      this.shareTweet.emit();
    } else if (this.selectedPlatform === 'instagram') {
      this.shareInstagram.emit();
    } else if (this.selectedPlatform === 'facebook') {
      this.shareFacebook.emit();
    } else {
      alert('Please select a platform to share.');
    }
  }
}
