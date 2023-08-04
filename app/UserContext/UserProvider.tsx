'use client'
import React from 'react'
import { UserContext } from "./UserContext";
import { user } from '../interfaces/interfaces';



export const initialUser: user = {
    username: 'guest',
    role: null,
    id: null,
    token: null,
    phone: null,
    email: null}

export const UserProvider = ({ children }:any) => {
    const [userDb, setUserDB] = React.useState(initialUser);

    return (
        <UserContext.Provider value={{ userDb, setUserDB }}>
            {children}
        </UserContext.Provider>
    );
};
