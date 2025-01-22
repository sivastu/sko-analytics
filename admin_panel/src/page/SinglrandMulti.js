import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";

let SinglrandMulti = () => {
  let [data, setData] = useState();
  let navigate = useNavigate();


  return (
    <div>
      <Header />
      <div style={{ backgroundColor: "#525659", height: '100vh' }} >
 
        <div className="container" style={{ backgroundImage: "url('backs.jpg')", height: '100vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('back.png')", height: '100%', backgroundSize: "contain",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", display: 'grid', alignContent: "center"
          }} >

            <div style={{ width: 552, height: 132, backgroundColor: "#F3F3F3", borderRadius: 7, cursor : 'pointer'  }} 
            onClick={()=>{ navigate("/singlevenues"); }}
            >
              <div className="row">
                <div className="col-6">
                  <img style={{ width: '100%' }} src="as1.png" alt="Example Image" />
                </div>
                <div className="col-6">
                  <div className="row" >
                    <div className="col-6" style={{ padding: 24 }} >
                      <p style={{ fontSize: 35, fontWeight: '500', lineHeight: 1.3 }} >Single
                        Venue</p>
                    </div>
                    <div className="col-6" style={{ padding: 40 }} >
                      <img src="asd.png" alt="Example Image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ width: 552, height: 132, backgroundColor: "#F3F3F3", borderRadius: 7, marginTop: 50 , cursor : 'pointer' }}
            onClick={()=>{ navigate("/multivenues"); }} >
              <div className="row">
                <div className="col-6">
                  <img style={{ width: '100%' }} src="as2.png" alt="Example Image" />
                </div>
                <div className="col-6">
                <div className="row" >
                    <div className="col-6" style={{ padding: 24 }} >
                      <p style={{ fontSize: 35, fontWeight: '500', lineHeight: 1.3 }} >Multi Venues</p>
                    </div>
                    <div className="col-6" style={{ padding: 40 }} >
                      <img src="asd1.png" alt="Example Image" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SinglrandMulti;
