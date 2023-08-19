import React, { useState } from "react";
import css from "./CreateCashier.module.css";
import swal from "sweetalert";

const CreateCashier = ({ tokenId, onClose, reload }) => {
  const [input, setInput] = useState({
    username: "",
    phone: "",
    email: "",
    percent_agreement: 0,
  });

  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    email: "",
    percent_agreement: "",
  });

  const createCashier = async (token, object) => {
    try {
        const response = await fetch("https://redtronapi-development.up.railway.app/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + token,
            },
            body: JSON.stringify(object),
        });

        //esta constante permite ver los mensjes que llegan de la api
        const responseBody = await response.json();

        if (responseBody.error === false) {
            // Usuario creado exitosamente
        } else if (responseBody.error === true && responseBody.description.includes("UQ_fe0bb3f6520ee0469504521e710")) {
            //Para el error identifico el codigo de llave duplicada y genero el mensaje de error
          throw new Error("El cajero ya existe.");
        } else if (responseBody.error === true && responseBody.description.includes("UQ_a000cca60bcf04454e727699490")) {
          throw new Error("El número ya se encuentra registrado.");
        }else {
            throw new Error(`Error al crear el usuario: ${responseBody.message}`);
        }
    } catch (error) {
        throw new Error(`¡Ups! No se pudo crear el cajero: ${error.message}`);
    }
};

  const handlerInputChange = ({ target: { name, value } }) => {
    setInput({
      ...input,
      [name]: value,
    });
  };

  const validateForm = () => {
    let hasErrors = false;
    const newErrors = {
      username: "",
      phone: "",
      email: "",
      percent_agreement: "",
    };

    if (!input.username) {
      newErrors.username = "Debe ingresar un nombre de usuario.";
      hasErrors = true;
    }

    if (!input.phone) {
      newErrors.phone = "Debe ingresar un número de celular.";
      hasErrors = true;
    }

    if (!input.email) {
      newErrors.email = "Debe ingresar un email.";
      hasErrors = true;
    }

    if (input.percent_agreement <= 0 || !input.percent_agreement) {
      newErrors.percent_agreement = "Debe ingresar un monto mayor a 0.";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handlerSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await createCashier(tokenId, input);

        setInput({
          username: "",
          phone: "",
          email: "",
          percent_agreement: 0,
        });

        onClose();
        reload();

        swal({
          title: "Cajero creado correctamente!",
          icon: "success",
        });
      } catch (error) {
        swal({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      }
    }
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
        />
        {errors.username && <p className={css.errorMsg}>{errors.username}</p>}
        <input
          type="number"
          name="phone"
          value={input.phone}
          placeholder="Numero de Celular"
          onChange={handlerInputChange}
        />
        {errors.phone && <p className={css.errorMsg}>{errors.phone}</p>}
        <input
          type="email"
          name="email"
          value={input.email}
          placeholder="Email"
          onChange={handlerInputChange}
        />
        {errors.email && <p className={css.errorMsg}>{errors.email}</p>}
        <input
          type="number"
          name="percent_agreement"
          value={input.percent_agreement}
          placeholder="Porcentaje"
          onChange={handlerInputChange}
        />
        {errors.percent_agreement && <p className={css.errorMsg}>{errors.percent_agreement}</p>}
        <button className={css.btn} type="submit">
          Crear cajero
        </button>
      </form>
    </div>
  );
};

export default CreateCashier;
