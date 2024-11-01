import { Component, model, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuarioBlock } from '../../../Model/UsuarioBlock';
import { AdminModeratorDirective } from '../../../Auth/Directive/admin-moderator.directive';
import { DatepickerDialogComponent } from '../datepicker-dialog/datepicker-dialog.component';
import { UsuariosService } from '../../../Service/Usuarios/usuarios.service';
import { DialogService } from 'app/Service/Dialog/dialog.service';

@Component({
  selector: 'app-block-users',
  standalone: true,
  imports: [
    AdminModeratorDirective,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    CommonModule,
    MatMenu,
  ],
  templateUrl: './block-users.component.html',
  styleUrl: './block-users.component.css',
})
export class BlockUsersComponent implements OnInit {
  @Input() usuario: UsuarioBlock | undefined;
  isBanned: boolean | null = null;

  constructor(
    private userService: UsuariosService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.usuario) {
      this.userService
        .getBanStaus(this.usuario.dni)
        .subscribe((response: boolean) => {
          console.log(response);
          this.isBanned = response;
        });
    }
  }

  banTemporal(): void {
    const dialogRef = this.dialog.open(DatepickerDialogComponent, {
      minWidth: '400px',
      data: { selectedDate: null },
    });

    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result && this.usuario) {
        console.log(result);
        this.userService
          .banUser(this.usuario.dni, false, result)
          .subscribe((response) => {
            console.log(
              'Usuario bloqueado temporalmente hasta',
              result,
              response
            );
          });
        this.isBanned = true;
      }
    });
  }

  banPermanent(): void {
    if (this.usuario) {
      this.userService
        .banUser(this.usuario.dni, true, '')
        .subscribe((response) => {
          console.log('Usuario baneado correctamente', response);
        });
      this.isBanned = true;
    } else {
      console.error('No se puede banear, usuario o DNI no están definidos');
    }
  }

  openDialogBan(): void {
    this.dialogService.openDialog(
      {
        tipo: 'Banear Usuario',
        titulo: '¿Estás seguro de banear a este usuario de manera permanente?',
      },
      () => this.banPermanent()
    );
  }

  desbanUser(): void {
    if (this.usuario) {
      this.userService.unbanUser(this.usuario.dni).subscribe((response) => {
        console.log('Usuario desbaneado correctamente', response);
      });
      this.isBanned = false;
    } else {
      console.error('No se puede desbanear, usuario o DNI no están definidos');
    }
  }

  openDialogDesban(): void {
    this.dialogService.openDialog(
      {
        tipo: 'Desbanear Usuario',
        titulo: '¿Estás seguro de desbanear a este usuario?',
      },
      () => this.desbanUser()
    );
  }
}
