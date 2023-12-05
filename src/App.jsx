import Main from "./contents/Main";
import Home from "./contents/Home"

import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="*" element={<Main></Main>}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
