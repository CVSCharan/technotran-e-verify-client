"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { AdminContextType, AdminUser } from "@/utils/types"; // Import the AdminUser type

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null); // Use AdminUser type
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("admin-user"); // Adjusted storage key
    if (storedUser) {
      const parsedStoredUser = JSON.parse(storedUser);
      setAdminUser(parsedStoredUser);
    }
  }, []);

  const login = (user: AdminUser) => {
    localStorage.setItem("admin-user", JSON.stringify(user)); // Adjusted storage key
    setAdminUser(user); // Fix here: Pass `user` instead of `adminUser`
    router.push("/admin-dashboard");
  };

  const logout = () => {
    localStorage.removeItem("admin-user"); // Adjusted storage key
    setAdminUser(null);
    setShowModal(true);
    router.push("/admin-login");
  };

  // Memoize the context value
  const contextValue = useMemo(
    () => ({ adminUser, setAdminUser, logout, login, showModal }),
    [adminUser, logout, login, showModal]
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom Hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
