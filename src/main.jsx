import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { useAuth } from "@/hooks/useAuth";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Logout Button Component
const LogoutButton = () => {
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLogout}
      className="ml-2"
      title={`Signed in as ${user?.name || user?.email}`}
    >
      <ApperIcon name="LogOut" size={16} className="mr-2" />
      Logout
    </Button>
  );
};