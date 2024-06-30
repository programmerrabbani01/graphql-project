import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

// create public router

const publicRouter = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

// export router

export default publicRouter;
