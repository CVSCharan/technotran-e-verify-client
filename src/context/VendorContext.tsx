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
import { usePathname } from "next/navigation";
import { VendorContextType, VendorUser } from "@/utils/types"; // Import the AdminUser type

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [vendorUser, setVendorUser] = useState<VendorUser | null>(null); // Use AdminUser type
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  // Check for the user in cookies when the component mounts
  const checkUserFromCookies = () => {
    const storedUser = Cookies.get("vendor_user");
    if (storedUser) {
      setVendorUser(JSON.parse(storedUser));
      setShowModal(false); // No modal if user is logged in
    } else {
      setVendorUser(null);
      setShowModal(true); // Show modal if no user is logged in
    }
  };

  useEffect(() => {
    checkUserFromCookies();
  }, []); // Empty dependency ensures this only runs on mount

  useEffect(() => {
    checkUserFromCookies();
  }, [pathname]);

  const login = (user: VendorUser) => {
    setVendorUser(user);
    Cookies.set("vendor_user", JSON.stringify(user), {
      expires: 1 / 48, // 30 minutes (0.0208 days)
      sameSite: "Strict",
    });
    setShowModal(false);
    router.push("/vendor-dashboard");
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors/logout`, {
      method: "POST",
      credentials: "include",
    });

    setVendorUser(null);
    Cookies.remove("vendor_user");
    setShowModal(true); // Show modal on logout
    // router.push("/vendor-portal");
  };

  // Memoize context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      vendorUser,
      setVendorUser,
      login,
      logout,
      showModal,
      setShowModal,
    }),
    [vendorUser, showModal]
  );

  return (
    <VendorContext.Provider value={contextValue}>
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
