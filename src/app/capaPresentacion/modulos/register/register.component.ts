import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartamentoServiceService} from '../../../Service/departamento-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export default class RegisterComponent implements OnInit{

  listDepartamento: { idDepart: number, nameDepart: string }[] = [];
  listProvincia: {idProv : number, nameProv: string, idDepart: number}[] = [];
  listDistrito: {idDist: number, nameDist: string, idProv: number, idDepart: number}[] = [];

  selectedDepartamento: number | null = null;
  selectedProvincia: number | null = null;

  constructor(private departamentoService : DepartamentoServiceService){}

  ngOnInit(): void {
    this.loadDepartamentos()
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
    const target = event.target as HTMLSelectElement
    const idProv = Number(target.value)
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
}
