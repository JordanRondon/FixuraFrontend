import { Component, OnChanges, OnInit, signal, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { InfoIncidente } from '../../../Model/InfoIncidente';
import { CommonModule } from '@angular/common';
import { PostIncidenciaComponent } from "../post-incidencia/post-incidencia.component";
import { DialogService } from 'app/Service/Dialog/dialog.service';
import { AuthService } from '../../../Auth/CookiesConfig/AuthService';
import { IncidenciaConsolidadoService } from 'app/Service/IncidenciaConsolidado/incidencia-consolidado.service';
import { IncidenciaConsolidado } from 'app/Model/IncidenciaConsolidado';

@Component({
  selector: 'app-expansion-panel',
  standalone: true,
  imports: [MatExpansionModule, CommonModule, PostIncidenciaComponent],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpansionPanelComponent{

  readonly panelOpenState = signal(false);

  @Input() infoIncidente: InfoIncidente | undefined;
  @Input() listDistritoCoordenadas: { id_coordenada: number, latitud: number, longitud: number }[] = [];
  infoIncidenteCopy: InfoIncidente | undefined;
  isActive: boolean = false;
  selectedImage: string = '';
  isModalActive: boolean = false;

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private incConsolidadoService: IncidenciaConsolidadoService,
  ){}
  
  openImageModal(image: string): void {
    this.selectedImage = image;
    this.isModalActive = true;
  }

  closeImageModal(): void {
    this.isModalActive = false;
  }

  openDialog(id_incidencia: number): void {
    this.dialogService?.openDialog(
      {
        tipo: 'Agregar Consolidado',
        titulo: '¿Estás seguro de consolidar esta incidencia?',
      },
      () => this.saveConsolidadoIncidencia(id_incidencia)
    );
  }

  saveConsolidadoIncidencia(id_incidencia: number): void {
    const incidenciaConsolidado = new IncidenciaConsolidado(
      this.authService.getToken_dni() ?? '',
      id_incidencia,
      new Date()
    );

    this.incConsolidadoService
      .insertIncidenciaConsolidado(incidenciaConsolidado)
      .subscribe({
        error: (error) => {
          console.error('Error al obtener a los usuarios:', error);
        },
      });
  }

  formatearFecha(fecha?: Date): string {
    if (fecha)
      return format(fecha, "d 'de' MMMM 'del' yyyy, 'a las' hh:mm a", {
        locale: es,
      });
    else return 'Sin Información';
  }
}