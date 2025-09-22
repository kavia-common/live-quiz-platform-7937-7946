const BASE_URL = process.env.REACT_APP_API_BASE_URL || ""; // leave empty to use same origin proxy or dev server
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Mock helpers for placeholder behavior when backend is unavailable
async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // Fallback mock for local demo
    if (url.includes("/join")) {
      await delay(600);
      const params = JSON.parse(options.body);
      const sampleQuestion = {
        id: "q1",
        index: 1,
        total: 5,
        text: "Which ocean is the largest by surface area?",
        options: [
          { id: "a", text: "Atlantic Ocean" },
          { id: "b", text: "Indian Ocean" },
          { id: "c", text: "Pacific Ocean" },
          { id: "d", text: "Arctic Ocean" },
        ],
      };
      return {
        ok: true,
        user: { id: "u_" + Math.random().toString(36).slice(2), name: params.name },
        question: sampleQuestion,
        leaderboard: [
          { userId: "demo1", name: "Avery", score: 20 },
          { userId: "demo2", name: "Kai", score: 18 },
        ],
        wsToken: "mocktoken",
      };
    }
    if (url.includes("/answer")) {
      await delay(400);
      const correct = Math.random() > 0.3;
      return { ok: true, correct, timeMs: 1345 };
    }
    if (url.includes("/leaderboard")) {
      await delay(300);
      return {
        ok: true,
        leaderboard: [
          { userId: "demo1", name: "Avery", score: 40 },
          { userId: "demo2", name: "Kai", score: 38 },
        ]
      };
    }
    // bubble real error when not mockable
    throw e;
  }
}

// PUBLIC_INTERFACE
export const api = {
  /**
   * Join a quiz by code and name.
   * Returns { user, question, leaderboard, wsToken }
   */
  async joinQuiz(code, name) {
    const url = `${BASE_URL}/api/quiz/${encodeURIComponent(code)}/join`;
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Submit answer for a question.
   * Returns { correct, timeMs }
   */
  async submitAnswer(code, questionId, optionId, userId) {
    const url = `${BASE_URL}/api/quiz/${encodeURIComponent(code)}/answer`;
    return await safeFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, optionId, userId }),
    });
  },

  /**
   * Get current leaderboard.
   * Returns { leaderboard }
   */
  async getLeaderboard(code) {
    const url = `${BASE_URL}/api/quiz/${encodeURIComponent(code)}/leaderboard`;
    return await safeFetch(url, { method: "GET" });
  }
};
