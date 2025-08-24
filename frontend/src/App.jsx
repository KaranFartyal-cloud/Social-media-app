import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/mainLayout";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";


const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,//this guy will remain constant in its children
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />
      },
      
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
