// context/DriverContext.tsx
import React, { createContext, useContext, useState } from "react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  imageUrl: string;
}

interface DriverContextProps {
  driver: Driver | null;
  setDriver: (driver: Driver) => void;
  logoutDriver: () => void;
}

const DriverContext = createContext<DriverContextProps | undefined>(undefined);

export const DriverProvider = ({ children }: { children: React.ReactNode }) => {
  const [driver, setDriver] = useState<Driver | null>(null);

  const logoutDriver = () => setDriver(null);

  return (
    <DriverContext.Provider value={{ driver, setDriver, logoutDriver }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) throw new Error("useDriver must be used within a DriverProvider");
  return context;
};
