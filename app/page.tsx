/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import Logo from "/app/assets/logo.png";
import React, { useEffect } from "react";
import { useUserContext } from "./UserContext/UserContext";
import { useRouter } from "next/navigation";
import {AiOutlineEye} from 'react-icons/ai'

export default function Home() {
  const router = useRouter();
  const [input, setInput] = React.useState({
    username: "",
    password: "",
  });
  const { userDb, setUserDB } = useUserContext();
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    userDb.role === "ADMIN" ? router.push("/Admin") : userDb.role === "TELLER" ?router.push("/Teller"): null;
  }, [userDb]);

  const handleInputChange = ({ target: { name, value } }) => {
    setInput({
      ...input,
      [name]: value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userLogin = async (input:object) => {
    const response = await fetch("https://redtronapi-development.up.railway.app/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((response) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    userLogin(input);
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
        <input
          type={showPassword ? "text" : "password"} // Cambia el tipo del input
          placeholder="Password"
          name="password"
          value={input.password}
          onChange={handleInputChange}
          required
        />
        <AiOutlineEye className="eye" onClick={toggleShowPassword}/>
        <button type="submit">ENTRAR</button>
      </form>
    </main>
  );
}


