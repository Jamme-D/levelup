import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";

export const ProtectedRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, loading } = useSession();
  const loc = useLocation();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) {
    return <Navigate to="/auth" replace state={{ from: loc }} />;
  }
  return <>{children}</>;
};
