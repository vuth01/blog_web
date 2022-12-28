import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }: any) => {
  const token = sessionStorage.getItem("userToken");
  return token ? children : <Navigate to="/login" />;
};
