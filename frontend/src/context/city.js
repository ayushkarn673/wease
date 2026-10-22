import { createContext, useContext } from "react";

// { city: string | null, setCity(city | null): Promise<void>, saving: boolean }
export const CityContext = createContext({ city: null, setCity: async () => {}, saving: false });

export function useCity() {
  return useContext(CityContext);
}