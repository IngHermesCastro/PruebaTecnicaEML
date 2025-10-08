import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertComponent } from '../../shared/alert/alert.component';
import { UserService } from '../user.service';

@Component({
    selector: 'app-create',
    imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {

    userForm!: FormGroup;
    isSubmitting = false;
    showAlert = false;
    alertMessage = '';
    alertType: 'success' | 'error' | 'warning' = 'success';

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    /**
     * Inicializa el formulario reactivo con validaciones
     */
    initForm(): void {
        this.userForm = this.fb.group({
            nombres: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios
            ]],
            apellidos: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
            ]],
            email: ['', [
                Validators.required,
                Validators.email,
                Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
            ]],
            telefono: ['', [
                Validators.required,
                Validators.pattern(/^[0-9]{7,15}$/), // Solo números, 7-15 dígitos
                Validators.minLength(7),
                Validators.maxLength(15)
            ]]
        });
    }

    /**
     * Verifica si un campo tiene errores y ha sido tocado
     */
    hasError(field: string): boolean {
        const control = this.userForm.get(field);
        return !!(control && control.invalid && (control.dirty || control.touched));
    }

    /**
     * Obtiene el mensaje de error específico para un campo
     */
    getErrorMessage(field: string): string {
        const control = this.userForm.get(field);

        if (!control || !control.errors) return '';

        const errors = control.errors;

        if (errors['required']) return `El campo es obligatorio`;
        if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
        if (errors['email']) return `Email inválido`;
        if (errors['pattern']) {
            if (field === 'nombres' || field === 'apellidos') {
                return 'Solo se permiten letras y espacios';
            }
            if (field === 'telefono') {
                return 'Solo números, entre 7 y 15 dígitos';
            }
            if (field === 'email') {
                return 'Formato de email inválido';
            }
        }

        return 'Campo inválido';
    }

    /**
     * Envía el formulario si es válido
     */
    onSubmit(): void {
        // Marcar todos los campos como tocados para mostrar errores
        if (this.userForm.invalid) {
            Object.keys(this.userForm.controls).forEach(key => {
                this.userForm.get(key)?.markAsTouched();
            });
            this.showAlertMessage('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        this.isSubmitting = true;

        // Enviar datos al servicio
        this.userService.createUser(this.userForm.value).subscribe({
            next: (response) => {
                this.showAlertMessage('Usuario creado exitosamente', 'success');
                // Redirigir a la lista después de 1.5 segundos
                setTimeout(() => {
                    this.router.navigate(['/users']);
                }, 1500);
            },
            error: (error) => {
                this.isSubmitting = false;
                const errorMsg = error.error?.message || 'Error al crear el usuario. Intenta nuevamente.';
                this.showAlertMessage(errorMsg, 'error');
            },
            complete: () => {
                this.isSubmitting = false;
            }
        });
    }

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

    /**
     * Resetea el formulario
     */
    resetForm(): void {
        this.userForm.reset();
        Object.keys(this.userForm.controls).forEach(key => {
            this.userForm.get(key)?.setErrors(null);
        });
    }
}