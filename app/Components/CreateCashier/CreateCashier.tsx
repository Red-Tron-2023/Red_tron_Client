"use client";
import React, { useState } from "react";
import css from "./CreateCashier.module.css";
import swal from 'sweetalert';


const CreateCashier = ({ tokenId, onClose, reload }) => {
  const [input, setInput] = useState({
    username: "",
    phone: "",
    email: "",
    percent_agreement: 0,
  });

  const createCashier = async (token:string, object:object) => {
    const userDb = await fetch("https://redtronapi-development.up.railway.app/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify(object),
    });
  };

  const handlerInputChange = ({ target: { name, value } }) => {
    setInput({
      ...input,
      [name]: value,
    });
  };


  const handlerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      createCashier(tokenId, input);
    } catch (error) {
      swal(error.message);
    }
    swal({
      title: 'Cajero creado correctamente!',
      icon: 'success',

    });

    setInput({
      username: "",
      phone: "",
      email: "",
      percent_agreement: 0,
    });
    onClose();
    reload();
  };



  return (
    <div className={css.container}>
      <h2>Crear Cajero</h2>
      <form
        onClick={(e) => e.stopPropagation()}
        className={css.box}
        onSubmit={handlerSubmit}
      >
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={input.username}
          onChange={handlerInputChange}
          required
        />
        <input
          type="number"
          name="phone"
          value={input.phone}
          placeholder="Numero de Celular"
          onChange={handlerInputChange}
          required
        />
        <input
          type="email"
          name="email"
          value={input.email}
          placeholder="Email"
          onChange={handlerInputChange}
        />
        <input
          type="number"
          min={1}
          name="percent_agreement"
          value={input.percent_agreement}
          placeholder="Porcentaje"
          onChange={handlerInputChange}
        />
        <button className={css.btn} type="submit">
          Crear cajero
        </button>
      </form>
    </div>
  );
};

export default CreateCashier;
