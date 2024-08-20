// import Home from './Home.js'

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
      path: "/time",
      element: <Time />,
    },
    {
      path: "/money",
      element: <Money />,
    },
    {
      path: "/social",
      element: <Social />,
    },
    {
      path: "/datasheet",
      element: <Datasheet />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
