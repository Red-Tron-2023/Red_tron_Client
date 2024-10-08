/* eslint-disable react-hooks/rules-of-hooks */

import { useUserContext } from "../../UserContext/UserContext";
import css from "./Header.module.css";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { initialUser } from "../../UserContext/UserProvider";

export default function header({setOpen}) { 
  const { userDb, setUserDB } = useUserContext();
  
  return (
    <div className={css.header}>      
      <h1>Bienvenido {userDb?.username.toUpperCase()}!</h1>
     
      <button  onClick={()=>setOpen()} >
        <h2><FaUser /></h2>
      
      </button>
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <button  onClick={()=> setUserDB(initialUser)} >
        <h2><RiLogoutBoxRFill /></h2>      
      </button>
    </div>
  );
}
