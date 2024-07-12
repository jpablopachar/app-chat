import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import uploadFile from '../helpers/uploadFile.js'
import { setUser } from '../redux/userSlice.js'
import Avatar from './Avatar.jsx'
import Divider from './Divider.jsx'

const EditUserDetail = ({ onClose, user }) => {
  const [data, setData] = useState({ name: user?.user, image: user?.image })

  const uploadPhotoRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    setData((prev) => ({ ...prev, ...user }))
  }, [user])

  const handleOnChange = (event) => {
    const { name, value } = event.target

    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOpenUploadPhoto = (event) => {
    event.preventDefault()
    event.stopPropagation()

    uploadPhotoRef.current.click()
  }

  const handleUploadPhoto = async (event) => {
    const file = event.target.files[0]
    const uploadPhoto = await uploadFile(file)

    setData((prev) => ({ ...prev, image: uploadPhoto?.url }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const URL = `${import.meta.env.VITE_SERVER_URL}/api/update-user`

      const res = await axios({
        method: 'post',
        url: URL,
        data: data,
        withCredentials: true,
      })

      toast.success(res.data?.message)

      if (res.data?.success) {
        dispatch(setUser(res.data?.data))

        onClose()
      }
    } catch (error) {
      console.log('error: ', error)

      toast.error()
    }
  }
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm ">Edit user details</p>
        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-primary border-0.5"
            />
          </div>
          <div>
            <div>Photo:</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button
                  className="font-semibold"
                  onClick={handleOpenUploadPhoto}
                >
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>
          <Divider />
          <div className="flex gap-2 w-fit ml-auto ">
            <button
              onClick={onClose}
              className="border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserDetail
