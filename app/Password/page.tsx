'use client'
import React from 'react'
import { useUserContext } from '../UserContext/UserContext';
import swal from "sweetalert";
import { useRouter } from 'next/navigation';
import { initialUser } from '../UserContext/UserProvider';
import css from "./Password.module.css";


export default function Page() {
  const { userDb, setUserDB } = useUserContext();
  const tokenID = userDb?.token
  const router = useRouter();
  const [input, setInput] = React.useState({
    password: 'Redtron2023',
    newPassword: '',
    comparePassword: '',
    newPasswordError: '',
    comparePasswordError: '',
  })

  const userInActive = {
    userName: userDb?.username,
    item: {
      password: input.password,
      newPassword: input.newPassword,
      comparePassword: input.comparePassword
    }
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const handleInpuChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (name === 'newPassword' && !passwordRegex.test(value)) {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        newPasswordError: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra mayúscula y un número.",
      }));
    } else if (name === 'comparePassword' && !passwordRegex.test(value)) {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        comparePasswordError: "La contraseña debe tener al menos 6 caracteres, incluyendo al menos una letra mayúscula y un número.",
      }));
    } else if (name === 'comparePassword' && value !== input.newPassword) {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        comparePasswordError: "Las contraseñas no coinciden.",
      }));
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        newPasswordError: "",
        comparePasswordError: "",
      }));
    }
  };

  const ChangePassword = async() => {
    try {
      if(input.newPassword.length <= 0){
        swal({
          title: "Ups!!",
          text: "No pueden quedar campos vacios!",
          icon: "error",
        });
        throw new Error("No pueden quedar campos vacios!");
      }
      if(input.newPasswordError || input.comparePasswordError){
        swal({
          title: "Ups!!",
          text: "No pueden quedar campos con errores!",
          icon: "error",
        });
        throw new Error("No pueden quedar campos con errores!");
      }
      const response = await fetch("https://redtronapi-development.up.railway.app/users/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + tokenID,
        },
        body: JSON.stringify(userInActive),
      })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if(response.error){
          swal({
            title: "Ups!!",
            text: response.message,
            icon: "error",
          });
          throw new Error(response.message);
        }
        else {
          swal({
            title: "Contraseña actualizada!",
            icon: "success",
          });
          setUserDB(initialUser)
          router.push('/')
        }

      })

      }
     catch (error) {
     console.log(error);
    }
  }
  
  return (
    <main className={css.mainContainer}>
      <div className={css.contenedor}>
        <h2>Necesitamos que cambie su contraseña</h2>        
        <input type="password" name='newPassword' placeholder='Nueva Contraseña' value={input.newPassword} onChange={handleInpuChange}/>
        <span className={css.error}>
        {input.newPasswordError && <p style={{ color: 'red' }} >{input.newPasswordError}</p>}
        </span>
        <input type="password" name='comparePassword' placeholder='Repetir Contraseña' value={input.comparePassword} onChange={handleInpuChange}/>
        <span className={css.error}>
        {input.comparePasswordError && <p style={{ color: 'red' }} >{input.comparePasswordError}</p>}
        </span>
        <button onClick={ChangePassword}>Actualizar</button>        
      </div>
    </main>
  )
}