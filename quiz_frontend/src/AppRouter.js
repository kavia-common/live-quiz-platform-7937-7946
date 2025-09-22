import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import JoinQuiz from "./pages/JoinQuiz";
import QuizRoom from "./pages/QuizRoom";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import { QuizProvider } from "./context/QuizContext";
import { UIProvider } from "./context/UIContext";

// PUBLIC_INTERFACE
export default function AppRouter() {
  /**
   * AppRouter sets up BrowserRouter, global providers, and routes for the app.
   * Routes:
   * - /            -> Home
   * - /join        -> JoinQuiz
   * - /quiz/:code  -> QuizRoom
   * - /results     -> Results
   */
  return (
    <BrowserRouter>
      <UIProvider>
        <QuizProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<JoinQuiz />} />
              <Route path="/quiz/:code" element={<QuizRoom />} />
              <Route path="/results" element={<Results />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </QuizProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
