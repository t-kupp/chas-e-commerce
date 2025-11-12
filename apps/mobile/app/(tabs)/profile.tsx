import React from "react";
import { useAuth } from "../context/auth";
import LoginComponent from "../components/auth/LoginComponent";
import AccountComponent from "../components/auth/AccountComponent";

export default function ProfileScreen() {
  const { user, isLoading } = useAuth();

  // Show login component if user is not authenticated
  if (!user && !isLoading) {
    return <LoginComponent />;
  }

  // Show account component if user is authenticated
  if (user) {
    return <AccountComponent />;
  }

  // Show nothing while loading (or you could show a loading spinner)
  return null;
}
