'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'
import { useUserContext } from '../UserContext/UserContext';
import { useRouter } from 'next/navigation';
import Header from '../Components/Header/Header';

const Page = () => {
  const { userDb } = useUserContext();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(!open);

  console.log(userDb)
  React.useEffect(() => {
    userDb.status === 'INACTIVE' ? router.push('/Password') : null;
  }, [userDb.status])
  
  return (

    <div>
        <Header setOpen={openModal}/>
    </div>
  )
}

export default Page