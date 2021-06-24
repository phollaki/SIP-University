import * as SocketIO from 'socket.io';

import {
    Broadcast, Emit, Input, IO, Nsp, Socket, SocketService, SocketSession
} from '@tsed/socketio';

@SocketService()
export class SipSocketService {
  @Nsp nsp: SocketIO.Namespace;

  getRefreshSignal() {
    this.nsp.emit("getrefreshsignal", "true");
  }
}
