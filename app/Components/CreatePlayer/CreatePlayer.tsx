import React, { useState } from 'react';
import { useCasinosContext } from '../../CasinoContext/CasinoContext';

const CreatePlayer = ({ close, userCasinoId }) => { 
  const [nickname, setNickname] = useState('');
  const { setCharge } = useCasinosContext(); 

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleCreatePlayer = async () => {
    try {
      const response = await fetch('/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: nickname,
          userCasinoId: userCasinoId, 
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setCharge((prevCharge) => !prevCharge);
        console.log('Jugador creado exitosamente:', responseData);
        close();
      } else {
        console.error('Error al crear el jugador');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
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
      <button onClick={handleCreatePlayer}>Crear</button>
    </div>
  );
};

export default CreatePlayer;
