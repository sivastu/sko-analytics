import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Base_url } from "../config";

let Headers = (props) => {
  let [datas, setDatas] = useState()
  let navigate = useNavigate();


  const [isFourToFivePM, setIsFourToFivePM] = useState(false);

  // Function to check the current time
  const checkTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours === 16 && minutes >= 0 && minutes < 60) {
      setIsFourToFivePM(true);
    } else {
      setIsFourToFivePM(false);
    }
  };

  useEffect(() => {


    console.log(props, 'probddddd')

  }, [])



  return (
    <div style={{ scrollbarWidth: 'none' }}>

      <div style={{
        height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
        // border: "1px solid #dbdbdb"
      }} >
        <div className="d-flex justify-content-between " style={{ paddingLeft : '2%' , paddingRight : '2%' }}>
          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
            {
              props?.name ?
                <>

                  <img style={{ width: 16, height: 16, marginRight: 10 }} src="arrow.png" alt="Example Image" onClick={()=>{
                    navigate(-1)
                  }} />
                  <p style={{ display: "contents", color: '#fff', fontWeight: '600', marginLeft: 20 }} >{props?.name}</p>
                </>

                : ''
            }
          </div>

          <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
            {
              props?.center ?
                <>
                  <p style={{ display: "contents", color: '#fff', fontWeight: '600', marginLeft: 20 }} >{props?.center}</p>
                </>

                : ''
            }
          </div>

          <div style={{ padding: 13 }} >
            <img src="zx1.png" alt="Example Image" />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Headers;
