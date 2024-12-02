import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from '../asset/image.jpeg';

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registered with:", { username, email, password });
    // Add registration logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 font-montserrat">
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold text-white">Srpski AI</h1>
      </div>
      <div className="flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-8 rounded-3xl shadow-2xl flex flex-col-reverse md:flex-row w-full max-w-[900px] border border-gray-800 gap-6">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center md:text-left">
              Create Account
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 w-full p-2 bg-gray-800 border-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 text-white"
                      placeholder="Username"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full p-2 bg-gray-800 border-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 text-white"
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-3 text-gray-400"></i>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 w-full p-2 bg-gray-800 border-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 text-white"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </button>
              </div>
            </form>
            <p className="text-center text-gray-400 mt-4">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-400"
                onClick={() => navigate("/")}
              >
                Sign in
              </span>
            </p>
          </div>

          <div className="w-full md:w-1/2 h-[200px] md:h-auto">
            <img
              src={image}
              alt="Futuristic robot with glowing elements in dark atmosphere"
              className="w-full h-full object-cover rounded-2xl opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
