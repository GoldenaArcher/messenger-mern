import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/messenger/login" element={<Login />} />
          <Route path="/messenger/register" element={<Register />} />
          <Route path="/" element={<Messenger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
