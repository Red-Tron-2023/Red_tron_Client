import React, { useState } from "react";
import { useUserContext } from "../../UserContext/UserContext";
import { useCasinosContext } from "../../CasinoContext/CasinoContext";

const AssignCoins = () => {
  const { userDb } = useUserContext();
  const { casinosDb } = useCasinosContext();
  const tokenId = userDb?.token;
  const [usersCasino, setUsersCasino] = useState(null);
  const [input, setInput] = useState({
    userId: "",
    amount: "",
  });
  const [idCasino, setIdCasino] = useState({
    id: "",
  });
  console.log(input.userId);
  const getUserCasino = async (casinoId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/userCasino?casinoId=${casinoId}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + tokenId,
          },
        }
      );
      const data = await response.json();
      setUsersCasino(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  React.useEffect(() => {
    idCasino.id && getUserCasino(idCasino.id);
  }, [idCasino]);

  const postCoins = async (obj: object, token: string) => {
    try {
      const response = await fetch("http://localhost:3001/coinsMovements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(obj),
      });

      if (response.ok) {
        console.log("Fichas asignadas correctamente");
      } else {
        console.log("Error al asignar fichas");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleInputChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLSelectElement> &
    React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handleIdChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setIdCasino({
      ...idCasino,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postCoins(input, tokenId);
    setInput({
      userId: "",
      amount: "",
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form>
        {/* onSubmit={handleSubmit} */}
        <h2>Asignar Fichas</h2>
        <label>Casino:</label>
        <select
          name="id"
          placeholder="Seleccionar Casino"
          value={idCasino.id}
          onChange={handleIdChange}
        >
          <option>Seleccionar Casino</option>
          {casinosDb?.map((Cs) => (
            <option key={Cs.id} value={Cs.id}>
              {Cs.name}
            </option>
          ))}
        </select>
        <label>
          Usuario:
          <select
            name="userId"
            value={input.userId}
            onChange={handleInputChange}
          >
            <option>Seleccionar Usuario</option>
            {usersCasino?.map((Uc) => (
              <option key={Uc.id} value={Uc.id}>
                {Uc.user.username}
              </option>
            ))}
          </select>
        </label>

        <label>Cantidad de fichas:</label>
        <input
          type="number"
          name="amount"
          value={input.amount}
          min={1}
          onChange={handleInputChange}
        />

        <button type="submit">Asignar fichas</button>
      </form>
    </div>
  );
};

export default AssignCoins;
