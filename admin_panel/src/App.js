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
import Multivenuesone from "./page/Multivenuesone";

//meals
import Meals from "./page/Meals";
import Dockets from "./page/Dockets";

//admin
import Adminpage from "./page/Adminpage";
import Admin_dash from "./page/Admin_dash";
import Multi_venue from "./page/Multi_venue";
import Mealsmulti from "./page/Mealsmulti";

//tra
import Training from "./page/Training";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
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
        <Route path="/multivenues" element={<Multi_venue />} />

        <Route path="/multivenue" element={<Multivenuesone />} />

        <Route path="/training" element={<Training />} />

        <Route path="/multivenuesmeals" element={<Mealsmulti />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
