import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    image: '',
  })

  const [uploadPhoto, setUploadPhoto] = useState('')

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

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0]
    // const uploadPhoto = await uploadFile(file)
    const uploadPhoto = ""

    setUploadPhoto(file)

    setData((prev) => {
      return {
        ...prev,
        image: uploadPhoto?.url,
      }
    })
  }

  const handleCleanUploadPhoto = (event) => {
    event.stopPropagation()
    event.preventDefault()

    setUploadPhoto(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const res = await axios.post(URL, data)
      console.log(res)
      toast.success(res.data.message)

      if (res.data.success) {
        setData({
          name: '',
          email: '',
          password: '',
          image: '',
        })

        navigate('/email')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat app!</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              placeholder="Enter your name"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="image">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name ? uploadPhoto?.name : 'Upload your photo'}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleCleanUploadPhoto}
                  ></button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have account ?{' '}
          <Link to={'/email'} className="hover:text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
