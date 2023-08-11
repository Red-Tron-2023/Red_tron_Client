'use client'
import React from 'react'
import { useUserContext } from '../UserContext/UserContext';
import swal from "sweetalert";
import { useRouter } from 'next/navigation';
import { initialUser } from '../UserContext/UserProvider';


export default function Page() {
  const { userDb, setUserDB } = useUserContext();
  const tokenID = userDb?.token
  const router = useRouter();
  const [input, setInput] = React.useState({
    password: 'Redtron2023',
    newPassword: '',
    comparePassword: ''
  })

  const userInActive = {
    userName: userDb?.username,
    item: input
  }
  console.log(userDb)

  const handleInpuChange = ({target:{name, value}}:React.ChangeEvent<HTMLInputElement>) => {
    setInput({...input, [name]: value})
  }

  const ChangePassword = async() => {
    const response = await fetch("https://redtronapi-development.up.railway.app/users/changePassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + tokenID,
      },
      body: JSON.stringify(userInActive),
    })
    console.log(response)
    swal({
      title: "Contraseña actualizada!",
      icon: "success",
    });
    setUserDB(initialUser)
    router.push('/')
  }
  
  return (
    <main>
        <h2>Nueva Contraseña</h2>        
        <input type="password" name='newPassword' placeholder='Nueva Contraseña' value={input.newPassword} onChange={handleInpuChange}/>
        <input type="password" name='comparePassword' placeholder='Repetir Contraseña' value={input.comparePassword} onChange={handleInpuChange}/>
        <button onClick={ChangePassword}>Enviar</button>        
    </main>
  )
}