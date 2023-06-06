import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Locker = ({ user }) => {
    const [locker, setLocker] = useState(false);
    const [Agents, setAgents] = useState([]);
    const { ipcRenderer } = window.require('electron');
    useEffect(() => {
        axios.get('https://valorant-api.com/v1/agents').then(res => {
            let newArr = res.data.data.filter(agent => agent.isPlayableCharacter == true);
            let newArray = [];
            newArr.forEach(item => {
                newArray.push({ displayName: item.displayName, displayIcon: item.displayIcon, uuid: item.uuid })
            })
            setAgents(newArray);
            newArr = [];
        })
    }, [])
    const [Agent, setAgent] = useState(0);
    const toggleLocker = () => {
        setLocker(lock => !lock)
        ipcRenderer.send('instaLock', !locker, Agents[Agent]?.uuid);
    }
    ipcRenderer.on('unauthorized', () => {
        setLocker(false);
    });
    ipcRenderer.on('locked', () => {
        setLocker(false);
    })
    const nextAgent = () => {
        if (locker) return;
        if (Agent == Agents.length - 1) {
            return setAgent(0)
        }
        setAgent(PrevAgent => PrevAgent + 1)
    }
    const previousAgent = () => {
        if (locker) return;
        if (Agent == 0) {
            return setAgent(Agents.length - 1)
        }
        setAgent(PrevAgent => PrevAgent - 1)
    }
    return (
        <div className='w-[70%] h-[100%] flex flex-col gap-3 justify-center items-center text-white p-3'>
            <button className='NoDrag w-[100%] bg-gray-700 hover:bg-gray-600 p-3 rounded-lg cursor-pointer transition-all duration-100 ease-linear relative flex justify-center items-center mb-auto' onClick={toggleLocker}>Agent Locker : {locker ? 'On' : 'Off'}</button>
            <div className='bg-gray-800 w-[100%] h-[100%] gap-3 p-3 rounded-lg relative flex flex-col justify-center items-center'>
                <h1 className='text-5xl italic p-3'>{Agents[Agent]?.displayName}</h1>
                <img src={Agents[Agent]?.displayIcon} className='Pfp w-[50%] rounded-full mt-auto' />
                <div className='flex gap-3 mt-auto relative w-[100%]'>
                    <button className='NoDrag bg-gray-700 w-[50%] p-3 rounded-lg hover:bg-gray-600 transition-all duration-100 ease-linear' onClick={previousAgent}>Previous</button>
                    <button className='NoDrag bg-gray-700 w-[50%] p-3 rounded-lg hover:bg-gray-600 transition-all duration-100 ease-linear' onClick={nextAgent}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default Locker