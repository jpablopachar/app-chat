import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    image: ''
  })

  const [uploadPhoto, setUploadPhoto] = useState('')

  const navigate = useNavigate()

  const handleOnChange = (event) => {
    const { name, value } = event.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0]
    const uploadPhoto = await uploadFile(file)

    setUploadPhoto(file)

    setData((prev) => {
      return {
        ...prev,
        image: uploadPhoto?.url
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
          image: ''
        })

        navigate('/email')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div>Register</div>
  )
}

export default Register