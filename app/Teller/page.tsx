'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext/UserContext';
import { useUsersContext } from '../UsersContext/UsersContext';
import { useCasinosContext } from '../CasinoContext/CasinoContext';
import { useRouter } from 'next/navigation';
import Header from '../Components/Header/Header';
import css from './Teller.module.css';

const Page = () => {
  const { userDb } = useUserContext();
  const { usersDb } = useUsersContext();
  const { casinosDb } = useCasinosContext();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(!open);

  useEffect(() => {
     userDb.role !== "TELLER" ? router.push('/') : null;
    if (userDb.status === 'INACTIVE') {
      router.push('/Password');
    }
  }, [userDb.status]);

  const assignedCasinos = usersDb?.find(user => user.id === userDb.id)?.user_casino;

  const handleCasinoClick = (casinoId) => {
    router.push(`/CasinoTeller/${casinoId}`);
  };

  return (
    <div>
      <Header setOpen={openModal} />
      {casinosDb && assignedCasinos?.map((assignedCasino) => {
        const casino = casinosDb.find(casino => casino.id === assignedCasino.casino.id);
        if (!casino) return null;
        return (
          <div
            key={casino.id}
            className={css.casinoContainer}
            onClick={() => handleCasinoClick(casino.id)}
          >
            <img
              src={casino.imageUrl}
              alt={casino.name}
              className={css.casinoImage}
            />
            <p>{casino.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Page;
