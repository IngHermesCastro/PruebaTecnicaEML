export interface User {
  id: number;                    // ID autoincremental (PRIMARY KEY)
  nombres: string;               // Nombres del usuario
  apellidos: string;             // Apellidos del usuario
  email: string;                 // Correo electrónico (UNIQUE)
  telefono: string;              // Número de teléfono
  fecha_registro: string;        // Fecha de creación (TIMESTAMP automático)
  fecha_modificacion: string;    // Fecha de última modificación (TIMESTAMP automático)
  estado?: number;               // Estado: 1 = activo, 0 = inactivo (OPCIONAL - valor agregado)
}

export type CreateUserDto = Omit<User, 'id' | 'fecha_registro' | 'fecha_modificacion'>;


export type UpdateUserDto = Partial<Omit<User, 'id' | 'fecha_registro'>> & {
  email: string; // Email es obligatorio
};

/**
 * Interface para la respuesta del servidor
 */
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}