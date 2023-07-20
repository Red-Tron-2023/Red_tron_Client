/* eslint-disable @next/next/no-img-element */
"use client";

import css from "./Casinos.module.css";
import { useCasinosContext } from "../CasinoContext/CasinoContext";
import Link from "next/link";
import React from "react";
import { Modal } from "../Components/modal/modal";
import Casino from "../Components/Casino/Casino";
import CreateCasino from "../Components/Casino/CreateCasino";

export default function Page() {
  const { casinosDb, charge, setCharge } = useCasinosContext();
  const [open, setOpen] = React.useState(false);
  const [openTwo, setOpenTwo] = React.useState(false);
  const [casino, setCasino] = React.useState(null);
  const onClose = () => setOpen(!open);
  const onCloseTwo = () => setOpenTwo(!openTwo);
  const reload = () => setCharge(!charge);
  const openCasino = (casino) => {
    setOpen(!open);
    setCasino(casino);
  };

  return (
    <main className="jc-sa">
      {open ? (
        <Modal onClose={onClose}>
          <Casino
            id={casino?.id}
            name={casino?.name}
            imageUrl={casino?.imageUrl}
            onClose={onClose}
          />
        </Modal>
      ) : openTwo ? (
        <Modal onClose={onCloseTwo}>
          <CreateCasino onClose={onCloseTwo} Reload={reload} />
        </Modal>
      ) : (
        <div className={css.casinos}>
          <h1>Casinos Redtron</h1>
          <button className="btn-create" onClick={() => setOpenTwo(!openTwo)}>
            <span>+</span>
            CREAR NUEVO CASINO
          </button>
          <div className={css.tri}>
            {casinosDb?.map((e) => (
              <div key={e.id} onClick={() => openCasino(e)}>
                <img src={e.imageUrl} alt="casino" width={150} height={150} />
                <h3>{e.name}</h3>
              </div>
            ))}
          </div>
          
        </div>
      )}
    </main>
  );
}
