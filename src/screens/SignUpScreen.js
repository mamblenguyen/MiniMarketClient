import React, { useState } from 'react'
import Bounce from 'react-reveal/Bounce'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import Button from '../components/Form/Button'
import GoogleSignIn from '../components/Form/GoogleSignIn'
import TextField from '../components/Form/TextField'
// import useAuth from '../hooks/useAuth'
import swal from 'sweetalert';

const SignUpScreen = () => {
    const [userInput, setUserInput] = useState({
        fullname: '',
        email: '',
        phone: '',
        password: '',
    })
    // const { signUpUser } = useAuth()

    //form inputs
    const Inputs = [
  { id: 1, type: "text", placeholder: "Name", value: userInput.fullname, name: 'fullname' },
  { id: 2, type: "text", placeholder: "Phone", value: userInput.phone, name: 'phone' }, // sửa name
  { id: 3, type: "email", placeholder: "Email", value: userInput.email, name: 'email' },
  { id: 4, type: "password", placeholder: "Password", value: userInput.password, name: 'password' },
]
const signUpUser = async (email, password, fullname, phone) => {
  try {
    const res = await fetch('${baseUrl}/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, fullname, phone })
    });
    const data = await res.json();
    if (res.ok) {
      return data; 
    } else {
      throw new Error(data.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

    //handle change 
    const handleChange = (e) => {
        const { value, name } = e.target;
        setUserInput(prev => {
            return {
                ...prev,
                [name]: value
            }
        })

    }
    const navigate = useNavigate();

    //handle submit form 
   const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   const data = await signUpUser(userInput.email, userInput.password, userInput.fullname, userInput.phone);
   console.log(data);
   
    if (data.data.refreshToken) {
    localStorage.setItem('accessToken', data.data.refreshToken);
localStorage.setItem('refreshToken', data.data.refreshToken); 
      swal("Welcome back!", "Signed in successfully", "success");

   navigate('/');
    window.location.reload();
  } 
}catch (error) {
    alert(error.message);
  }
};

    return (
        <main className="h-screen w-full banner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                {/* form  */}
                <Bounce left>
                    <div className="flex flex-col justify-center items-center h-screen">
                        {/* logo  */}
                        <Brand />
                        {/* sign up form  */}
                        <form className="bg-white w-96 mt-6 p-4 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-6">
                                {Inputs.map(input => (
                                    <TextField
                                        key={input.id}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        value={input.value}
                                        name={input.name}
                                        onChange={handleChange}
                                    />
                                ))}
                            </div>
                            <Button text="Sign Up" />
                            <Link to="/signin">
                                <p className="text-base text-primary text-center my-6 hover:underline">Already have an account ?</p>
                            </Link>

                            <GoogleSignIn text="Sign Up With Google" />
                        </form>
                    </div>
                </Bounce>

                {/* imagee  */}
                <Bounce right>
                    <div className="hidden md:flex lg:flex flex-col justify-center items-center w-full h-screen">
                        <img className="w-4/4 mx-auto" src="../../assets/signup.png" alt="signup" />
                    </div>
                </Bounce>
            </div>
        </main>
    )
}

export default SignUpScreen
