"use client";
import { useContext, createContext, Dispatch, SetStateAction } from "react";

export interface AuthContextValue {
  PlayersDb?: Array<any> | null;
  setCharge: Dispatch<SetStateAction<boolean | null>>;
  charge: boolean;
}

export const PlayersContext = createContext<AuthContextValue>({
  PlayersDb: null,
  setCharge: () => {},
  charge: false,
});

export const usePlayersContext = () => useContext(PlayersContext);
