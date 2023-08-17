/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { PlayersContext } from "./PlayersContext";
import { useUserContext } from "../UserContext/UserContext";

export const PlayersProvider = ({ children }: any) => {
  const [PlayersDb, setPlayersDb] = React.useState();
  const [charge, setCharge] = React.useState(false);
  const { userDb } = useUserContext();
  const tokenID = userDb?.token;

  const getPlayersDb = async () => {
    try {
      const response = await fetch(
        "https://redtronapi-development.up.railway.app/players",
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + tokenID,
          },
        }
      );
      const data = await response.json();
      setPlayersDb(data.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    tokenID && getPlayersDb();
  }, [userDb.token, charge]);

  return (
    <PlayersContext.Provider value={{ PlayersDb, setCharge, charge }}>
      {children}
    </PlayersContext.Provider>
  );
};
