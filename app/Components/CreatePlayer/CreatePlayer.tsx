import React, { useState } from 'react';
import { useCasinosContext } from '../../CasinoContext/CasinoContext';
import { useUserContext } from '../../UserContext/UserContext';
import swal from 'sweetalert';

const CreatePlayer = ({ close, userCasinoId }) => { 
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const { setCharge } = useCasinosContext(); 
  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };
  const { userDb } = useUserContext();
  const token= userDb?.token;
  const newPlayer={
    nickname: nickname,
    userCasinoId: userCasinoId, 
  }
  const handleCreatePlayer = async () => {
    setIsLoading(true); 


    try {
      const response = await fetch('https://redtronapi-development.up.railway.app/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(
          newPlayer
        ),
      });
      const responseData = await response.json();
      if (!responseData.error) {
        setCharge((prevCharge) => !prevCharge);
        swal({title: "success", text: "Jugador creado correctamente", icon:"success"})
        close();
      } else {
        throw new Error (`Error al crear el Jugador ${responseData.message}`)
      }
    } catch (error) {
      swal({title: "error", text: `${error.message}`, icon:"error"})
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="modal">
      <h2>Crear jugador</h2>
      <label htmlFor="nickname">Nickname:</label>
      <input
        type="text"
        id="nickname"
        value={nickname}
        onChange={handleNicknameChange}
      />
      <button onClick={handleCreatePlayer} disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear'}
      </button>
    </div>
  );
};

export default CreatePlayer;
