// src/components/AdminRoute.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchCurrentUser } from "../store/auth/actions";

const AdminRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isAuthLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (!user && isAuthLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, isAuthLoading]);

  if (isAuthLoading) return <div>Loading...</div>;

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminRoute;
