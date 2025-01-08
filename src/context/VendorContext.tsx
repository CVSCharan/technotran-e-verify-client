"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VendorContextType, VendorUser } from "@/utils/types"; // Import the AdminUser type

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<VendorUser | null>(null); // Use AdminUser type
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("vendor-user"); // Adjusted storage key
    if (storedUser) {
      const parsedStoredUser = JSON.parse(storedUser);
      setUser(parsedStoredUser);
    }
  }, []);

  const login = (user: VendorUser) => {
    localStorage.setItem("vendor-user", JSON.stringify(user)); // Adjusted storage key
    setUser(user);
    router.push("/vendor-login");
  };

  const logout = () => {
    localStorage.removeItem("vendor-user"); // Adjusted storage key
    setUser(null);
    setShowModal(true);
    router.push("/vendor-portal");
  };

  return (
    <VendorContext.Provider value={{ user, setUser, logout, login, showModal }}>
      {children}
    </VendorContext.Provider>
  );
};

// Custom Hook
export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within an VendorProvider");
  }
  return context;
};
