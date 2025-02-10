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



let UserRent = () => {

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('eeeeeeeeeeeeeee')
      input2Ref.current.blur();
      loginn()
    }
  };

  const handleKeyDowns = (event) => {
    if (event.key === 'Enter') {
      console.log('eeeeeeeeeeeeeee')
      input3Ref.current.blur();
      sendmail()
    }
  };

   const encrypt = ( plainText ) => {
    const cipherText = CryptoJS.AES.encrypt(plainText, 'secretKey').toString()
    console.log(cipherText ,'cipherText')
    return cipherText
}

 const decrypt = ( cipherText ) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, 'secretKey' )
    const plainText = bytes.toString(CryptoJS.enc.Utf8)
    return plainText

}

  let sendmail = async () => {

    const db = getDatabase(app);

    // Reference to the "user" node
    const userRef = ref(db, "user");

    // Query to search for the email
    const emailQuery = query(userRef, orderByChild("Email"), equalTo(forgetvalue));

    // Execute the query
    get(emailQuery).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((userSnapshot) => {
          console.log(userSnapshot.key, userSnapshot.val());
        });
      } else {
        console.log("No user found with the given email.");
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
    console.log('sendmail kghiudr')
  }


  let navigate = useNavigate();

  const handleKeyDownfiin = (event) => {
    if (event.key === 'Enter') {
      input2Ref.current.focus(); // Focus on the second input
    }
  };



  let loginn = async () => {

    console.log('gggggggggggggggggggggggggg')
    try {

      const db = getDatabase(app);
      const newDocRef = ref(db, `user`);

      const snapshot = await get(newDocRef); // Fetch the data for the user

      if (snapshot.exists()) {
        const userData = snapshot.val();

        console.log(JSON.stringify(userData), 'userDatauserData')

        // Check if the password matches
        const foundUser = Object.values(userData).find(user => user.Email === username);

        if (foundUser) {
          // Check if the password matches
          if (foundUser.Password === password) {
            console.log("Login successful:", foundUser);

            let fing = encrypt( JSON.stringify(foundUser) )

            console.log(fing , 'fingfingfingfingfing')
            localStorage.setItem('data' , fing )

            if (foundUser.Role === 'admin') {

              navigate("/admin", { state: { userdata: foundUser } });
            }
          } else {
            setSwalProps({
              show: true,
              title: 'Invalid password',
              text: ' ',
              icon: 'error',
              didClose: () => {
                console.log('Swal closed');
                setSwalProps({ show: false });
              }
            });
          }
        } else {
          setSwalProps({
            show: true,
            title: 'User not found',
            text: ' ',
            icon: 'error',
            didClose: () => {
              console.log('Swal closed');
              setSwalProps({ show: false });
            }
          });
        }
      } else {
        console.log("User does not exist.");
      }
    } catch (error) {
      console.error("Error checking user credentials:", error);
    }
  }


  useEffect(() => {

    let getData = async () => {
      console.log('resssssssssssssss')
    }
    getData()

  }, [])


  const saveData = async () => {
    const db = getDatabase(app);
    const newDocRef = ref(db, "user/siva");
    set(newDocRef, {
      Email: 'siva',
      Password: 'password'
    }).then(() => {
      alert("data saved successfully")
    }).catch((error) => {
      alert("error: ", error.message);
    })
  }

  let fetchData = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, "Data/BFG-Barefoot-Kitchen-2024");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {

      console.log(Object.values(snapshot.val()), 'snapshot')
    } else {
      alert("error");
    }

  }


  return (
    <div>
      <div style={{ scrollbarWidth: 'none' }}>

        <div style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="d-flex justify-content-center " style={{ paddingLeft: '2%', paddingRight: '2%', height: 52 }}>



            <div style={{ padding: 13 }} className="d-flex" >
              <img src="newlogo.png" style={{ width: 40, height: 22 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >web portal</p>
            </div>

          </div>
        </div>

      </div>
      <div style={{ backgroundColor: "#313233", height: '100vh' }} >





        <div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '100vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('finefine.png')", height: '100%', backgroundSize: "230vh",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", display: 'flex', backgroundColor: "#313233"
          }} >

            <div style={{ width: 550, height: 267, backgroundColor: "#F3F3F3", borderRadius: 7, }} >
              {
                forget === false ?

                  <div className="kjok" style={{ marginTop: '7%' }} >
                    <div className="d-flex justify-content-around" >
                      <p style={{ color: '#1A1A1B', fontSize: 21, fontWeight: '500', marginTop: 7 }} >Username:</p>
                      <input onChange={(e) => {
                        setUsername(e.target.value)
                      }} value={username} onKeyDown={handleKeyDownfiin} style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="text" />
                    </div>


                    <div className="d-flex justify-content-around mt-3" >
                      <p style={{ color: '#1A1A1B', fontSize: 21, fontWeight: '500', marginTop: 7 }}>Password:</p>
                      <input onChange={(e) => {
                        setPassword(e.target.value)
                      }} value={password} ref={input2Ref} onKeyDown={handleKeyDown} style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="password" />
                    </div>
                    <p onClick={() => {
                      // setForget(true)
                    }} style={{
                      color: "#707070", fontSize: 15, fontWeight: '500', textAlign: 'right', marginRight: 40, marginTop: 3,
                      cursor: "pointer"
                    }} >Reset password?</p>
                  </div>

                  :

                  <div className="kjok" style={{ marginTop: '7%' }} >


                    <div className="d-flex justify-content-around mt-3" >
                      <p style={{ color: '#1A1A1B', fontSize: 21, fontWeight: '500', }}>Enter Email :</p>
                      <input onChange={(e) => {
                        setForgetvalse(e.target.value)
                      }} ref={input3Ref} value={forgetvalue} onKeyDown={handleKeyDowns} style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="text" />
                    </div>
                    <p onClick={() => {
                      setForget(false)
                    }} style={{
                      color: "#707070", fontSize: 15, fontWeight: '500', textAlign: 'right', marginRight: 40, marginTop: 3,
                      cursor: "pointer"
                    }} >Login</p>
                  </div>

              }


              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30, cursor: "pointer" }} >
                <div onClick={() => {
                  loginn()
                }} style={{ backgroundColor: '#316AAF', width: 85, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} >
                  <p style={{ textAlign: 'center', color: '#fff', padding: 2 }} >Login</p>
                </div>
              </div>




              <SweetAlert2 {...swalProps} />

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
