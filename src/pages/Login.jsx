import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../asset/image.jpeg';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate credentials
    if (username === "user" && password === "1234") {
      console.log("Login successful with:", { username, password });
      navigate("/main"); // Redirect to MainComponent
    } else {
      alert("Invalid credentials. Please use username: 'user' and password: '1234'.");
    }
  };

  const handleGuestLogin = () => {
    console.log("Guest login");
    navigate("/main"); // Redirect to MainComponent
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-black via-gray-900 to-black p-4 font-montserrat">
      <h1 className="text-4xl font-bold text-white mb-8">Srpski AI</h1>
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 rounded-3xl shadow-2xl flex flex-col-reverse md:flex-row w-full max-w-[900px] border border-gray-800 gap-6">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center md:text-left">
            Welcome Back!
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Username Field */}
              <div className="relative">
                <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full p-2 bg-gray-800 border-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Username" /*user*/
                />
              </div>
              {/* Password Field */}
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-2 bg-gray-800 border-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Password" /*1234*/
                />
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 mb-4">OR</p>
            {/* Login with Google Button */}
            <button
              className="w-full border border-gray-700 p-2 rounded-lg flex items-center justify-center gap-2 text-white hover:bg-gray-800 mb-2"
            >
              <i className="fab fa-google text-[#4285F4]"></i>
              Login with Google
            </button>
            {/* Guest Login Button */}
            <button
              onClick={handleGuestLogin}
              className="w-full border border-gray-700 p-2 rounded-lg flex items-center justify-center gap-2 text-white hover:bg-gray-800"
            >
              Guest Login
            </button>
          </div>

          {/* Navigate to Register */}
          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer hover:text-blue-400"
              onClick={() => navigate("/register")}
            >
              Create One!
            </span>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 h-[200px] md:h-auto">
          <img
            src={image}
            alt="Futuristic robot with glowing elements in dark atmosphere"
            className="w-full h-full object-cover rounded-2xl opacity-80"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
