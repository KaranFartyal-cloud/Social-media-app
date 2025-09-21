import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "https://backend-wrbx.onrender.com/api/v1/user/register",
        {
          username,
          email,
          password,
        },
        config
      );

      console.log(data);

      toast.success("🎉 Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error(`signup failed`);
      console.error(error.response?.data || error.message);
    } finally {
      setEmail("");
      setUsername("");
      setPassword("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          LOGO
        </h2> */}
        <div className="flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dsixpdfy7/image/upload/v1757101035/qzhrrira7nfu8thtlrfd.png"
            className="h-30 w-30"
            alt="logo"
          />
        </div>

        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
              placeholder="johnDoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none transition-all"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg  outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {loading ? (
            <>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                <Loader2 />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Sign Up
              </Button>
            </>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span className="mx-2">Already have an account?</span>
          <span className="text-blue-700 ">
            {" "}
            <Link to={"/login"}>Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
