// import Home from './Home.js'

import Home from './routes/home.jsx'
import Time from './routes/time.jsx'
import Money from './routes/money.jsx'
import Social from './routes/social.jsx'
import Datasheet from './routes/datasheet.jsx'

import {
       createBrowserRouter,
       RouterProvider,
} from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
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
