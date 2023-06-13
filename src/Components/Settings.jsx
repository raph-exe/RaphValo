import React, { useState } from 'react'
import Swal from 'sweetalert2'

const Settings = ({ user, userSetter }) => {
    const https = window.require('https');
    const fs = window.require('fs');
    const { ipcRenderer } = window.require('electron');
    const authAccount = () => {
        ipcRenderer.send('localfolder');
        ipcRenderer.on('localfolder', (eve, folderPath) => {
            fs.readFile(folderPath + '\\Riot Games\\Riot Client\\Config\\lockfile', (err, data) => {
                if (err) {
                    return Swal.fire({
                        icon: 'error',
                        text: 'An Error Occured',
                        toast: true,
                        position: 'top-end',
                        background: '#2D3748',
                        color: '#fff',
                        showConfirmButton: false,
                        timer: 3000
                    })
                }
                Swal.fire({
                    icon: 'info',
                    text: 'Authorizing... ',
                    toast: true,
                    position: 'top-end',
                    background: '#2D3748',
                    color: '#fff',
                    showConfirmButton: false,
                    timer: 3000
                })
                const fileParts = String(data).split(':');
                const port = fileParts[2];
                const password = fileParts[3];
                ipcRenderer.send('auth', port, password);
            })
        })
        ipcRenderer.on('userAuth', (eve, userAuth) => {
            userSetter(userAuth)
            Swal.fire({
                icon: 'success',
                text: 'Authorized Riot Account',
                toast: true,
                position: 'top-end',
                background: '#2D3748',
                color: '#fff',
                showConfirmButton: false,
                timer: 3000
            })
        })
    }

    return (
        <div className='w-[70%] h-[100%] flex flex-col gap-3 items-center text-white p-3'>
            <div className='bg-gray-800 w-[100%] h-[100%] gap-3 p-3 rounded-lg relative flex flex-col justify-center items-center NoDrag'>
                <p className='text-2xl'>{user ? 'Welcome, ' + user?.acct?.game_name : 'Valorant Account Not Authorized'}</p>
                <p>{user ? 'PlayerID : ' + user?.sub : null}</p>
            </div>
            <button className='NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center' onClick={authAccount}>Authorize Account</button>
        </div>
    )
}

export default Settings