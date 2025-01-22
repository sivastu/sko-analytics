import React, { useEffect, useState } from "react";
import Header from "../component/Header"; 
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";

let Login = () => {
  let [data, setData] = useState(); 

  

  return (
    <div> 
        <Header />
       
    </div>
  );
};

export default Login;
