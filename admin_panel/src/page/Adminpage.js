import React, { useEffect, useState, useRef, useContext } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers"
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import app from "./firebase";
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo , update } from "firebase/database";
import SweetAlert2 from 'react-sweetalert2';
import * as CryptoJS from 'crypto-js'
import Modal from 'react-modal';
import { DataContext } from "../component/DataProvider";

let Adminpage = () => {

  let [data, setData] = useState();
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input1Ref = useRef(null);
  const [value, setValue] = useState('');
  const [swalProps, setSwalProps] = useState({ show: false });
  const { state, dispatch } = useContext(DataContext); // Destructure state from context

  let [username, setUsername] = useState()
  let [password, setPassword] = useState()

  let [forget, setForget] = useState(false)
  let [forgetvalue, setForgetvalse] = useState('')

  const [modalIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Set initial loading to false

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
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 1)', // Transparent overlay
    },
  };

  useEffect(() => {
    loginCheck();
    if (!state.data) { // Check if data is not available in context
      getone();
    }
  }, [state.data]); // Add state.data as a dependency

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
    let getdata = sessionStorage.getItem('data')
    if (getdata === undefined || getdata === '' || getdata === null) {
      sessionStorage.removeItem('data')
      navigate('/')
      return
    } 
    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)
 
    setUsername(parsedatajson)

    let name = getName(parsedatajson)
    setUsedname(name)

    console.log(decry, 'decrydecry')

    const db = getDatabase(app);
    const newDocRef = ref(db, `user`);

    const snapshot = await get(newDocRef); // Fetch the data for the user

    if (snapshot.exists()) {
      const userData = snapshot.val();


      console.log(userData , 'userDatauserDatauserDatauserData')
 

      dispatch({ type: "SET_DATA", payload: { user: userData } });
 
      const emailKey = parsedatajson.Email.replace(".com", ""); // Firebase doesn't allow dots in keys
      const userRefs = ref(db, `user/${emailKey}`);
  
      try {
        await update(userRefs,  {  // Replace with actual value
          date: new Date().toISOString(), // Store the current date in ISO format
        } ); // Update the manager in the database  
      } catch (error) { 
      }

      // Check if the password matches
      const foundUser = Object.values(userData).find(user => user.Email === parsedatajson.Email);
      // if (foundUser.Role === 'emp') {
      //   sessionStorage.removeItem('data')
      //   navigate('/')
      //   return
      // }
      if (foundUser) {

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

  let getone = () => {
    setLoading(true)
    const db = getDatabase(app);
    const eventsRefs = ref(db, "Data"); 

    const dateQuerys = query(eventsRefs);

    // Fetch the results
    get(dateQuerys)
      .then((snapshots) => {
        if (snapshots.exists()) {
          const eventss = snapshots.val();
          setLoading(false)
          dispatch({ type: "SET_DATA", payload: { data: eventss } });
         
        } else {
          setLoading(false)
          console.log("No events found between the dates.");
        }
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching events:", error);
      });
  };
useEffect(()=>{
  // console.log(state.data,'state data')
  const isEmpty = (obj) => Object.keys(obj).length === 0;
  if (isEmpty(state.data)) {
    getone();
  }
}, []); 
  let navigate = useNavigate();

  return (
    <>
      <div style={{ scrollbarWidth: 'none', overflow: "hidden" }}>
        <div className="" style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
        }} >
          <div className="row justify-content-between " style={{ paddingLeft: '2%', paddingRight: '2%', height: 52 }}>
            <div style={{ padding: 16 }} className="d-flex col" >
              <p onClick={() => {
                setIsOpen(true)
              }} style={{
                fontSize: 20, fontWeight: '700', color: "#fff", marginTop: -4,
                cursor: 'pointer'
              }} >Logout</p>
            </div>
            <div style={{ padding: 13 }} className="d-flex text-center justify-content-center col" >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: 0, marginTop: -3 }} >
                {usedname}
              </p>
            </div>
            <div style={{ padding: 13 }} className="d-flex  justify-content-end col" >
              <img src="Menu_Logo.png" style={{ width: 56, height: 28 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: 0 }} >web app</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#313233", height: '100vh' }} >
        <div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '95vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('finefine.png')", height: '100%', backgroundSize: "230vh",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", backgroundColor: "#313233", flexDirection: 'column', gap: '4%', display: 'flex'
          }} >
            {
              username?.Role === 'admin' || username?.Role === 'manager' ?
                <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor: 'pointer' }} onClick={() => {
                  function getNames(data) {
                    if (!data.venue || data.venue.length === 0) {
                      return false; // Default to name if venue is missing or empty
                    }
                    const hasAll = data.venue.some(v => v.value === "All");
                    if (hasAll && data.venue.length > 1) {
                      return false;
                    } else if (data.venue.length === 1 && !hasAll) {
                      return true;
                    }
                    return false;
                  }
                  let funnnderr = getNames(username)
                  if (funnnderr === true) {
                    navigate("/analytics");
                  } else {
                    navigate('/grantedaccess')
                  }
                }} >
                  <div className="row" style={{ padding: 30 }} >
                    <div className="col-6" style={{ justifyContent: 'center', alignItems: 'flex-end', display: 'flex' }}>
                      <p style={{ fontSize: 30, fontWeight: '400', color: "#1A1A1B", lineHeight: '29px', marginLeft: 28, marginTop: 20 }}>SKO <br />Analytics</p>
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
                  <div className="row" style={{ padding: 30 }} >
                    <div className="col-6 d-flex justify-content-center align-items-center ">
                      <p style={{ fontSize: 30, fontWeight: '400', color: "#1A1A1B", lineHeight: '29px', marginTop: 20, marginLeft: 8 }}>Settings</p>
                    </div>
                    <div className="col-6">
                      <img src="sett.png" style={{ width: 95, height: 90, margin: 'auto', display: 'block' }} alt="Example Image" />
                    </div>
                  </div>
                </div>
                : ''
            }

{
              username?.Role === 'emp' ?
                <div style={{ width: 500, height: 150, backgroundColor: "#F3F3F3", borderRadius: 7, cursor: 'pointer' }}
                  onClick={() => {
                    navigate('/training')
                  }} >
                  <div className="row" style={{ padding: 30 }} >
                    <div className="col-6 d-flex justify-content-center align-items-center ">
                      <p style={{ fontSize: 30, fontWeight: '400', color: "#1A1A1B", lineHeight: '29px', marginTop: 20, marginLeft: 8 }}>Training <br />videos</p>
                    </div>
                    <div className="col-6">
                      <img src="starr.png" style={{ width: 95, height: 90, margin: 'auto', display: 'block' }} alt="Example Image" />
                    </div>
                  </div>
                </div>
                : ''
            }
            <SweetAlert2 {...swalProps} />
          </div>
        </div>
        {
              username?.Role === 'emp' ?
              "":
              <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          <button
            onClick={getone}
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
            Fetch Data
          </button>
        </div>

        }
        
      </div>

      {/* Loader Modal */}
      <Modal
        isOpen={loading}
        onRequestClose={() => setLoading(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Transparent overlay
          },
          content: {
            border: 'none',
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <div style={styles.loader}></div>
      </Modal>

      {/* Logout Modal */}
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
        <h2 style={{ marginBottom: '15px', fontSize: '20px', color: '#1A1A1B' }}>Are you sure you want to logout?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          <button
            onClick={() => {
              sessionStorage.removeItem('data')
              dispatch({ type: "RESET_DATA" }); 
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
            onClick={() => {
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
    </>
  );
};

const styles = {
  loader: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Adminpage;