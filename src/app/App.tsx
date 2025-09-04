import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import PublicLayout from "@/components/PublicLayout";

const Home = lazy(() => import("@/pages/Home"));
const Today = lazy(() => import("@/pages/Today"));
const JournalEditor = lazy(() => import("@/pages/JournalEditor"));
const Progress = lazy(() => import("@/pages/Progress"));
const AuthPage = lazy(() => import("@/pages/Auth"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Loading…</div>}>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>

          {/* Auth page (public) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* App (protected) */}
          <Route path="/app" element={<Layout />}>
            <Route
              index
              element={<ProtectedRoute><Today /></ProtectedRoute>}
            />
            <Route
              path="journal/:day"
              element={<ProtectedRoute><JournalEditor /></ProtectedRoute>}
            />
            <Route
              path="progress"
              element={<ProtectedRoute><Progress /></ProtectedRoute>}
            />
          </Route>

          <Route path="*" element={<div className="p-6">Not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
