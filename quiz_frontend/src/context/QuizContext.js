import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { api } from "../services/api";
import { ws } from "../services/websocket";

const QuizContext = createContext(null);

const initialState = {
  user: null,              // { id, name }
  quizCode: null,
  status: "idle",          // idle | joining | active | finished | error
  question: null,          // { id, text, options:[], index, total }
  selectedOptionId: null,
  answers: [],             // [{ questionId, optionId, correct, timeMs }]
  leaderboard: [],         // [{ userId, name, score }]
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.user };
    case "JOIN_START":
      return { ...state, status: "joining", quizCode: action.quizCode, error: null };
    case "JOIN_SUCCESS":
      return { ...state, status: "active", question: action.question, leaderboard: action.leaderboard || [] };
    case "JOIN_ERROR":
      return { ...state, status: "error", error: action.error };
    case "QUESTION_UPDATE":
      return { ...state, question: action.question, selectedOptionId: null };
    case "SELECT_OPTION":
      return { ...state, selectedOptionId: action.optionId };
    case "ANSWER_SUBMIT":
      return { ...state, answers: [...state.answers, action.answer] };
    case "LEADERBOARD_UPDATE":
      return { ...state, leaderboard: action.leaderboard };
    case "FINISH":
      return { ...state, status: "finished" };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function QuizProvider({ children }) {
  /**
   * QuizProvider supplies quiz session state and actions.
   * It integrates with placeholder REST API (services/api) and WebSocket (services/websocket).
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  // WebSocket event handlers
  useEffect(() => {
    const offQuestion = ws.on("question", (q) => {
      dispatch({ type: "QUESTION_UPDATE", question: q });
    });
    const offLeaderboard = ws.on("leaderboard", (lb) => {
      dispatch({ type: "LEADERBOARD_UPDATE", leaderboard: lb });
    });
    const offFinish = ws.on("finish", () => {
      dispatch({ type: "FINISH" });
    });
    return () => {
      offQuestion(); offLeaderboard(); offFinish();
    };
  }, []);

  const actions = useMemo(() => ({
    // PUBLIC_INTERFACE
    setUser: (user) => dispatch({ type: "SET_USER", user }),

    // PUBLIC_INTERFACE
    joinQuiz: async (quizCode, name) => {
      dispatch({ type: "JOIN_START", quizCode });
      try {
        const joinRes = await api.joinQuiz(quizCode, name);
        dispatch({ type: "SET_USER", user: joinRes.user });
        dispatch({ type: "JOIN_SUCCESS", question: joinRes.question, leaderboard: joinRes.leaderboard });
        ws.connect(joinRes.wsToken, quizCode, joinRes.user?.id);
      } catch (e) {
        dispatch({ type: "JOIN_ERROR", error: e.message || "Failed to join" });
      }
    },

    // PUBLIC_INTERFACE
    selectOption: (optionId) => {
      dispatch({ type: "SELECT_OPTION", optionId });
    },

    // PUBLIC_INTERFACE
    submitAnswer: async () => {
      const { question, selectedOptionId, quizCode, user } = state;
      if (!question || !selectedOptionId) return;
      try {
        const res = await api.submitAnswer(quizCode, question.id, selectedOptionId, user?.id);
        dispatch({ type: "ANSWER_SUBMIT", answer: res });
      } catch (e) {
        // swallow error for now; UI will show toast via UIContext
      }
    },

    // PUBLIC_INTERFACE
    leaveQuiz: () => {
      ws.disconnect();
      dispatch({ type: "RESET" });
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [state.question, state.selectedOptionId, state.quizCode, state.user]);

  return (
    <QuizContext.Provider value={{ state, actions }}>
      {children}
    </QuizContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useQuiz() {
  /** Hook to access quiz state and actions. */
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
