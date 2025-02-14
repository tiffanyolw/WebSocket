import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './service/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'websocket-ui';
  messages: any[] = [];
  private messageSubscription!: Subscription

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.messageSubscription = this.webSocketService.getMessages().subscribe(
      message => {
        console.log(JSON.stringify(message))
        this.messages.push(message);
      }
    );
  }

  sendMessage(): void {
    const message = { source: 'client', content: 'request to server' };
    this.webSocketService.sendMessage(message);
    this.messages.push(message);
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.webSocketService.closeConnection();
  }
}
