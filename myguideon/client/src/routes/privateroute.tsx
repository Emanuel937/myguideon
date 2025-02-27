import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {

  // If not authenticated, redirect to login
  if (!localStorage.getItem('userId')) {
   return <Navigate to="/admin/login" />; // Redirect to login page
  }
  return <>{element}</>; // Render the protected element if authenticated
};

export default PrivateRoute;
