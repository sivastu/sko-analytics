import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers"
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";

let Singlevenues = () => {
  let [data, setData] = useState();

  return (
    <div>
      <Headers />
      <div style={{ backgroundColor: "#525659", height: '100vh' }} >

        <div className="container" style={{ backgroundImage: "url('asd5.png')", height: '100vh', padding: 0 , display : 'grid' , alignItems : 'end' ,
          backgroundRepeat : "no-repeat"
          }} >


          <div style={{ padding : 20 }} >
          <div style={{ width: 300, height: 112, backgroundColor: '#fff', borderRadius: 5 }} >
            <div className="row" >
              <div className="col-6" style={{ padding: 35 }} >
                <p style={{ fontSize: 35, fontWeight: '500', lineHeight: 1.3 , color : '#000' }} >Meals</p>
              </div>
              <div className="col-6" style={{ padding: 30 }} >
                <img src="asd7.png" alt="Example Image" />
              </div>
            </div>
          </div>

          <div style={{ width: 300, height: 112, backgroundColor: '#fff', marginTop: 20, borderRadius: 5 , marginBottom : 50 }} >
            <div className="row" >
              <div className="col-6" style={{ padding: 35 }} >
                <p style={{ fontSize: 35, fontWeight: '500', lineHeight: 1.3 , color : '#000' }} >Dockets</p>
              </div>
              <div className="col-6" style={{ padding: 40 }} >
                <img src="asd6.png" alt="Example Image" />
              </div>
            </div>
          </div>
          </div>


         

        </div>

      </div>
    </div>
  );
};

export default Singlevenues;
