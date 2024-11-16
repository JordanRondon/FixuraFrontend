import { Injectable } from '@angular/core';
import { Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {

  private socketClient: any = null;
  private notificationSubscription: any;
  private incidentSubscription: any;  
  private messageSubject = new Subject<string>();
  private incidentSubject = new Subject<string>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const ws = new SockJS('https://fixurabackend.onrender.com/ws');
    this.socketClient = Stomp.over(ws);

    this.socketClient.connect(
      {},
      (frame: any) => {
        console.log('Conectando a WS....', frame);

        this.notificationSubscription = this.socketClient.subscribe('/topic/notifications', (message: any) => {
            this.messageSubject.next(message.body);
          }
        );

        this.incidentSubscription = this.socketClient.subscribe('/topic/incidents', (incidencia: any) => {
          console.log('Mensaje recibido del WebSocket:', incidencia.body);
          this.incidentSubject.next(incidencia.body);  
        });
      },
      (error: any) => {
        console.error('WebSocket Error: ', error);
      }
    );
  }

  getMessage() {
    return this.messageSubject.asObservable();
  }

  getIncidentUpdates() {
    return this.incidentSubject.asObservable();
  }

  disconnect(): void {
    if (this.socketClient) {
      this.socketClient.deactivate();
      this.socketClient = null;
    }

    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }

    if (this.incidentSubscription) {
      this.incidentSubscription.unsubscribe();
    }
  }
}
