"use client";
import React, { useState } from "react";
import { useUserContext } from "../../UserContext/UserContext";
import swal from "sweetalert";
import css from "./CreateCasino.module.css";

const CreateCasino = ({ onClose, Reload }) => {
  const { userDb } = useUserContext();
  const tokenId = userDb?.token;
  const [input, setInput] = useState({
    name: "",
    image_url: "",
  });
  const postCasino = async (obj: object, token: string) => {
    try {
      const userDb = await fetch("https://redtronapi-development.up.railway.app/casino", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify(obj),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const handlerInputChange = ({
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setInput({
      ...input,
      [name]: value,
    });
  };
  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postCasino(input, tokenId);
    setInput({
      name: "",
      image_url: "",
    });
    onClose();
    Reload();
    swal({
      title: 'Casino creado correctamente!',
      icon: 'success',

    });
  };
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <form className={css.formulario} onSubmit={handlerSubmit}>
        <h2>Crear Casino</h2>
        <input
          type="text"
          name="name"
          value={input.name}
          placeholder="Nombre del Casino"
          onChange={handlerInputChange}
        />
        <input
          type="text"
          name="image_url"
          value={input.image_url}
          placeholder="url de imagen"
          onChange={handlerInputChange}
        />
        <button type="submit">Crear</button>
      </form>
    </div>
  );
};

export default CreateCasino;
