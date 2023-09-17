import React, { createContext, useMemo, useState } from "react";

export const AppContext = createContext({
  isContactFormOpen: false,
  setIsContactFormOpen: (isOpen: boolean) => {},
});

export interface AppContextProviderProps {
  children: React.ReactNode;
}
export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState<boolean>(false);

  const state = useMemo(
    () => ({
      isContactFormOpen: isContactFormOpen,
      setIsContactFormOpen: (isOpen: boolean) => setIsContactFormOpen(isOpen),
    }),
    [isContactFormOpen, setIsContactFormOpen],
  );

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
