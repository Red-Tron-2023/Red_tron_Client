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

const Page = () => {
  const router = useRouter();
  const { usersDb, charge, setCharge } = useUsersContext();
  const { userDb } = useUserContext();
  const tokenId = userDb?.token;
  const [open, setOpen] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [userSelected, setUserSelected] = React.useState(null);

  const onClose = () => {
    setOpen(!open);
  };

  const reload = () => {
    setCharge(!charge);
  };
  useEffect(() => {
    userDb && userDb.role === "ADMIN" ? null : router.push("/");
  }, [router, userDb]);

  const openDataUser = (user) => {
    setUserSelected(user);
    setOpenUser(!openUser);
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
          <input type="text" placeholder="buscar..." />
          <button className="btn-create" onClick={() => setOpen(!open)}>
            <span>+</span>
            CREAR NUEVO
          </button>
          <div className="users">
            <ul className={css.container_cashiers}>
              {usersDb?.map((user) => (
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
