import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
