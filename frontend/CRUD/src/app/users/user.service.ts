// src/app/users/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private getUsersUrl = `${this.apiUrl}/get_users.php`; // http://localhost:8000/get_users.php
  private getUserUrl = `${this.apiUrl}/get_user.php`; // http://localhost:8000/get_user.php
  private createUrl = `${this.apiUrl}/create_user.php`; // http://localhost:8000/create_user.php
  private updateUrl = `${this.apiUrl}/update_user.php`; // http://localhost:8000/update_user.php
  private deleteUrl = `${this.apiUrl}/delete_user.php`; // http://localhost:8000/delete_user.php

  // Headers para las peticiones HTTP
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // BehaviorSubject para notificar cambios en la lista de usuarios
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ==========================================
  // MÉTODOS CRUD
  // ==========================================

  /**
   * GET - Obtiene todos los usuarios ordenados alfabéticamente (A-Z)
   * @returns Observable con array de usuarios
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.getUsersUrl, this.httpOptions).pipe(
      tap(users => {
        // Ordenar alfabéticamente por nombres
        const sortedUsers = users.sort((a, b) => 
          a.nombres.localeCompare(b.nombres)
        );
        this.usersSubject.next(sortedUsers);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * GET - Obtiene un usuario específico por ID
   * @param id - ID del usuario a buscar
   * @returns Observable con el usuario encontrado
   */
  getUserById(id: number): Observable<User> {
    const url = `${this.getUserUrl}?id=${id}`;
    return this.http.get<User>(url, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST - Crea un nuevo usuario
   * @param user - Datos del usuario a crear (sin ID)
   * @returns Observable con la respuesta del servidor
   */
  createUser(user: Omit<User, 'id' | 'fecha_registro' | 'fecha_modificacion'>): Observable<any> {
    return this.http.post<any>(this.createUrl, user, this.httpOptions).pipe(
      tap(response => {
        console.log('Usuario creado:', response);
        // Actualizar la lista de usuarios después de crear
        this.getUsers().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * PUT - Actualiza un usuario existente
   * @param id - ID del usuario a actualizar
   * @param user - Nuevos datos del usuario
   * @returns Observable con la respuesta del servidor
   */
  updateUser(id: number, user: Partial<User>): Observable<any> {
    const updateData = {
      id: id,
      ...user
    };
    
    return this.http.put<any>(this.updateUrl, updateData, this.httpOptions).pipe(
      tap(response => {
        console.log('Usuario actualizado:', response);
        // Actualizar la lista de usuarios después de editar
        this.getUsers().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE - Elimina un usuario (borrado lógico si implementaste estado)
   * @param id - ID del usuario a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteUser(id: number): Observable<any> {
    const url = `${this.deleteUrl}?id=${id}`;
    return this.http.delete<any>(this.deleteUrl, { ...this.httpOptions, body: { id } }).pipe(
      tap(response => {
        console.log('Usuario eliminado:', response);
        // Actualizar la lista de usuarios después de eliminar
        this.getUsers().subscribe();
      }),
      catchError(this.handleError)
    );
  }

  // ==========================================
  // MÉTODOS AUXILIARES
  // ==========================================

  /**
   * Verifica si un email ya existe en la base de datos
   * @param email - Email a verificar
   * @param excludeId - ID de usuario a excluir (útil para edición)
   * @returns Observable<boolean> - true si existe, false si no
   */
  checkEmailExists(email: string, excludeId?: number): Observable<boolean> {
    return this.getUsers().pipe(
      map(users => {
        const emailExists = users.some(user => 
          user.email.toLowerCase() === email.toLowerCase() && 
          user.id !== excludeId
        );
        return emailExists;
      })
    );
  }

  /**
   * Busca usuarios por nombre o apellido
   * @param searchTerm - Término de búsqueda
   * @returns Observable con usuarios filtrados
   */
  searchUsers(searchTerm: string): Observable<User[]> {
    return this.users$.pipe(
      map(users => {
        const term = searchTerm.toLowerCase();
        return users.filter(user => 
          user.nombres.toLowerCase().includes(term) ||
          user.apellidos.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
        );
      })
    );
  }

  /**
   * Obtiene estadísticas básicas de usuarios
   * @returns Observable con objeto de estadísticas
   */
  getUserStats(): Observable<{ total: number; active: number; inactive: number }> {
    return this.users$.pipe(
      map(users => ({
        total: users.length,
        active: users.filter(u => u.estado === 1).length,
        inactive: users.filter(u => u.estado === 0).length
      }))
    );
  }

  // ==========================================
  // MANEJO DE ERRORES
  // ==========================================

  /**
   * Maneja errores HTTP de forma centralizada
   * @param error - Error HTTP recibido
   * @returns Observable con mensaje de error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
      console.error('Error del cliente:', error.error.message);
    } else {
      // Error del lado del servidor
      console.error(
        `Código de error del servidor: ${error.status}\n` +
        `Mensaje: ${error.message}`
      );

      // Mensajes personalizados según el código de error
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifica los datos enviados.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 409:
          errorMessage = 'El correo electrónico ya está registrado.';
          break;
        case 500:
          errorMessage = 'Error en el servidor. Intenta más tarde.';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
          break;
        default:
          errorMessage = error.error?.message || 'Error en la operación';
      }
    }

    // Retornar observable con error
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }

  // ==========================================
  // UTILIDADES
  // ==========================================

  /**
   * Limpia el caché de usuarios
   */
  clearCache(): void {
    this.usersSubject.next([]);
  }

  /**
   * Recarga la lista de usuarios
   */
  refreshUsers(): void {
    this.getUsers().subscribe();
  }
}

/**
 * ============================================
 * RESUMEN DE MÉTODOS DISPONIBLES:
 * ============================================
 * 
 * CRUD BÁSICO:
 * - getUsers()                    → Obtener todos los usuarios (ordenados A-Z)
 * - getUserById(id)               → Obtener un usuario específico
 * - createUser(user)              → Crear nuevo usuario
 * - updateUser(id, user)          → Actualizar usuario existente
 * - deleteUser(id)                → Eliminar usuario
 * 
 * MÉTODOS AUXILIARES:
 * - checkEmailExists(email)       → Verificar si email existe
 * - searchUsers(term)             → Buscar usuarios
 * - getUserStats()                → Obtener estadísticas
 * - clearCache()                  → Limpiar caché
 * - refreshUsers()                → Recargar lista
 * 
 * OBSERVABLE:
 * - users$                        → Observable para suscribirse a cambios
 * 
 * ============================================
 */