/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useUsersContext } from "../../UsersContext/UsersContext";
import css from "./Casino.module.css";
import { useUserContext } from "../../UserContext/UserContext";

const Casino = ({ id, name, imageUrl, onClose }) => {
  const { usersDb, charge, setCharge } = useUsersContext();
  const [option, setOption] = useState({
    usersId: [],
    casinoId: id,
  });
  const [usersCasino, setUsersCasino] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const { userDb } = useUserContext();
  const tokenID = userDb?.token;

  const userCasinoAsigned = usersCasino?.map(el => el.user.username);
  const userOptions = usersDb?.filter(
    (el) => !userCasinoAsigned?.includes(el.username)
  );
  const userSelected = usersDb?.filter((el) => option.usersId?.includes(el.id));
 

  const handleOptionChange = ({ target: { value } }) => {
    if (option.usersId.includes(value)) return;
    setOption({
      ...option,
      usersId: option.usersId.concat(value),
    });
  };

  const getUserCasino = async (casinoId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/userCasino?casinoId=${casinoId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + tokenID,
          },
        }
      );
      const data = await response.json();
      setUsersCasino(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const postUserCasino = async () => {
    try {
      const response = await fetch("http://localhost:3001/userCasino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + tokenID,
        },
        body: JSON.stringify(option),
      });
      setRefresh(!refresh)
      setOption({
        usersId: [],
        casinoId: id,
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserCasino(id);
  }, [id, refresh]);

  return (
    <div onClick={(e) => e.stopPropagation()} className={css.container}>
      <div className={css.title}>
        <h1>{name}</h1>
        <img src={imageUrl} alt={name} />
        <button onClick={onClose}>cerrar</button>
      </div>
      <div className={css.boxes}>
        <div className={css.box}>
          <h2>Cajeros activos</h2>
          <div className={css.box1}>
            {usersCasino?.map((el) => (
              <h3 key={el.user.id}>{el.user.username}</h3>
            ))}
          </div>
        </div>
        <div className={css.box2}>
          <select
            name="Cajeros"
            placeholder="cajeros"
            onChange={handleOptionChange}
          >
            <option>Cajeros</option>
            {userOptions?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.username}
              </option>
            ))}
          </select>
          <div className={css.box3}>
            {userSelected?.map((obj) => (
              <h3 key={obj.id}>{obj.username}</h3>
            ))}
          </div>
         
        </div>
      </div>
      <button onClick={() => postUserCasino()}>AGREGAR</button>
    </div>
  );
};

export default Casino;
