import { RegisteredPanelistCount } from '@/app/core/models/panelist.model';
import { WebsocketService } from '@/app/core/services/ws.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PanelistWebsocket extends WebsocketService<
  undefined,
  RegisteredPanelistCount[]
> {
  connect() {
    super.connectWebsocket('/panelists/registered-count');
  }

  disconnect() {
    super.disconnectWebsocket();
  }
}
