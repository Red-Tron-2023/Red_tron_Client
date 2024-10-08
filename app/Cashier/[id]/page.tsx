"use client";
import React from "react";
import css from "./Card.module.css";
import { useUsersContext } from "../../UsersContext/UsersContext";
import { useUserContext } from "../../UserContext/UserContext";
import { Modal } from "../../Components/modal/modal";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const Page = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { usersDb, charge, setCharge } = useUsersContext();
  const { userDb } = useUserContext();
  const userSelected = usersDb?.filter((u) => u.id === id);
  const tokenId = userDb?.token;
  const [open, setOpen] = React.useState(false);
  const [userEdit, setUserEdit] = React.useState({
    phone: userSelected[0].phone,
    email: userSelected[0].email,
    percent_agreement: userSelected[0].percent_agreement,
  });

  const onClose = () => {
    setOpen(!open);
  };

  const reload = () => {
    setCharge(!charge);
  };

  const transformStatus =
    userSelected[0].status === "INACTIVE"
      ? "INACTIVO"
      : userSelected[0].status === "DISABLED"
      ? "BLOQUEADO"
      : "ACTIVO";

  const deleteUser = async () => {
    const response = await fetch(`https://redtronapi-development.up.railway.app/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + tokenId,
      },
    });
    reload();
    router.back()
  };

  const blockUser = async () => {
    const state = userSelected[0].status === "ACTIVE" ? "DISABLED" : "ACTIVE";
    const response = await fetch(`https://redtronapi-development.up.railway.app/users/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + tokenId,
      },
      body: JSON.stringify({
        status: state,
      }),
    });
    reload();
  };

  const changeRole = async () => {
    const rol = userSelected[0].role === "ADMIN" ? "TELLER" : "ADMIN";
    const response = await fetch(`https://redtronapi-development.up.railway.app/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + tokenId,
      },
      body: JSON.stringify({
        role: rol,
      }),
    });
    reload();
  };

  const handlerInputChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserEdit({
      ...userEdit,
      [name]: value,
    });
  };
  
  const handlerPercentChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserEdit({
      ...userEdit,
      [name]: parseInt(value),
    });
  };

  const editUser = async (user) => {
    try {
      const response = await fetch(`https://redtronapi-development.up.railway.app/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + tokenId,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();
   
      if(data.error === false) {
        reload();
      }else if(data.error === true && data.description.includes("UQ_a000cca60bcf04454e727699490")){
        throw new Error("El telefono ya se encuentra registrado.");
      } else {
        throw new Error(`Error al editar el cajero: ${data.message}`);
      }
    } catch (error) {
        throw new Error(`¡Ups! No se pudo editar el cajero: ${error.message}`);
    }
  };

  const [errors, setErrors] = React.useState({
    phone: "",
    email: "",
    percent_agreement: "",
  });

  const validateForm = () => {
    let hasErrors = false;
    const newErrors = {
      phone: "",
      email: "",
      percent_agreement: "",
    };

    if (!userEdit.phone.trim()) {
      newErrors.phone = "El campo Teléfono es requerido.";
      hasErrors = true;
    }

    if (!userEdit.email.trim()) {
      newErrors.email = "El campo Correo es requerido.";
      hasErrors = true;
    }

    if (
      userEdit.percent_agreement === "" ||
      isNaN(userEdit.percent_agreement)
    ) {
      newErrors.percent_agreement = "Porcentaje de acuerdo inválido.";
      hasErrors = true;
    } else if (
      userEdit.percent_agreement < 1 ||
      userEdit.percent_agreement > 100
    ) {
      newErrors.percent_agreement = "El porcentaje debe estar entre 1 y 100.";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await editUser(userEdit);
        
        onClose();
        swal({
          title: "Cajero Editado correctamente!",
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
    <div className={css.container} onClick={(e) => e.stopPropagation()}>
      {open ? (
        <div onClick={(e) => e.stopPropagation()}>
          <form className={css.form_container} onSubmit={handlerSubmit}>
            <h2>{userSelected[0].username}</h2>

            <input
              type="text"
              name="phone"
              value={userEdit.phone}
              onChange={handlerInputChange}
              placeholder="Telefono"
            />
            <input
              type="email"
              name="email"
              value={userEdit.email}
              onChange={handlerInputChange}
              placeholder="Correo"
            />
            <input
              type="number"
              min={1}
              max={100}
              name="percent_agreement"
              value={userEdit.percent_agreement}
              onChange={handlerPercentChange}
              placeholder="Percent Agreement"
            />
            <button type="submit">Guardar cambios</button>
          </form>

          <div className={css.errores}>
            {errors.phone && <p>{errors.phone}</p>}
            {errors.email && <p>{errors.email}</p>}
            {errors.percent_agreement && <p>{errors.percent_agreement}</p>}
          </div>
        </div>
      ) : (
        <div className={css.datos}>
          <h1>{userSelected[0].username}</h1>

          <div className={css.box}>
            <div className={css.box1}>
              <h2>Datos de Usuario</h2>
              <div className={css.data}>
                <h3>
                  <b>Email: &nbsp;</b>
                </h3>
                <h4>{userSelected[0].email}</h4>
              </div>
              <div className={css.data}>
                <h3>
                  <b>Telefono: &nbsp;</b>
                </h3>
                <h4>{userSelected[0].phone}</h4>
              </div>
              <div className={css.data}>
                <h3>
                  <b>Rol: &nbsp;</b>
                </h3>
                <h4>
                  {userSelected[0].role === "ADMIN"
                    ? "ADMINISTRADOR"
                    : "CAJERO"}
                </h4>
              </div>
              <div className={css.data}>
                <h3>
                  <b>Porcentaje de acuerdo:</b>
                </h3>
                <h4>{userSelected[0].percent_agreement}</h4>
              </div>
              <div className={css.data}>
                <h3>
                  <b>Estado: &nbsp;</b>
                </h3>
                <h4>{transformStatus}</h4>
              </div>
            </div>
            {status === "INACTIVE" ? null : (
              <div className={css.box2}>
                <h2>Casinos y Fichas</h2>
                {userSelected[0].user_casino?.map((uc) => (
                  <div key={uc.id} className={css.data}>
                    <h3>
                      <b>{uc.casino.name}</b>
                    </h3>
                    &nbsp;&nbsp;
                    <h4>
                      Fichas disponibles: &nbsp;
                      <b>{uc.coins}</b>
                    </h4>
                    <br />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={css.btn}>
            <button onClick={deleteUser}>Eliminar</button>
            <button onClick={blockUser}>
              {userSelected[0].status === "DISABLED"
                ? "Desbloquear"
                : "Bloquear"}
            </button>
            <button onClick={onClose}>Editar</button>
            <button onClick={changeRole}>Cambiar Rol</button>
          </div>
        </div>
      )}

      <button className={css.cerrar} onClick={() => (open ? onClose() : router.back())}>Cerrar</button>
    </div>
  );
};

export default Page;
