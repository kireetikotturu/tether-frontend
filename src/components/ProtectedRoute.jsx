import React, { useContext } from "react";
import { UserContext } from "../UserContext";

export default function ProtectedRoute({ adminOnly = false, children }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div className="text-center py-8">Please log in to access this page.</div>;
  }
  if (adminOnly && !user.isAdmin) {
    return <div className="text-center py-8">Admin access only.</div>;
  }
  return children;
}