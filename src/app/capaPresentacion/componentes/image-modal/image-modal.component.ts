import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css'
})
export class ImageModalComponent {
  @Input() imageIncidente: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  isActive: boolean = true;

  closeModalEvent(): void {
    this.isActive = false;
    this.closeModal.emit();
  }
}
