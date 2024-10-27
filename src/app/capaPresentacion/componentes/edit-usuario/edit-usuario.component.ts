import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../Model/Usuario';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { DepartamentoService } from '../../../Service/Departamento/departamento.service';
import { ImagenService } from '../../../Service/Imagen/imagen.service';

@Component({
  selector: 'app-edit-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-usuario.component.html',
  styleUrl: './edit-usuario.component.css',
})
export default class EditUsuarioComponent {
  profilePicture: string =
    'https://raw.githubusercontent.com/KevinGM02/Galeria-Imagenes-Fixura/main/perfil/perfil_default.png'; // URL de imagen por defecto
  showFormEdit: boolean = false;
  dataUsuario: Usuario | null = null;
  editUsuario: Usuario | null = null;

  listDepartamento: { id_departamento: number; nombre: string }[] = [];
  listProvincia: {
    id_provincia: number;
    nombre: string;
    id_departamento: number;
  }[] = [];
  listDistrito: {
    id_distrito: number;
    nombre: string;
    id_provincia: number;
  }[] = [];

  selectedDepartamento: number | null = null;
  selectedProvincia: number | null = null;
  selectedDistrito: number | null = null;
  archivoSeleccionado: File | null = null;

  // Método para manejar la selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      this.archivoSeleccionado = input.files[0];
      if (this.editUsuario) {
        this.editUsuario.fotoPerfil =
          'https://raw.githubusercontent.com/KevinGM02/Galeria-Imagenes-Fixura/main/imagenes/' +
          this.archivoSeleccionado.name;
      }
      console.log('Nombre del archivo:' + this.archivoSeleccionado.name);

      // Lee el archivo como una URL de datos
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result; // Actualiza la URL de la imagen de perfil
      };

      reader.readAsDataURL(file); // Convierte la imagen a URL de datos
    }
  }

  constructor(
    private UserService: UsuariosService,
    private departamentoService: DepartamentoService,
    private imagenService: ImagenService
  ) {}

  ngOnInit(): void {
    this.getDataUserProfile();
    this.loadDepartamentos();
  }

  // Método para obtener el perfil del usuario
  getDataUserProfile(): void {
    this.UserService.getUserProfile().subscribe({
      next: (user: Usuario) => {
        this.dataUsuario = user; // Almacenar los datos del usuario
        this.editUsuario = this.dataUsuario;
        this.profilePicture = user.fotoPerfil; // Cargar la foto de perfil
        if (this.editUsuario) {
          this.editUsuario.dni = user.dni;
        }
        console.log('Datos del usuario: ', this.dataUsuario);
      },
      error: (error) => {
        console.error('Error al obtener el perfil de usuario', error);
      },
    });
  }

  // SE CARGA LOS DEPARTAMENTOS
  loadDepartamentos() {
    this.departamentoService.getDepartamento().subscribe((resp) => {
      if (resp) {
        this.listDepartamento = resp;
      }
    });
  }

  // SE CARGA LAS PROVINCIAS
  loadProvincias(id_departamento: number): void {
    this.departamentoService.getProvincia(id_departamento).subscribe((resp) => {
      if (resp) {
        this.listProvincia = resp;
      }
    });
  }

  // SE CARGA LOS DISTRITOS
  loadDistritos(id_departamento: number, id_provincia: number): void {
    this.departamentoService
      .getDistrito(id_departamento, id_provincia)
      .subscribe((resp) => {
        if (resp) {
          this.listDistrito = resp;
        }
      });
  }

  // SE ACTUALIZA LAS PROVINCIAS EN CASO QUE SE ELIJE UN DEPARTAMENTO
  onDepartamentoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id_departamento = Number(target.value);
    if (!isNaN(id_departamento)) {
      this.selectedDepartamento = id_departamento;
      this.loadProvincias(id_departamento);
      this.listDistrito = []; // Limpiar lista de distritos
      this.selectedProvincia = null; // Reiniciar selección de provincia
    }
  }

  onProvinciaChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id_provincia = Number(target.value);
    if (!isNaN(id_provincia)) {
      this.selectedProvincia = id_provincia;
      this.loadDistritos(this.selectedDepartamento!, id_provincia);
    }
  }

  onDistritoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const id_distrito = Number(target.value);
    if (!isNaN(id_distrito)) {
      this.selectedDistrito = id_distrito;
      if (this.editUsuario) {
        this.editUsuario.idDist = id_distrito;
      }
      console.log('id distrito: ' + this.selectedDistrito);
    }
  }

  onSubmit() {
    console.log('boton funciona correctamente');
    if (this.archivoSeleccionado) {
      const formData = new FormData();
      formData.append('file', this.archivoSeleccionado);
      const formUsuario = new FormData();
      this.imagenService.saveImagenIncidencia(formData).subscribe((resp) => {
        if (resp) {
          console.log('Imagen subida exitosamente');
          if (
            this.dataUsuario &&
            this.archivoSeleccionado &&
            this.selectedDistrito
          ) {
            formUsuario.append('dni', this.dataUsuario.dni);
            formUsuario.append(
              'foto_perfil',
              'https://raw.githubusercontent.com/KevinGM02/Galeria-Imagenes-Fixura/main/imagenes/' +
                this.archivoSeleccionado.name
            );
            formUsuario.append('id_distrito', this.selectedDistrito.toString());
            console.log('dni: ' + this.dataUsuario.dni);
            console.log('foto_perfil: ' + this.archivoSeleccionado.name);
            console.log('id_distrito: ' + this.selectedDistrito.toString());
          }

          if (this.editUsuario) {
            this.UserService.updatePerfilUsuario(formUsuario).subscribe(
              (response) => {
                console.log('Usuario actualizado correctamente:', response);
              }
            );
          } else {
            console.log('Error al encontrar edit usuario');
          }
        } else {
          console.error('Error al subir la imagen');
        }
      });
    }
  }
}
