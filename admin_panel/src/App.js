import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import NoPage from "./page/nopge"; 

//rent
import UserRent from "./page/UserRent";
import Login from "./page/Login";
import SinglrandMulti from "./page/SinglrandMulti";
import Multivenues from "./page/Multivenues";
import Singlevenues from "./page/Singlevenues";
import Forgetpassword from "./page/Forgetpassword";

//meals
import Meals from "./page/Meals";
import Dockets from "./page/Dockets";

//admin
import Adminpage from "./page/Adminpage";
import Admin_dash from "./page/Admin_dash";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRent />} />   
        <Route path="*" element={<NoPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/grantedaccess" element={<SinglrandMulti />} />
        <Route path="/analytics" element={<Multivenues />} />
        <Route path="/singlevenues" element={<Singlevenues />} /> 
        <Route path="/forgetpassword" element={<Forgetpassword />} /> 

        <Route path="/meals" element={<Meals />} />
        <Route path="/dockets" element={<Dockets />} />

        <Route path="/admin" element={<Adminpage />} />
        <Route path="/dashboard" element={<Admin_dash />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
