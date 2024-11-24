import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DepartamentoService} from '../../../Service/Departamento/departamento.service';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { FormControl, FormGroup, Validators} from '@angular/forms';
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

  passwordChecked = {
    hasNumber : false,
    hasUpperCase : false,
    hasLowerCase: false,
    hasSpecialChar: false,
  }

  formUsuario: FormGroup = new FormGroup({})

  constructor(
    private departamentoService : DepartamentoService,
    private registroUsuariosService : UsuariosService
  ){}

  ngOnInit(): void {
    
    this.formUsuario = new FormGroup({
      dni: new FormControl(''),
      correo: new FormControl(''),
      contrasenia : new FormControl('', Validators.required),
      confirmarContrasenia: new FormControl('', Validators.required),
      fotoPerfil: new FormControl(null),
      tiempo_ban: new FormControl(null),
      id_rol: new FormControl(3),
      id_distrito: new FormControl(this.selectedDistrito),
    },{ validators: this.matchPasswordValidator()});

    this.loadDepartamentos();
  }
  
  registrarUsuario(){
    
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

    if(
      !this.passwordChecked.hasNumber &&
      !this.passwordChecked.hasUpperCase &&
      !this.passwordChecked.hasLowerCase &&
      !this.passwordChecked.hasSpecialChar
    ){
      alert('La contraseña no es segura');
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
        if (target.style.color !== '#000') {
          target.style.color = '#000';
        }
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
        target.style.color = '#000'
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
      target.style.color = '#000'
    }
  }


  //Validador personalizado para verificar si las contraseñas coinciden
  matchPasswordValidator(): ValidatorFn {
    return (formGroup: AbstractControl) : ValidationErrors | null =>{
      const password = formGroup.get('contrasenia');
      const confirmPassword = formGroup.get('confirmarContrasenia');

      if(!password || !confirmPassword){
        return null;
      }

      return password.value === confirmPassword.value 
        ? null 
        : {mismatch: true};
    };
  }

  //FUNCION QUE PERMITE DIGITAR SOLO NUMEROS
  onDniInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, '');
  }

  //FUNCION PARA VERIFICAR ROBUSTES DE LA CONTRASEÑA
  onPasswordInput(password : string) : void{
    this.passwordChecked.hasNumber = /\d/.test(password);
    this.passwordChecked.hasUpperCase = /[A-Z]/.test(password);
    this.passwordChecked.hasLowerCase = /[a-z]/.test(password);
    this.passwordChecked.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  //FUNCION PARA CAMBIAR EL COLOR DEL LABEL EN BASE A LAS CONDICIONES
  getLabelColor(condition: boolean) : string {
    return condition ? 'green' : 'red';
  }


}
