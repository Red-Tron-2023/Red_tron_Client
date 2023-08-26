import React, { useState } from 'react';
import { useCasinosContext } from '../../CasinoContext/CasinoContext';
import { useUserContext } from '../../UserContext/UserContext';
import css from "./CreatePlayer.module.css";
import swal from 'sweetalert';

const CreatePlayer = ({ close, userCasinoId }) => { 
  const [nickname, setNickname] = useState({
    nickname: "",
    errorNickname: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const { setCharge } = useCasinosContext(); 

  const handleNicknameChange = ({ target: { name, value }}) => {
    
    if (value.length < 3){
      setNickname((prevInput) => ({
        ...prevInput,
        [name]: value,
        errorNickname: "El usuario debe tener al menos 3 caracteres",
      }))
      
    } else {
      setNickname((prevInput) => ({
        ...prevInput,
        [name]: value,
        errorNickname: ""
      }))
    }
  };
  
  const { userDb } = useUserContext();
  const token= userDb?.token;
  const newPlayer={
    nickname: nickname.nickname,
    userCasinoId: userCasinoId, 
  }

  const handleCreatePlayer = async () => {
    setIsLoading(true); 
  
    try {

      if(nickname.nickname.length <= 0){
        throw new Error("No pueden quedar campos vacios!");
      }

      if(nickname.errorNickname){  
        throw new Error(`${nickname.errorNickname}`);
      }

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
        swal({text: "Jugador creado correctamente", icon:"success"})
        close();
      } else if (responseData.error && responseData.message.includes("No se encuentra el userCasino")) { 
        throw new Error ("Disculpa, se produjo un error. Por favor, refresca la página.")
      }else if ( responseData.error && responseData.message.includes("La columna nickname está duplicada")){
        throw new Error ("Disculpa, este nombre está en uso. Por favor, elige otro.")
      } else {
        throw new Error (`${responseData.message}`)
      }
    } catch (error) {
      swal({title: "Ups!! No se pudo crear el Jugador", 
      text: `${error.message}`, 
      icon:"error"})
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className={css.modal}>
      <h2>Crear jugador</h2>
      <label htmlFor="nickname">Nickname:</label>
      <input
        type="text"
        id="nickname"
        name='nickname'
        value={nickname.nickname}
        onChange={handleNicknameChange}
        />
        <div>
        {nickname.errorNickname && <p style={{ color: 'red' }} >{nickname.errorNickname}</p>}
       </div>
      <button onClick={handleCreatePlayer} disabled={isLoading}>
        {isLoading ? 'Creando...' : 'Crear'}
      </button>
    </div>
  );
};

export default CreatePlayer;
