import React, { useState } from "react";
import Bounce from "react-reveal/Bounce";
import { Link, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import Button from "../components/Form/Button";
import GoogleSignIn from "../components/Form/GoogleSignIn";
import TextField from "../components/Form/TextField";
import useAuth from "../hooks/useAuth";
import swal from "sweetalert";
    const baseUrl = process.env.REACT_APP_API_BASE_URL;

const SignInScreen = () => {
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInput.email,
          password: userInput.password,
          device: "mobile",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
       swal({
        title: "Xin chúc mừng",
        text: "Bạn đã đăng nhập thành công",
        icon: "success",
        buttons: {
          confirm: "OK",
        },
      }).then((willDelete) => {
        if (willDelete) {
          window.location.href = "/";
        }
      });
    } catch (error) {
      swal("Oops!", error.message, "error");
    }
  };

  return (
    <main className="h-screen w-full banner">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Bounce left>
          <div className="hidden md:flex justify-center items-center h-screen">
            <img
              className="w-full"
              src="../../assets/signin.png"
              alt="signin"
            />
          </div>
        </Bounce>

        <Bounce right>
          <div className="flex flex-col justify-center items-center h-screen">
            <Brand />
            <form
              className="bg-white w-3/5 mt-6 p-4 rounded-lg shadow-lg"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col space-y-6">
                <TextField
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={userInput.email}
                  onChange={handleChange}
                />
                <TextField
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={userInput.password}
                  onChange={handleChange}
                />
              </div>

              <Button text="Sign In" />
              <Link to="/signup">
                <p className="text-base text-primary text-center my-6 hover:underline">
                  Need an account?
                </p>
              </Link>
              <GoogleSignIn
                text="Sign In With Google"
                onClick={signInWithGoogle}
              />
            </form>
          </div>
        </Bounce>
      </div>
    </main>
  );
};

export default SignInScreen;
