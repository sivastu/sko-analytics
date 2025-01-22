import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";

let Meals = () => {
  let [data, setData] = useState();

  return (
    <div>
      <Header name={"Meals"} center={"Name"} />
      <div style={{ backgroundColor: "#DADADA", height: '100vh' }} >

        <div className="container" style={{}} >


          <div className="d-flex justify-content-between container pt-4" >

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen range:<span style={{ fontWeight: '400' }}> Custom</span></p>

              <select id="dropdown" value={'selectedValue'} onChange={()=>{
                
              }}>
                <option value="" disabled>
                  Select an option
                </option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </select>
            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Compare with:<span style={{ fontWeight: '400' }}> Custom</span></p>
            </div>


            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen venue & hub</p>
            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by stages/courses</p>
            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by tables/takeaways</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Meals;
