import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket} from 'rxjs/webSocket'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  sendMessage(message: any) {
    this.socket$.next(message);
  }

  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  closeConnection() {
    this.socket$.complete();
  }
}
