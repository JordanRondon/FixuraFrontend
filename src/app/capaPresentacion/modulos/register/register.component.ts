import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartamentoServiceService} from '../../../Service/departamento-service.service';
import { RegistroUsuariosService } from '../../../Service/registro-usuarios.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent implements OnInit{

  listDepartamento: { idDepart: number, nameDepart: string }[] = [];
  listProvincia: {idProv : number, nameProv: string, idDepart: number}[] = [];
  listDistrito: {idDist: number, nameDist: string, idProv: number, idDepart: number}[] = [];

  selectedDepartamento: number | null = null;
  selectedProvincia: number | null = null;
  selectedDistrito: number | null = null;

  formUsuario: FormGroup = new FormGroup({})

  constructor(
    private departamentoService : DepartamentoServiceService,
    private registroUsuariosService : RegistroUsuariosService
  ){}

  ngOnInit(): void {
    this.loadDepartamentos()
    this.formUsuario = new FormGroup({
      nombre : new FormControl(''),
      dni: new FormControl(''),
      correo: new FormControl(''),
      contrasenia : new FormControl(''),
      confirmarContrasenia: new FormControl(''),
      fotoPerfil: new FormControl(null),
      tiempo_ban: new FormControl(null),
      id_rol: new FormControl(3),
      idDist: new FormControl(this.selectedDistrito),
    })
  }
  
  saveUsuario(){
    const { contrasenia, confirmarContrasenia } = this.formUsuario.value;

    // Verificar si las contraseñas coinciden
    if (contrasenia !== confirmarContrasenia) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Verificar si el formulario es válido
    if (this.formUsuario.invalid) {
      alert('Por favor, complete todos los campos correctamente');
      return;
    }

    this.formUsuario.controls['fotoPerfil'].setValue(null);
    this.formUsuario.controls['tiempo_ban'].setValue(null);
    this.formUsuario.controls['id_rol'].setValue(3);
    this.formUsuario.controls['idDist'].setValue(this.selectedDistrito);

    this.registroUsuariosService.saveUsuario(this.formUsuario.value).subscribe(res =>{
      if(res){
        this.formUsuario.reset();
      }
    })
  }

  // SE CARGA LOS DEPARTAMENTOS
  loadDepartamentos(){
    this.departamentoService.getDepartamento().subscribe(resp => {
        console.log(resp);
        if(resp){
          this.listDepartamento = resp;
        }
    });
  }

  // SE ACTUALIZA LAS PROVINCIAS EN CASO QUE SE ELIJE UN DEPARTAMENTO
  onDepartamentoChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    const idDepart = Number(target.value)
    if (!isNaN(idDepart)) {
      this.selectedDepartamento = idDepart;
      if (this.selectedDepartamento !== null) {
        this.loadProvincias(idDepart);
        this.listDistrito = [];
        this.selectedProvincia = null;
      }
    }
  }

  // SE CARGA LAS PROVINCIAS
  loadProvincias(idDepart: number): void {
    this.departamentoService.getProvincia(idDepart).subscribe(resp => {
      if (resp) {
        this.listProvincia = resp;
      }
    });
  }

  onProvinciaChange(event : Event): void {
    const target = event.target as HTMLSelectElement;
    const idProv = Number(target.value);
    if (!isNaN(idProv)) {
      this.selectedProvincia = idProv;
      if (this.selectedDepartamento !== null) {
        this.loadDistritos(this.selectedDepartamento, idProv);
      }
    }
  }

  // SE CARGA LOS DISTRITOS
  loadDistritos(idDepart: number, idProv: number): void {
    this.departamentoService.getDistrito(idDepart, idProv).subscribe(resp => {
      if (resp) {
        this.listDistrito = resp;
      }
    });
  }

  onDistritoChange(event : Event): void{
    const target = event.target as HTMLSelectElement;
    const idDist = Number(target.value);
    if(!isNaN(idDist)){
      this.selectedDistrito = idDist;
    }
  }

}
