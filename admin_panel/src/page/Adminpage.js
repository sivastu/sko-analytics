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
import Modal from 'react-modal';

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

  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: '3px solid #ababab',
      borderRadius: '10px',
      width: '70%'
    },
  };
  useEffect(() => {
    loginCheck()
  }, [])

  function afterOpenModal() {
    // references are now sync'd and can be accessed. 
  }

  function closeModal() {
    setIsOpen(false);
  }



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
      localStorage.removeItem('data')
      navigate('/')
      return
    }
    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)

    let name = getName(parsedatajson)
    setUsedname(name)

    console.log(decry, 'decrydecry')

    const db = getDatabase(app);
    const newDocRef = ref(db, `user`);

    const snapshot = await get(newDocRef); // Fetch the data for the user

    if (snapshot.exists()) {
      const userData = snapshot.val();

      // Check if the password matches
      const foundUser = Object.values(userData).find(user => user.Email === parsedatajson.Email);
      if (foundUser.Role === 'emp') {
        localStorage.removeItem('data')
        navigate('/')
        return
      }
      if (foundUser) {
        setUsername(foundUser)
        // Check if the password matches
        if (foundUser.Password === parsedatajson.password) {
          // navigate('/')
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
              <p onClick={() => {
                setIsOpen(true)

                // localStorage.removeItem('data')
                // navigate('/')
              }} style={{
                fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: '50%', marginTop: -3,
                cursor: 'pointer'
              }} >Logout</p>
            </div>
            <div style={{ padding: 13, width: 400 }} className="d-flex" >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: '50%', marginTop: -3 }} >{usedname}</p>
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
            alignItems: "center", justifyContent: "center", backgroundColor: "#313233", flexDirection: 'column', gap: '4%', display: 'flex'
          }} >

            <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor: 'pointer' }} onClick={() => {
              navigate('/training')
            }} >

              <div className="row" style={{ padding: 32 }} >
                <div className="col-6" style={{ justifyContent: 'center', alignItems: 'flex-end', display: 'flex' }}>
                  <p style={{ fontSize: 30, fontWeight: '400', color: "#1A1A1B", lineHeight: '29px', }}>Training <br />videos</p>
                </div>
                <div className="col-6">
                  <img src="starr.png" style={{ width: 95, height: 90, margin: 'auto', display: 'block' }} alt="Example Image" />
                </div>
              </div>

            </div>
            {
              username?.Role === 'admin' || username?.Role === 'manager' ?

                <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor: 'pointer' }} onClick={() => {
                  navigate('/grantedaccess')
                }} >
                  <div className="row" style={{ padding: 32 }} >
                    <div className="col-6" style={{ justifyContent: 'center', alignItems: 'flex-end', display: 'flex' }}>
                      <p style={{ fontSize: 30, fontWeight: '400', color: "#1A1A1B", lineHeight: '29px', }}>SKO <br />Analytics</p>
                    </div>
                    <div className="col-6">
                      <img src="bluee.png" style={{ width: 95, height: 90, margin: 'auto', display: 'block' }} alt="Example Image" />
                    </div>
                  </div>
                </div>

                : ''
            }



            {
              username?.Role === 'admin' ?
                <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor: 'pointer' }}
                  onClick={() => {
                    navigate('/dashboard')
                  }} >
                  <div className="row" style={{ padding: 32 }} >
                    <div className="col-6" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                      <p style={{ fontSize: 30, fontWeight: '400', color: "#1A1A1B", lineHeight: '29px', marginTop: 20 }}>Settings</p>
                    </div>
                    <div className="col-6">
                      <img src="sett.png" style={{ width: 95, height: 95, margin: 'auto', display: 'block' }} alt="Example Image" />
                    </div>
                  </div>
                </div>

                : ''

            }


            <SweetAlert2 {...swalProps} />
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          contentLabel="Logout Confirmation"
          style={{
            overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
            content: {
              width: '350px',
              height: '170px',
              margin: 'auto',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              backgroundColor: '#ECF1F4',
              color: 'white',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
            }
          }}
        >
          <h2 style={{ marginBottom: '15px', fontSize: '20px' , color : '#1A1A1B' }}>Are you sure you want to log out?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
            <button
              onClick={()=>{
                localStorage.removeItem('data')
                navigate('/')
              }}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ff4d4d',
                color: 'white',
                fontWeight: 'bold',
                transition: '0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#ff1a1a'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff4d4d'}
            >
              Yes
            </button>
            <button
              onClick={()=>{
                setIsOpen(false)
              }}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#4caf50',
                color: 'white',
                fontWeight: 'bold',
                transition: '0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#388e3c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
            >
              No
            </button>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default Adminpage;
