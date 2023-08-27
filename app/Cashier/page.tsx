/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect } from "react";
import { useUsersContext } from "../UsersContext/UsersContext";
import { FaUser } from "react-icons/fa";
import css from "./Cashier.module.css";
import { useUserContext } from "../UserContext/UserContext";
import { Modal } from "../Components/modal/modal";
import CreateCashier from "../Components/CreateCashier/CreateCashier";
import { useRouter } from "next/navigation";
import Link from "next/link";
import page from "../Password/page";
import swal from "sweetalert";

const Page = () => {
  const router = useRouter();
  const { usersDb, charge, setCharge } = useUsersContext();
  const { userDb } = useUserContext();
  const tokenId = userDb?.token;
  const [open, setOpen] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [userSelected, setUserSelected] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState([]);


  const onClose = () => {
    setOpen(!open);
  };

  const reload = () => {
    setCharge(!charge);
  };
  useEffect(() => {
    userDb && userDb.role === "ADMIN" ? null : router.push("/");
  }, [userDb.role]);

  const openDataUser = (user) => {
    setUserSelected(user);
    setOpenUser(!openUser);
  };

  const [currentPage, setCurrentPage] = React.useState(1);
  const usersPerPage = 8; // Define la cantidad de usuarios por página

  // Calcula el índice del último usuario en cada página
  const indexOfLastUser = currentPage * usersPerPage;
  // Calcula el índice del primer usuario en cada página
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // Filtra los usuarios que se mostrarán en la página actual
  let currentUsers = filteredUsers.length
  ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  : usersDb?.slice(indexOfFirstUser, indexOfLastUser);


  // Calcula los números de página
  const pageNumbers = [];
  if(filteredUsers.length > 0){
    for (let i = 1; i <= Math.ceil((filteredUsers?.length || 1) / usersPerPage); i++) {
      pageNumbers.push(i);
    }
  }else {
    for (let i = 1; i <= Math.ceil((usersDb?.length || 1) / usersPerPage); i++) {
      pageNumbers.push(i);
    }
  }

  // Función para ir a la página siguiente
  const nextPage = () => {
    if (currentPage < Math.ceil(usersDb.length / usersPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Función para ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlerInputSearch = ({ target: { value } }) => {

    const lowercaseValue = value.toLowerCase(); 
  
    const userSearch = usersDb?.filter((user) => {
      const lowercaseUsername = user.username.toLowerCase(); // Convertir el nombre de usuario a minúsculas
      return lowercaseUsername.includes(lowercaseValue);
    });
  
    setUserSelected(value);
  
    if (userSearch.length) {
      setFilteredUsers(userSearch);
    } else {
      setFilteredUsers([]);
    }
  };

  const searchUser = () => {
    let userSearch = usersDb?.filter((u) => u.username === userSelected);
    if(userSearch.length){
      router.push(`/Cashier/${userSearch[0]?.id}`);
    }else {
      swal({
        title: "Ups!!",
        text: `No pudimos encontrar a ${userSelected}`,
        icon: "error",
      });
    }

  };

  return (
    <main className="jc-sa">
      {open ? (
        <Modal onClose={onClose}>
          <div className="div">
            <CreateCashier
              tokenId={tokenId}
              onClose={onClose}
              reload={reload}
            />
          </div>
        </Modal>
      ) : (
        <div className="div">
          <div className={css.buscar}>
            <input
              type="text"
              placeholder="buscar..."
              name="name"
              value={userSelected}
              onChange={handlerInputSearch}
            />
            <button className={css.btn} onClick={searchUser}>
              Buscar
            </button>
          </div>
          <button className={css.btnCreate} onClick={() => setOpen(!open)}>
            <span>+</span>
            CREAR NUEVO
          </button>
          <div className={css.pagination}>
            <button
              className={css.antpost}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              {"<<"}
            </button>
            <p>
              {currentPage} de {pageNumbers.length}
            </p>
            <button
              className={css.antpost}
              onClick={nextPage}
              disabled={
                currentPage === Math.ceil(usersDb?.length / usersPerPage)
              }
            >
              {">>"}
            </button>
          </div>
          <div className={css.users}>
            <ul className={css.container_cashiers}>
              {currentUsers?.map((user) => (
                <li
                  key={user.id}
                  className={css.cashiers_data}
                  onClick={() => openDataUser(user)}
                >
                  <Link href={`/Cashier/${user.id}`}>
                    <h1>
                      <FaUser />
                    </h1>
                    <div className="cashier-name">
                      <h2>{user.username}</h2>
                      <h3>
                        {user.role === "ADMIN" ? "ADMINISTRADOR" : "CAJERO"}
                      </h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;
