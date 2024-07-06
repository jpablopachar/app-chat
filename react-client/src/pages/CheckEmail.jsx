import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { PiUserCircle } from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'

const CheckEmail = () => {
  const [data, setData] = useState({ email: '' })

  const navigate = useNavigate()

  const handleOnChange = (event) => {
    const { name, value } = event.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    const URL = `${import.meta.env.VITE_SERVER_URL}/api/email`

    try {
      const res = await axios.post(URL, data)

      toast.success(res?.data?.message)

      if (res.data.success) {
        setData({ email: '' })

        navigate('/password', { state: res?.data?.message })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <PiUserCircle size={80} />
        </div>
        <h3>Welcome to Chat App!</h3>
        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              name="email"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Lets Go
          </button>
        </form>
        <p className="my-3 text-center">
          New User ?{' '}
          <Link to={'/register'} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default CheckEmail
