import { useState } from 'react'
import './App.css'

import Home from './Home.jsx'
import Nutrition from './nutrition/Nutrition.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
      <Nutrition />
  )
}

export default App
