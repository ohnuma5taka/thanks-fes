import { FesStep } from '@/app/core/models/step.model';
import { WebsocketService } from '@/app/core/services/ws.service';
import { Injectable } from '@angular/core';

@Injectable()
export class StepWebsocket extends WebsocketService<FesStep, FesStep> {
  connect() {
    super.connectWebsocket('/step');
  }

  send(data: FesStep) {
    this.submitWebsocket(data);
  }

  disconnect() {
    super.disconnectWebsocket();
  }
}
