import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AdminDashboard = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get("/admin/dashboard", {
          withCredentials: true,
        });
        setMessage(res.data.message);
      } catch (err) {
        setMessage("Failed to fetch dashboard");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="bg-black">
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
