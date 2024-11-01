import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'app/capaPresentacion/componentes/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(data: any, callback: () => void): void{
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: data
    })

    dialogRef.afterClosed().subscribe((result: boolean | null) => {
      if(result){
        callback();
      }
    })
  }
}
