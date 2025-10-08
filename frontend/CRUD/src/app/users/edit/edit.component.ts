import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../../shared/alert/alert.component";

@Component({
    selector: 'app-edit',
    imports: [CommonModule, AlertComponent, ReactiveFormsModule, RouterLink],
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],

})
export class EditComponent implements OnInit {
    userForm!: FormGroup;
    userId!: number;
    isSubmitting = false;
    showAlert = false;
    alertMessage = '';
    alertType: 'success' | 'error' | 'info' = 'info';

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userId = Number(this.route.snapshot.paramMap.get('id'));
        this.initForm();
        this.loadUser();
    }

    private initForm(): void {
        this.userForm = this.fb.group({
            nombres: ['', [Validators.required, Validators.minLength(2)]],
            apellidos: ['', [Validators.required, Validators.minLength(2)]],
            telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    private loadUser(): void {
        this.userService.getUserById(this.userId).subscribe({
            next: (user) => this.userForm.patchValue(user),
            error: () => this.showCustomAlert('Error al cargar el usuario.', 'error')
        });
    }

    hasError(control: string): boolean {
        const field = this.userForm.get(control);
        return !!field && field.invalid && (field.dirty || field.touched);
    }

    getErrorMessage(control: string): string {
        const field = this.userForm.get(control);
        if (!field) return '';
        if (field.hasError('required')) return 'Campo obligatorio';
        if (field.hasError('email')) return 'Correo inválido';
        if (field.hasError('pattern')) return 'Formato inválido';
        if (field.hasError('minlength')) return 'Demasiado corto';
        return '';
    }

    onSubmit(): void {
        if (this.userForm.invalid) return;
        this.isSubmitting = true;

        const updatedUser = { id: this.userId, ...this.userForm.value };

        this.userService.updateUser(this.userId, updatedUser).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.showCustomAlert('Usuario actualizado exitosamente', 'success');
                setTimeout(() => this.router.navigate(['/users']), 1500);
            },
            error: () => {
                this.isSubmitting = false;
                this.showCustomAlert('Error al actualizar el usuario', 'error');
            }
        });
    }

    private showCustomAlert(message: string, type: 'success' | 'error' | 'info') {
        this.alertMessage = message;
        this.alertType = type;
        this.showAlert = true;
    }

    closeAlert() {
        this.showAlert = false;
    }
}
