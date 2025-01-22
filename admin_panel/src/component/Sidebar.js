import React , {useEffect , useState } from "react";
import axios from "axios";
import { Base_url } from "../config";
import { AesDecrypt } from "../middleware/AesDecrypt";
import { AesEncrypt } from "../middleware/AesEncrypt";

let Sidebar = () => {

    let Payment = () =>{

    }

  return (
    <>
      <div
        style={{
          padding: 20, 
          width: "100%",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <p onClick={()=>{
            Payment()
        }}>Payment</p>
      </div>
      
    </>
  );
};

export default Sidebar;
