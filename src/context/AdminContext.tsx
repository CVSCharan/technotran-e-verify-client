"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminContextType, AdminUser } from "@/utils/types"; // Import the AdminUser type

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(null); // Use AdminUser type
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("admin-user"); // Adjusted storage key
    if (storedUser) {
      const parsedStoredUser = JSON.parse(storedUser);
      setUser(parsedStoredUser);
    }
  }, []);

  const login = (user: AdminUser) => {
    localStorage.setItem("admin-user", JSON.stringify(user)); // Adjusted storage key
    setUser(user);
    router.push("/admin-dashboard");
  };

  const logout = () => {
    localStorage.removeItem("admin-user"); // Adjusted storage key
    setUser(null);
    setShowModal(true);
    router.push("/admin-login");
  };

  return (
    <AdminContext.Provider value={{ user, setUser, logout, login, showModal }}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAuth must be used within an AdminProvider");
  }
  return context;
};
