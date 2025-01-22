import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer"; 
import app from "./firebase";
import { getDatabase, ref, set, push , get } from "firebase/database";

let UserRent = () => {

  let [data, setData] = useState();

  useEffect(()=>{ 

    let getData = async () =>{ 

      console.log('resssssssssssssss')
    }

    getData()

  },[])


  const saveData = async () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "nature/fruits"));
    set(newDocRef, {
      fruitName: 'inputValue1',
      fruitDefinition: 'inputValue2'
    }).then( () => {
      alert("data saved successfully")
    }).catch((error) => {
      alert("error: ", error.message);
    })
  }

  let fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "Data/BFG-Barefoot-Kitchen-2024");
    const snapshot = await get(dbRef);
    if(snapshot.exists()) {

      console.log(Object.values(snapshot.val()) , 'snapshot') 
    } else {
      alert("error");
    }
    
  }


  return (
    <div>
      <Header />
      <div style={{ backgroundColor: "#525659", height: '100vh' }} >



        <div className="container" style={{ backgroundImage: "url('backs.jpg')", height: '100vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('back.png')", height: '100%', backgroundSize: "contain",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", display: 'flex'
          }} >

            <div style={{ width: 550, height: 276, backgroundColor: "#F3F3F3", borderRadius: 7,     }} >

            <div className="kjok" style={{ marginTop : '13%' }} > 
              <div className="d-flex justify-content-around" >
                <p style={{ color: '#1A1A1B', fontSize: 21, fontWeight: '500', }} >Username:</p>
                <input style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="text" />
              </div>

              
                <div className="d-flex justify-content-around mt-3" >
                  <p style={{ color: '#1A1A1B', fontSize: 21, fontWeight: '500', }}>Password:</p>
                  <input  style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="text" />
                </div>
                <p style={{ color: "#707070", fontSize: 15, fontWeight: '500' , textAlign : 'right' , marginRight : 40 , marginTop : 3 }} >Reset password?</p>
              </div>


              {/* <button onClick={()=>{ saveData() }} >Submit</button>
              <button onClick={()=>{ fetchData() }} >get</button> */}



            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRent;
