/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import Logo from "/app/assets/logo.png";
import React, { useEffect } from "react";
import { useUserContext } from "./UserContext/UserContext";
import { useRouter } from "next/navigation";
import {AiOutlineEye} from 'react-icons/ai'
import swal from "sweetalert";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = React.useState({
    username: "",
    password: "",
    usernameError: "",
    passwordError: "",
  });
  const { userDb, setUserDB } = useUserContext();
  const [showPassword, setShowPassword] = React.useState(false);


  useEffect(() => {
    userDb.role === "ADMIN" ? router.push("/Admin") : userDb.role === "TELLER" ?router.push("/Teller"): null;
  }, [userDb]);

  const handleInputChange = ({ target: { name, value } }) => {
    if (name === "username" && value.length < 3) {
      // Validación para el campo de usuario
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        usernameError: "El usuario debe tener al menos 3 caracteres",
      }));
    } else if (name === "password" && value.length < 6) {
      // Validación para el campo de contraseña
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        passwordError: "La contraseña debe tener al menos 6 caracteres",
      }));
    } else {
      // Si no hay errores, actualiza el valor normalmente
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
        usernameError: "",
        passwordError: "",
      }));
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userLogin = async (input:object) => {
    try {
      const response = await fetch("https://redtronapi-development.up.railway.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      })
      .then((res) => res.json())
      .then((response) => {
        console.log(response)
        if(response.error){
          swal({
            title: "Error",
            text: response.message,
            icon: "error",
          });
          throw new Error(response.message);
        }
          let user = {
            id: response?.data.id,
            username: response?.data.username,
            role: response?.data.role,
            phone: response?.data.phone,
            email: response?.data.email,
            token: response?.data.token,
            status: response?.data.status
          };
          return user;
        });
      setUserDB(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      //Verifico si tiene errores el formulario antes de enviarlo
      if(input.passwordError){
        swal({
          title: "Error",
          text: input.passwordError,
          icon: "error",
        });
        throw new Error(input.passwordError);
      }else if(input.usernameError){
        swal({
          title: "Error",
          text: input.usernameError,
          icon: "error",
        });
        throw new Error(input.usernameError);
      }else{
        //Si no encuentra error se envia
        userLogin(input);
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <main>
      <Image src={Logo} alt="REDTRON Logo" width={191} height={182} priority />
      <h2>BIENVENIDO!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="username"
          value={input.username}
          onChange={handleInputChange}
          required
        />
        <div>
        {input.usernameError && <p style={{ color: 'red' }} >{input.usernameError}</p>}
        </div>
        <AiOutlineEye className="eye" onClick={toggleShowPassword}/>
        <input
          type={showPassword ? "text" : "password"} // Cambia el tipo del input
          placeholder="Password"
          name="password"
          value={input.password}
          onChange={handleInputChange}
          required
        />
        <div>
        {input.passwordError && <p style={{ color: 'red' }} >{input.passwordError}</p>}
        </div>
        <button type="submit">ENTRAR</button>
      </form>
    </main>
  );
}



