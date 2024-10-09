import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartamentoService} from '../../../Service/Departamento/departamento.service';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent implements OnInit{

  listDepartamento: { id_departamento: number, nombre: string }[] = [];
  listProvincia: {id_provincia : number, nombre: string, id_departamento: number}[] = [];
  listDistrito: {id_distrito: number, nombre: string, id_provincia: number}[] = [];

  selectedDepartamento: number | null = null;
  selectedProvincia: number | null = null;
  selectedDistrito: number | null = null;

  formUsuario: FormGroup = new FormGroup({})

  constructor(
    private departamentoService : DepartamentoService,
    private registroUsuariosService : UsuariosService
  ){}

  ngOnInit(): void {
    this.loadDepartamentos()
    this.formUsuario = new FormGroup({
      dni: new FormControl(''),
      correo: new FormControl(''),
      contrasenia : new FormControl(''),
      confirmarContrasenia: new FormControl(''),
      fotoPerfil: new FormControl(null),
      tiempo_ban: new FormControl(null),
      id_rol: new FormControl(3),
      id_distrito: new FormControl(this.selectedDistrito),
    })
  }
  
  registrarUsuario(){
    const { contrasenia, confirmarContrasenia } = this.formUsuario.value;

    // Verificar si las contraseñas coinciden
    if (contrasenia !== confirmarContrasenia) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Verificar si el formulario es válido
    const formValues = this.formUsuario.value;
    if (
      !formValues.dni ||
      !formValues.correo ||
      !formValues.contrasenia ||
      !formValues.confirmarContrasenia ||
      this.selectedDepartamento === null ||
      this.selectedProvincia === null ||
      this.selectedDistrito === null
    ) {
      alert('Por favor, complete todos los campos correctamente');
      return;
    }
    
    this.formUsuario.controls['fotoPerfil'].setValue(null);
    this.formUsuario.controls['tiempo_ban'].setValue(null);
    this.formUsuario.controls['id_rol'].setValue(3);
    this.formUsuario.controls['id_distrito'].setValue(this.selectedDistrito);

    this.registroUsuariosService.registrarUsuario(this.formUsuario.value).subscribe({
      next: () => {
        alert('Usuario registrado exitosamente!');
        this.formUsuario.reset();
        this.selectedDepartamento = null;
        this.selectedProvincia = null;
        this.selectedDistrito = null;
        this.listProvincia = [];
        this.listDistrito = [];
      }
    });
  }

  // SE CARGA LOS DEPARTAMENTOS
  loadDepartamentos(){
    this.departamentoService.getDepartamento().subscribe(resp => {
        if(resp){
          this.listDepartamento = resp;
        }
    });
  }

  // SE ACTUALIZA LAS PROVINCIAS EN CASO QUE SE ELIJE UN DEPARTAMENTO
  onDepartamentoChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    const id_departamento = Number(target.value)
    if (!isNaN(id_departamento)) {
      this.selectedDepartamento = id_departamento;
      if (this.selectedDepartamento !== null) {
        this.loadProvincias(id_departamento);
        this.listDistrito = [];
        this.selectedProvincia = null;
      }
    }
  }

  // SE CARGA LAS PROVINCIAS
  loadProvincias(id_departamento: number): void {
    this.departamentoService.getProvincia(id_departamento).subscribe(resp => {
      if (resp) {
        this.listProvincia = resp;
      }
    });
  }

  onProvinciaChange(event : Event): void {
    const target = event.target as HTMLSelectElement;
    const id_provincia = Number(target.value);
    if (!isNaN(id_provincia)) {
      this.selectedProvincia = id_provincia;
      if (this.selectedDepartamento !== null) {
        this.loadDistritos(this.selectedDepartamento, id_provincia);
      }
    }
  }

  // SE CARGA LOS DISTRITOS
  loadDistritos(id_departamento: number, id_provincia: number): void {
    this.departamentoService.getDistrito(id_departamento, id_provincia).subscribe(resp => {
      if (resp) {
        this.listDistrito = resp;
      }
    });
  }

  onDistritoChange(event : Event): void{
    const target = event.target as HTMLSelectElement;
    const id_distrito = Number(target.value);
    if(!isNaN(id_distrito)){
      this.selectedDistrito = id_distrito;
    }
  }

  //FUNCION QUE PERMITE DIGITAR SOLO NUMEROS
  onDniInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
  }
}
