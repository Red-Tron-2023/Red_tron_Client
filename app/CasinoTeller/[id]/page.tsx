"use client"
import React, { useState } from 'react';
import CreatePlayer from '../../Components/CreatePlayer/CreatePlayer';
import { useCasinosContext } from '../../CasinoContext/CasinoContext';
import { useUsersContext } from '../../UsersContext/UsersContext';
import { useUserContext } from '../../UserContext/UserContext';
import { useParams } from 'next/navigation';

export default function Page() {
  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);
  const params = useParams();
  const { casinosDb } = useCasinosContext();
  const { usersDb } = useUsersContext(); 
  const { userDb } = useUserContext();

  const casinoId = params.id;
  let casino;
  if (casinosDb) {
    casino = casinosDb.find(casino => casino.id === casinoId);
  }
console.log(casinoId)
  const openCreatePlayerModal = () => {
    setIsCreatePlayerModalOpen(true);
  };

  const closeCreatePlayerModal = () => {
    setIsCreatePlayerModalOpen(false);
  };

  const userCasinoId = usersDb?.find(user => user.id === userDb.id)?.user_casino.find(item => item.casino.id === casinoId)?.id;

  return (
    <div>
      {casino && (
        <>
          <h1>{casino.name}</h1>
          <img src={casino.imageUrl} alt={casino.name} width={300} height={200} />
        </>
      )}
      <button onClick={openCreatePlayerModal}>Crear Jugador</button>
      <button>Ver Jugadores</button>
      <button>Solicitar Fichas</button>

      {isCreatePlayerModalOpen && (
        <div className="modal-overlay">
          <CreatePlayer close={closeCreatePlayerModal} userCasinoId={userCasinoId} />
        </div>
      )}
    </div>
  );
}
