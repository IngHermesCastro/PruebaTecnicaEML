import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/alert/alert.component';
import { User } from '../user.model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list',
  imports: [CommonModule, RouterLink, FormsModule, AlertComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, OnDestroy {
  
  // Lista de usuarios
  users: User[] = [];
  filteredUsers: User[] = [];
  
  // Estado de carga
  isLoading = true;
  
  // Búsqueda
  searchTerm = '';
  private searchSubject = new Subject<string>();
  
  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  
  // Modal de confirmación de eliminación
  showDeleteModal = false;
  userToDelete: User | null = null;
  
  // Alertas
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' = 'success';
  
  // Estadísticas
  stats = {
    total: 0,
    active: 0,
    inactive: 0
  };
  
  // Subject para destruir suscripciones
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga la lista de usuarios desde el servicio
   */
  loadUsers(): void {
    this.isLoading = true;
    
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.filteredUsers = users;
          this.calculateStats();
          this.updatePagination();
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.showAlertMessage('Error al cargar usuarios: ' + error.message, 'error');
        }
      });
  }

  /**
   * Configura el sistema de búsqueda con debounce
   */
  setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.performSearch(searchTerm);
      });
  }

  /**
   * Maneja el input de búsqueda
   */
  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  /**
   * Realiza la búsqueda de usuarios
   */
  performSearch(term: string): void {
    if (!term.trim()) {
      this.filteredUsers = this.users;
    } else {
      const searchLower = term.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.nombres.toLowerCase().includes(searchLower) ||
        user.apellidos.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.telefono.includes(searchLower)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  /**
   * Calcula las estadísticas de usuarios
   */
  calculateStats(): void {
    this.stats.total = this.users.length;
    this.stats.active = this.users.filter(u => u.estado !== 0).length;
    this.stats.inactive = this.users.filter(u => u.estado === 0).length;
  }

  /**
   * Abre el modal de confirmación para eliminar
   */
  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  /**
   * Cierra el modal de eliminación
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  /**
   * Confirma y ejecuta la eliminación del usuario
   */
  confirmDelete(): void {
    if (!this.userToDelete) return;

    const userId = this.userToDelete.id;
    const userName = `${this.userToDelete.nombres} ${this.userToDelete.apellidos}`;

    this.userService.deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showAlertMessage(`Usuario "${userName}" eliminado exitosamente`, 'success');
          this.closeDeleteModal();
          this.loadUsers(); // Recargar lista
        },
        error: (error) => {
          this.showAlertMessage('Error al eliminar usuario: ' + error.message, 'error');
          this.closeDeleteModal();
        }
      });
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getFullName(user: User): string {
    return `${user.nombres} ${user.apellidos}`;
  }

  /**
   * Formatea la fecha para mostrarla
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Obtiene el badge de estado
   */
  getStatusBadge(user: User): string {
    return user.estado === 0 ? 'badge-error' : 'badge-success';
  }

  /**
   * Obtiene el texto del estado
   */
  getStatusText(user: User): string {
    return user.estado === 0 ? 'Inactivo' : 'Activo';
  }

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  /**
   * Actualiza los datos de paginación
   */
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  /**
   * Obtiene los usuarios de la página actual
   */
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  /**
   * Cambia a la página anterior
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /**
   * Cambia a la página siguiente
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  /**
   * Va a una página específica
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Obtiene el array de números de página para mostrar
   */
  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // ==========================================
  // ALERTAS
  // ==========================================

  /**
   * Muestra un mensaje de alerta
   */
  showAlertMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // Ocultar alerta después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  /**
   * Cierra la alerta manualmente
   */
  closeAlert(): void {
    this.showAlert = false;
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Recarga la lista de usuarios
   */
  refreshList(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsers();
    this.showAlertMessage('Lista actualizada', 'success');
  }

  /**
   * Exporta los usuarios a CSV (funcionalidad extra)
   */
  exportToCSV(): void {
    const headers = ['ID', 'Nombres', 'Apellidos', 'Email', 'Teléfono', 'Fecha Registro', 'Fecha Modificación', 'Estado'];
    const csvContent = [
      headers.join(','),
      ...this.filteredUsers.map(user => [
        user.id,
        user.nombres,
        user.apellidos,
        user.email,
        user.telefono,
        user.fecha_registro,
        user.fecha_modificacion,
        user.estado === 0 ? 'Inactivo' : 'Activo'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.showAlertMessage('Usuarios exportados a CSV', 'success');
  }
}
