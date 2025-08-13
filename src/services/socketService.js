import io from 'socket.io-client';
import API_BASE_URL from '../../../tuition-backend/config/api';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {};
  }

  connect(userData) {
    this.socket = io(`${API_BASE_URL}`);

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.emit('join', userData);
    });

    this.socket.on('liveClassesUpdate', (liveClasses) => {
      if (this.callbacks.liveClassesUpdate) {
        this.callbacks.liveClassesUpdate(liveClasses);
      }
    });

    this.socket.on('classStarted', (data) => {
      if (this.callbacks.classStarted) {
        this.callbacks.classStarted(data);
      }
    });

    this.socket.on('classEnded', (data) => {
      if (this.callbacks.classEnded) {
        this.callbacks.classEnded(data);
      }
    });

    this.socket.on('joinClassSuccess', (data) => {
      if (this.callbacks.joinClassSuccess) {
        this.callbacks.joinClassSuccess(data);
      }
    });

    this.socket.on('joinClassError', (data) => {
      if (this.callbacks.joinClassError) {
        this.callbacks.joinClassError(data);
      }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  startLiveClass(classData) {
    if (this.socket) {
      this.socket.emit('startLiveClass', classData);
    }
  }

  endLiveClass(classId) {
    if (this.socket) {
      this.socket.emit('endLiveClass', classId);
    }
  }

  joinLiveClass(classData) {
    if (this.socket) {
      this.socket.emit('joinLiveClass', classData);
    }
  }
}

export default new SocketService();
