import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from './service/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'websocket-ui';
  cols: string[] = []

  messages: any[] = [];
  private messageSubscription!: Subscription

  constructor(private webSocketService: WebsocketService) {}

  private get_cols(message: any) {
    let columns: string[] = [];
    for (let [key, value] of Object.entries(message)) {
      columns.push(key);
    }
    return columns;
  }

  get_value(obj: any, key: any) {
    return obj[key];
  }

  ngOnInit(): void {
    this.messageSubscription = this.webSocketService.getMessages().subscribe(
      message => {
        this.cols = this.get_cols(message);
        var index = this.messages.findIndex((i: any) => i['item'] == message['item']);
        if (index < 0) {
          this.messages.push(message);
        } else {
          this.messages[index] = message;
        }
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
