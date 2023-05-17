import { useState } from 'react'
import Sidebar from './Components/Sidebar';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Locker from './Components/Locker';
import Skins from './Components/Skins';
import Settings from './Components/Settings';
import Swal from 'sweetalert2'

function App() {
  const [page, pageSetter] = useState(0);
  const [parent] = useAutoAnimate();
  const [user, setUser] = useState();
  const { ipcRenderer } = window.require('electron');
  ipcRenderer.on('unauthorized', () => {
    Swal.fire({
      icon: 'error',
      text: 'Account Not Authorized',
      toast: true,
      position: 'top-end',
      background: '#2D3748',
      color: '#fff',
      showConfirmButton: false,
      timer: 3000
  })
  })
  return (
    <div className='bg-gray-900 relative flex w-screen h-screen' ref={parent}>
      <Sidebar pageSetter={pageSetter} />
      {page == 0 && <div className='w-[70%] h-[100%] flex flex-col gap-3 justify-center items-center text-white'>
        <h1 className='text-5xl italic p-3'>RaphValo</h1>
        <h1 className='text-2xl italic'>The improved Valorant experience!</h1>
      </div>}
      {page == 1 && <Locker user={user} />}
      {page == 2 && <Skins user={user} />}
      {page == 3 && <Settings user={user} userSetter={setUser} />}
    </div>
  )
}

export default App
