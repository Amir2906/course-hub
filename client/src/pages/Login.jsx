import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store';
import {useSnackbar} from 'notistack'
import Spinner from '../components/Loading';
import Footer from '../components/Footer';


const Login = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginLoading = useSelector((state) => state.coursehub.loginLoading);
  const { enqueueSnackbar } = useSnackbar();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formValues;
      if(!email || !password)
        enqueueSnackbar("Email and Password are required.", {variant: 'error'});
        
      else if (email && password)
        dispatch(loginUser({ email, password }))
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(loginLoading === 'rejected') {
      enqueueSnackbar("Enter valid Email or Password.", {variant: 'error'});
    }
    else if(loginLoading === 'pending') {
      // enqueueSnackbar("Loading...", {variant: 'error'});
      <Spinner />
    }
    else if(loginLoading === 'success') {
      enqueueSnackbar("Login Successfull", {variant: 'success'});
      navigate('/');
    }
  }, [loginLoading])

  return (
    <div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name='email'
                placeholder="Enter your email"
                className="w-full border rounded-md p-2"
                id="email"
                required
                value={formValues.email}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name='password'
                placeholder="Enter your password"
                className="w-full border rounded-md p-2"
                id="password"
                required
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value
                  })
                }
              />
            </div>
            <button
              onClick={handleLogIn}
              className="bg-blue-500 text-white w-full rounded-md py-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  )
}

export default Login
