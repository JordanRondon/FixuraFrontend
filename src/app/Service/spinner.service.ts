import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy(){
    this.busyCount++;
    this.spinnerService;
    this.spinnerService.show(undefined, 
      {
      type: 'ball-scale-ripple',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      size: 'default',
      color: '#5995fd',
      }
    )
  }

  idle(){
    this.busyCount--;
    if(this.busyCount <= 0){
      this.busyCount = 0;
      this.spinnerService.hide();
    }
  }
}
