"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AdminContextType, AdminUser } from "@/utils/types";
import { usePathname } from "next/navigation";

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showModal, setShowModal] = useState(false); // Initially false

  const router = useRouter();

  const pathname = usePathname();

  // Check for the user in cookies when the component mounts
  const checkUserFromCookies = () => {
    const storedUser = Cookies.get("admin_user");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
      setShowModal(false); // No modal if user is logged in
    } else {
      setAdminUser(null);
      setShowModal(true); // Show modal if no user is logged in
    }
  };

  useEffect(() => {
    checkUserFromCookies();
  }, []); // Empty dependency ensures this only runs on mount

  useEffect(() => {
    checkUserFromCookies();
  }, [pathname]);

  const login = (user: AdminUser) => {
    setAdminUser(user);
    Cookies.set("admin_user", JSON.stringify(user), {
      expires: 1 / 48, // 30 minutes (0.0208 days)
      sameSite: "Strict",
    });
    setShowModal(false);
    router.push("/admin-dashboard");
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/logout`, {
      method: "POST",
      credentials: "include",
    });

    setAdminUser(null);
    Cookies.remove("admin_user");
    setShowModal(true); // Show modal on logout
    router.push("/admin-login");
  };

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({ adminUser, setAdminUser, login, logout, showModal, setShowModal }),
    [adminUser, showModal, login, logout, setShowModal]  // Added missing dependencies
  );

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom Hook for using Admin Context
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
