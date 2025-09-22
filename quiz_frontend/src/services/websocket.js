class Emitter {
  constructor() { this.map = new Map(); }
  on(event, cb) {
    const arr = this.map.get(event) || [];
    arr.push(cb);
    this.map.set(event, arr);
    return () => this.off(event, cb);
  }
  off(event, cb) {
    const arr = this.map.get(event) || [];
    this.map.set(event, arr.filter(fn => fn !== cb));
  }
  emit(event, payload) {
    (this.map.get(event) || []).forEach(fn => fn(payload));
  }
}

class WSService {
  constructor() {
    this.emitter = new Emitter();
    this.socket = null;
    this.connected = false;
    this.simTimer = null;
  }

  // PUBLIC_INTERFACE
  connect(token, quizCode, userId) {
    /**
     * Prepare WebSocket connection using provided token and quiz code.
     * In absence of a backend WS endpoint, this initializes a simulator that emits
     * question and leaderboard updates periodically.
     */
    try {
      // Placeholder for real socket:
      // this.socket = new WebSocket(`${process.env.REACT_APP_WS_URL}?token=${token}&code=${quizCode}&uid=${userId}`);
      // this.socket.onmessage = (ev) => { const msg = JSON.parse(ev.data); this.emitter.emit(msg.type, msg.payload); }
      this.connected = true;
      this.startSimulator();
    } catch (e) {
      console.error("WS connect error", e);
    }
  }

  // PUBLIC_INTERFACE
  disconnect() {
    if (this.socket) {
      try { this.socket.close(); } catch {}
      this.socket = null;
    }
    this.connected = false;
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
  }

  // PUBLIC_INTERFACE
  on(event, cb) {
    return this.emitter.on(event, cb);
  }

  startSimulator() {
    // Emit fake question update after some time and leaderboard pulses
    let qIndex = 1;
    const total = 5;
    this.simTimer = setInterval(() => {
      if (!this.connected) return;
      qIndex += 1;
      if (qIndex > total) {
        this.emitter.emit("finish");
        clearInterval(this.simTimer);
        return;
      }
      const sampleQuestion = {
        id: "q" + qIndex,
        index: qIndex,
        total,
        text: qIndex === 2
          ? "What is the chemical symbol for table salt?"
          : "Which planet is known as the Red Planet?",
        options: qIndex === 2
          ? [
              { id: "a", text: "NaCl" },
              { id: "b", text: "KCl" },
              { id: "c", text: "H2O" },
              { id: "d", text: "CO2" },
            ]
          : [
              { id: "a", text: "Venus" },
              { id: "b", text: "Mars" },
              { id: "c", text: "Jupiter" },
              { id: "d", text: "Mercury" },
            ],
      };
      this.emitter.emit("question", sampleQuestion);
      const leaderboard = [
        { userId: "demo1", name: "Avery", score: 20 + qIndex * 10 },
        { userId: "demo2", name: "Kai", score: 18 + qIndex * 8 },
      ];
      this.emitter.emit("leaderboard", leaderboard);
    }, 8000);
  }
}

// PUBLIC_INTERFACE
export const ws = new WSService();
