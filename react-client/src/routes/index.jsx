import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import MessagePage from '../components/MessagePage'
import AuthLayouts from '../layout'
import CheckEmail from '../pages/CheckEmail'
import CheckPassword from '../pages/CheckPassword'
import ForgotPassword from '../pages/ForgotPassword'
import Home from '../pages/Home'
import Register from '../pages/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: (
          <AuthLayouts>
            <Register />
          </AuthLayouts>
        ),
      },
      {
        path: 'email',
        element: (
          <AuthLayouts>
            <CheckEmail />
          </AuthLayouts>
        ),
      },
      {
        path: 'password',
        element: (
          <AuthLayouts>
            <CheckPassword />
          </AuthLayouts>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <AuthLayouts>
            <ForgotPassword />
          </AuthLayouts>
        ),
      },
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: ':userId',
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
])

export default router