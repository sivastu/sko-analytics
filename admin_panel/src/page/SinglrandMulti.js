import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import Headers from "../component/Headers"
import * as CryptoJS from 'crypto-js'
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from "firebase/database";
import app from "./firebase";
import SweetAlert2 from 'react-sweetalert2';


let SinglrandMulti = () => {
  let [data, setData] = useState();
  let navigate = useNavigate();
  const [swalProps, setSwalProps] = useState({ show: false });

  useEffect(() => {
    loginCheck()
  }, [])
 

    let [usedname, setUsedname] = useState('')
    function getName(data) {
      if (!data.venue || data.venue.length === 0) {
          return data.name; // Default to name if venue is missing or empty
      }
  
      const hasAll = data.venue.some(v => v.value === "All");
  
      if (hasAll && data.venue.length > 1) {
          return data.name;
      } else if (data.venue.length === 1 && !hasAll) {
          return data.venue[0].value;
      }
  
      return data.name;
  }
  
  

  let loginCheck = async () => {
    let getdata = localStorage.getItem('data')
    if (getdata === undefined || getdata === '' || getdata === null) {
      navigate('/')
      return
    }
    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)
let name = getName(parsedatajson)
    setUsedname(name)
    const db = getDatabase(app);
    const newDocRef = ref(db, `user`);

    const snapshot = await get(newDocRef); // Fetch the data for the user

    if (snapshot.exists()) {
      const userData = snapshot.val();

      // Check if the password matches
      const foundUser = Object.values(userData).find(user => user.Email === parsedatajson.Email);

      if (foundUser) {
        // Check if the password matches
        if (foundUser.Password === parsedatajson.password) {
          navigate('/')
          return
        } else {

        }
      } else {
        console.log("User does not exist.");
      }
    }
  }



  const encrypt = (plainText) => {
    const cipherText = CryptoJS.AES.encrypt(plainText, 'secretKey').toString()
    console.log(cipherText, 'cipherText')
    return cipherText
  }

  const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, 'secretKey')
    const plainText = bytes.toString(CryptoJS.enc.Utf8)
    return plainText

  }


  return (
    <div>
      <div style={{ scrollbarWidth: 'none' }}>

        <div style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="d-flex justify-content-between " style={{ paddingLeft: '2%', paddingRight: '2%' }}>
            <div style={{ padding: 17, }} className="d-flex" onClick={() => {
              navigate(-1)
            }} >
              <img src="arrow.png" style={{ width: 20, height: 20 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -7 }} >web portal</p>
            </div>

            <div style={{ padding: 13, }} >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginTop: -3 }} >{usedname}</p>
            </div>

            <div style={{ padding: 13 }}  className="d-flex" >

            <img src="newlogo.png" style={{ width: 40, height: 22 }} alt="Example Image" />
            <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >analytics</p>
            </div>

          </div>
        </div>

      </div>
      <div style={{ backgroundColor: "#313233", height: '100vh' }} >





        <div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '100vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('finefine.png')", height: '100%', backgroundSize: "230vh",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", backgroundColor: "#313233", flexDirection: 'column', gap: '4%', display: 'flex'
          }} >

            <div
              style={{
                width: 752,
                backgroundColor: "#F3F3F3",
                borderRadius: 7,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                navigate("/analytics");
              }}
            >
              <div className="row w-100 gvdfvdf" >
                <div className="col-6 d-flex align-items-center justify-content-center">
                  <img style={{ width: "100%" }} src="as2.png" alt="Example Image" />
                </div>
                <div className="col-6 d-flex align-items-center justify-content-center">
                  <div className="row w-100">
                    <div
                      className="col-6 d-flex align-items-center justify-content-center"
                      style={{ padding: 24 }}
                    >
                      <p style={{ fontSize: 35, fontWeight: "500", lineHeight: 1.3, color: '#1A1A1B', marginTop: 15 }}>
                        Single Venue
                      </p>
                    </div>
                    <div
                      className="col-6 d-flex align-items-center justify-content-center"
                      style={{ padding: 40 }}
                    >
                      <img src="asd.png" alt="Example Image" style={{ width: 100, height: 100 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div
              style={{
                width: 752,
                backgroundColor: "#F3F3F3",
                borderRadius: 7,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                navigate('/multivenue')
              }}
            >
              <div className="row w-100 gvdfvdf" >
                <div className="col-6 d-flex align-items-center justify-content-center">
                  <img style={{ width: "100%" }} src="as1.png" alt="Example Image" />
                </div>
                <div className="col-6 d-flex align-items-center justify-content-center">
                  <div className="row w-100">
                    <div
                      className="col-6 d-flex align-items-center justify-content-center"
                      style={{ padding: 24 }}
                    >
                      <p style={{ fontSize: 35, fontWeight: "500", lineHeight: 1.3, color: '#1A1A1B', marginTop: 15 }}>
                        Multi Venues
                      </p>
                    </div>
                    <div
                      className="col-6 d-flex align-items-center justify-content-center"
                      style={{ padding: 40 }}
                    >
                      <img src="asd1.png" alt="Example Image" style={{ width: 100, height: 100 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <SweetAlert2 {...swalProps} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SinglrandMulti;
