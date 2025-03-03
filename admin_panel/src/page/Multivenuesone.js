import React, { useEffect, useState , useContext } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers"

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import * as CryptoJS from 'crypto-js'
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from "firebase/database";
import app from "./firebase";
import { DataContext } from "../component/DataProvider";


let Multivenuesone = () => {
  let [data, setData] = useState();
  let navigate = useNavigate();
 const { state } = useContext(DataContext);

  useEffect(() => {
    loginCheck(state?.user)
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

  let loginCheck = async (snapshot) => {
    let getdata = sessionStorage.getItem('data')
    if (getdata === undefined || getdata === '' || getdata === null) {
      sessionStorage.removeItem('data')
      navigate('/')
      return
    }
    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)
  let name = getName(parsedatajson)
    setUsedname(name) 
 
      const userData = snapshot 

      // Check if the password matches
      const foundUser = Object.values(userData).find(user => user.Email === parsedatajson.Email);

      if (foundUser) {
        if(foundUser.Role === 'emp'){
          sessionStorage.removeItem('data')
          navigate('/')
          return
        }
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

  const [boxWidth, setBoxWidth] = useState(window.innerWidth >= 1400 ? 27 : window.innerWidth >= 1024 ? 40 : 60);
  const [imageWidth, setImageWidth] = useState(window.innerWidth >= 1400 ? 100 : window.innerWidth >= 1024 ? 80 : 70);

  useEffect(() => {
    const handleResize = () => {
      setBoxWidth(window.innerWidth >= 1400 ? 27 : window.innerWidth >= 1024 ? 40 : 60);
      setImageWidth(window.innerWidth >= 1400 ? 100 : window.innerWidth >= 1024 ? 80 : 70);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div style={{overflow:"hidden"}} >
      <div style={{ scrollbarWidth: 'none' }}>

      
        <div className="" style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="row justify-content-between " style={{ paddingLeft: '2%', paddingRight: '2%', height: 52 }}>

            <div style={{ padding: 13 }} className="d-flex col"
             onClick={() => {
              navigate(-1)
            }}  >
            <img src="arrow.png" style={{ width: 20, height: 20 ,marginTop:3}} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >MULTI VENUES</p>
            </div>
            <div style={{ padding: 13 }} className="d-flex text-center justify-content-center col" >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: 0, marginTop:-3 }} >
                {usedname}
                </p>
            </div>

            <div style={{ padding: 13 }} className="d-flex  justify-content-end col" >
              <img src="Menu_Logo.png" style={{ width: 56, height: 28 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: 0 }} >analytics</p>
            </div>

          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#525659", height: '100vh' }} >

        <div > 
          <div className="" style={{
            backgroundImage: "url('asd9.jpg')", height: '100vh', padding: 0, display: 'grid', alignItems: 'end',
            backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'
          }} >


            <div style={{ padding: 90 }} >
              <div style={{ width: `${boxWidth}%`, height: 190, backgroundColor: '#fff', borderRadius: 5, cursor: 'pointer' }} onClick={() => {
                navigate("/multivenuesmeals");
              }} >
                <div className="row" style={{ height: 190,margin:"0 5px" }}>
                  <div className="col-6 d-flex align-items-center" style={{ padding: 35 }}>
                    <p style={{ fontSize: 35, fontWeight: '400', lineHeight: 1.3, color: '#000', margin: 0 }}>
                      Meals
                    </p>
                  </div>
                  <div className="col-6 d-flex align-items-center justify-content-end" style={{ padding: 45 }}>
                    <img src="asd7.png" alt="Example Image" style={{ width: imageWidth, height: imageWidth  }} />
                  </div>
                </div>
              </div>

              <div style={{ width: `${boxWidth}%`, height: 190, backgroundColor: '#fff', marginTop: 20, borderRadius: 5, marginBottom: 50, cursor: 'pointer' }}
                onClick={() => {
                  navigate("/multivenues");
                }} >
              <div className="row" style={{ height: 180,margin:"0 5px" }} >
                  {/* Left column - centered text */}
                  <div className="col-6 d-flex align-items-center" style={{ padding: 35 }}>
                    

                    <p style={{ fontSize: 35, fontWeight: '400', lineHeight: 1.3, color: '#000', margin: 0 }}>
                    Dockets
                    </p>
                  </div>

                  {/* Right column - aligned image */}
                  <div className="col-6 d-flex align-items-center justify-content-end" style={{ padding: 45 }}>
                    <img src="asd6.png" alt="Example Image" style={{ width: imageWidth, height: `${imageWidth - 20}px` }} />
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

export default Multivenuesone;
