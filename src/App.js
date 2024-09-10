// import Home from './Home.js'

import NavBar from './component/NavBar.js'

import Home from './routes/home.jsx'
import Excercise from './routes/excercise.jsx'
import Nutrition from './routes/nutrition.jsx'
import Time from './routes/time.jsx'
import Money from './routes/money.jsx'
import Social from './routes/social.jsx'
import Datasheet from './routes/datasheet.jsx'

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

function App() {

  const router = createHashRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/excercise",
      element: <Excercise />,
    },
    {
      path: "/nutrition",
      element: <Nutrition />,
    },
    {
      path: "/health-stats",
      element: <Nutrition />,
    },
    {
      path: "/calendar",
      element: <Time />,
    },
    {
      path: "/productivity",
      element: <Time />,
    },
    {
      path: "/social",
      element: <Social />,
    },
    {
      path: "/money",
      element: <Money />,
    },
    {
      path: "/datasheet",
      element: <Datasheet />,
    },
  ]);

  return (
    <div>
      <NavBar />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
