import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useBackendUrl } from "../context/backendContext";
import { motion, AnimatePresence } from "framer-motion";

const slideshowImages = [
  "https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=687&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1661715817028-818d78a4e8e5?q=80&w=687&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1530047139082-5435ca3c4614?q=80&w=1470&auto=format&fit=crop",
  "https://plus.unsplash.com/premium_photo-1664874602639-977e8c682917?q=80&w=765&auto=format&fit=crop",
];

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  const { user } = useSelector((store) => store.auth);
  const backendURL = useBackendUrl();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const config = { headers: { "Content-Type": "application/json" } };

      const { data } = await axios.post(
        `${backendURL}/api/v1/user/register`,
        { username, email, password },
        config
      );

      toast.success("🎉 Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed");
      console.error(error.response?.data || error.message);
    } finally {
      setUsername("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, []);

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideshowImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex w-full bg-white rounded-2xl shadow-xl overflow-hidden h-screen">

        {/* Left Slideshow */}
        <div className="hidden md:flex w-[40%] h-full relative bg-black">
          <AnimatePresence>
            <motion.img
              key={slideshowImages[current]}
              src={slideshowImages[current]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                duration: 1.4,
                ease: "easeInOut",
              }}
              className="absolute inset-0 w-full h-full object-cover rounded-l-2xl"
            />
          </AnimatePresence>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-[60%] p-10 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="https://res.cloudinary.com/dsixpdfy7/image/upload/v1757101035/qzhrrira7nfu8thtlrfd.png"
              className="h-20 w-20 object-contain"
              alt="Logo"
            />
          </div>

          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="johndoe"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {loading ? (
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg">
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg"
              >
                Sign Up
              </Button>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <span className="mx-2">Already have an account?</span>
            <Link to={"/login"} className="text-blue-700 font-medium">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
