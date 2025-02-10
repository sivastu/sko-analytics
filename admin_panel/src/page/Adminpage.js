import React, { useEffect, useState, useRef } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers"
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import app from "./firebase";
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from "firebase/database";
import SweetAlert2 from 'react-sweetalert2';
import * as CryptoJS from 'crypto-js'

let Adminpage = () => {

  let [data, setData] = useState();
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input1Ref = useRef(null);
  const [value, setValue] = useState('');
  const [swalProps, setSwalProps] = useState({ show: false });


  let [username, setUsername] = useState()
  let [password, setPassword] = useState()

  let [forget, setForget] = useState(false)
  let [forgetvalue, setForgetvalse] = useState('')


  useEffect(() => {
    loginCheck()
  }, [])

  let loginCheck = async () => {
    let getdata = localStorage.getItem('data')
    if (getdata === undefined || getdata === '' || getdata === null) {
      navigate('/')
      return
    }
    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)

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



  let navigate = useNavigate();


  return (
    <div>
      <div style={{ scrollbarWidth: 'none' }}>

        <div style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="d-flex justify-content-between" style={{ paddingLeft: '2%', paddingRight: '2%', height: 52 }}>

            <div style={{ padding: 13 }} className="d-flex" >
            </div>
            <div style={{ padding: 13 , width : 400 }} className="d-flex" >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: '50%', marginTop: -3 }} >(Group Name)</p>
            </div>

            <div style={{ padding: 13 }} className="d-flex" >
              <img src="newlogo.png" style={{ width: 40, height: 22 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >knowledge</p>
            </div>

          </div>
        </div>

      </div>
      <div style={{ backgroundColor: "#313233", height: '100vh' }} >





        <div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '100vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('finefine.png')", height: '100%', backgroundSize: "230vh",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", backgroundColor: "#313233", flexDirection: 'column', gap: '4%' , display : 'flex'
          }} >

            <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7,  cursor : 'pointer' }} >

              <div className="row" style={{ padding : 32 }} >
                <div className="col-6" style={{ justifyContent : 'center' , alignItems : 'flex-end' , display : 'flex' }}>
                  <p style={{ fontSize : 30 , fontWeight : '400' , color : "#1A1A1B" , lineHeight : '29px' ,  }}>Training <br />videos</p>
                </div>
                <div className="col-6">
                  <img src="starr.png" style={{ width: 95, height: 90 , margin : 'auto' , display : 'block' }} alt="Example Image" />
                </div> 
              </div>

            </div>

            <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor : 'pointer'  }} onClick={()=>{
              navigate('/grantedaccess')
            }} >
            <div className="row" style={{ padding : 32 }} >
                <div className="col-6" style={{ justifyContent : 'center' , alignItems : 'flex-end' , display : 'flex' }}>
                  <p style={{ fontSize : 30 , fontWeight : '400' , color : "#1A1A1B" , lineHeight : '29px' ,  }}>SKO <br />Analytics</p>
                </div>
                <div className="col-6">
                  <img src="bluee.png" style={{ width: 95, height: 90 , margin : 'auto' , display : 'block' }} alt="Example Image" />
                </div> 
              </div>
            </div>

            <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor : 'pointer' }} 
            onClick={()=>{
              navigate('/dashboard')
            }} >
            <div className="row" style={{ padding : 32 }} >
                <div className="col-6" style={{ justifyContent : 'center' , alignItems : 'center' , display : 'flex' }}>
                  <p style={{ fontSize : 30 , fontWeight : '400' , color : "#1A1A1B" , lineHeight : '29px' , marginTop :  20  }}>Settings</p>
                </div>
                <div className="col-6">
                  <img src="sett.png" style={{ width: 95, height: 95 , margin : 'auto' , display : 'block' }} alt="Example Image" />
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

export default Adminpage;
