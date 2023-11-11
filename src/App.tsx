import { createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/home";
import { CarDetails } from "./pages/car";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { EditCar } from "./pages/dashboard/edit";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ErrorPage } from "./pages/error";

import { Layout } from "./components/layout";

import { Private } from "./routes/Private";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/car/:id",
        element: <CarDetails />,
      },
      {
        path: "/dashboard",
        element: (
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Private>
            <New />
          </Private>
        ),
      },
      {
        path: "/dashboard/edit/:id",
        element: (
          <Private>
            <EditCar />
          </Private>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export { router };
