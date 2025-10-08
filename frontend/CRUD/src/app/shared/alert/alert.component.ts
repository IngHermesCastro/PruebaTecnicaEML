import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {


  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() dismissible: boolean = true;
  @Input() autoClose: number = 0;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  isVisible: boolean = true;

  ngOnInit(): void {
    // Auto-cerrar si está configurado
    if (this.autoClose > 0) {
      setTimeout(() => {
        this.closeAlert();
      }, this.autoClose);
    }
  }

  closeAlert(): void {
    this.isVisible = false;
    this.close.emit();
  }


  get alertClass(): string {
    const classes: { [key: string]: string } = {
      success: 'alert-success',
      error: 'alert-error',
      warning: 'alert-warning',
      info: 'alert-info'
    };
    return classes[this.type] || 'alert-info';
  }

  get defaultTitle(): string {
    if (this.title) return this.title;

    const titles: { [key: string]: string } = {
      success: '¡Éxito!',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información'
    };
    return titles[this.type] || 'Notificación';
  }

  get iconPath(): string {
    const icons: { [key: string]: string } = {
      success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      error: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
      info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    };
    return icons[this.type] || icons['info'];
  }
}
