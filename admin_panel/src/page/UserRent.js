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
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa6";
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from "uuid";
let UserRent = () => {
  let [data, setData] = useState();
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input1Ref = useRef(null);
  const [value, setValue] = useState('');
  const [swalProps, setSwalProps] = useState({ show: false });
  let navigate = useNavigate();

  let [username, setUsername] = useState()
  let [password, setPassword] = useState()
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
const[isLoading,setIsloading]=useState(false);
const[send,setSend]=useState(false);
  let [forget, setForget] = useState(false)
  let [forgetvalue, setForgetvalse] = useState('')

  useEffect(() => {
    loginCheck()
  }, [])
  // const token = uuidv4();
  let loginCheck = async () => {
    let getdata = sessionStorage.getItem('data')
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
        navigate('/admin')
        // Check if the password matches
        if (foundUser.Password === parsedatajson.Password) {

        } else {

          return
        }
      } else {
        console.log("User does not exist.");
      }
    }
  }


  const handleVerify = async (e) => {
    setIsloading(true);
    e.preventDefault();
  
    if (!forgetvalue) {
      toast.error("Please enter an email address");
      setIsloading(false);
      return;
    }
  
    const db = getDatabase(app);
    const userRef = ref(db, "user");
    const emailQuery = query(userRef, orderByChild("Email"), equalTo(forgetvalue));
  
    try {
      const snapshot = await get(emailQuery);
      
      if (!snapshot.exists()) {
        toast.error("No user found with the given email.");
        setIsloading(false);
        return;
      }
      const currentTime = Date.now();
      const dataToEncrypt = JSON.stringify({ email: forgetvalue, timestamp: currentTime });
  

      const encryptedData = encrypt(dataToEncrypt);
      const resetLink = `http://sko-analytics.vercel.app/forgetpassword?token=${encodeURIComponent(encryptedData)}`;

      snapshot.forEach(async (userSnapshot) => {
        // console.log(userSnapshot.key, userSnapshot.val());
  
        try {
          await emailjs.send(
            'service_70nfi2e',
            'template_nxlgvq8',
            {  
              from_name: "SKO", 
              to_name: forgetvalue.split("@")[0], 
              to_email: forgetvalue, 
              from_email: "stainsrubus@gmail.com",
              subject: "Verification from SKO",
              message: `Click the link below to reset your password: ${resetLink}`,
            },
            '4neAUe9l0jy_Tyrus'
          );
  
          toast.success('Kindly check your email to verify your account!');
          setForgetvalse('');
          setSend(true);
      setIsloading(false);

        } catch (error) {
          console.error("EmailJS Error:", error.text);
          toast.error('Failed to send email. Please try again.');
      setIsloading(false);

        }
      });
  
    } catch (error) {
      console.error("Firebase Error:", error);
      toast.error("Error fetching data.");
    } 
  };
  

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



  const handleKeyDownfiin = (event) => {
    if (event.key === 'Enter') {
      input2Ref.current.focus(); // Focus on the second input
    }
  };


  const validateFields = () => {
    let isValid = true;
    
    // Reset error messages
    setUsernameError('');
    setPasswordError('');
    
    // Validate username
    if (!username) {
      setUsernameError('Username is required');
      isValid = false;
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    
    return isValid;
  };

  let loginn = async () => {

    console.log('gggggggggggggggggggggggggg')

    if (!validateFields()) {
      if (!username && !password) {
        toast.error("All fields are mandatory");
      } 
      else if (!username) {
        toast.error("Please enter the Username");
      }
      else {
        toast.error("Please enter the Password");
      }
      setUsernameError('');
      setPasswordError('');
      return;
    }
 
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

            let fing = encrypt(JSON.stringify(foundUser))

            console.log(fing, 'fingfingfingfingfing')
            sessionStorage.setItem('data', fing)

            function getName(data) {

              console.log(data?.venue , 'state.datastate.data')
          
          
              // if (!data.venue || data.venue.length === 0) {
              //   return data.name; // Default to name if venue is missing or empty
              // }
          
              // const hasAll = data.venue.some(v => v.value === "All");
          
              // if (hasAll && data.venue.length > 1) {
              //   return data.name;
              // } else if (data.venue.length === 1 && !hasAll) {
              //   return data.venue[0].value;
              // }
          
              const matchedGroupName = Object.entries(state.data).find(([groupName, groupData]) => {
                return Object.keys(groupData).some(key =>
                  data?.venue.some(item => item.label === key)
                );
              })?.[0]; // Safely get groupName from matched pair
              
              console.log('Matched group name:', matchedGroupName);
              
              return matchedGroupName
          
          
            }


            if (foundUser.Role === 'admin') {
 
                navigate("/admin", { state: { userdata: foundUser } }); 
            } else if (foundUser.Role === 'emp') {
              navigate("/admin", { state: { userdata: foundUser } });
              // navigate("/training");
            } else {

              if(foundUser.Role === 'superadmin'){
                navigate("/admin", { state: { userdata: foundUser } });
                return
              }
              // let funnnderr = getName(foundUser)
              // if (funnnderr === true) {
              //   navigate("/admin", { state: { userdata: foundUser } });
              // } else {
              //   navigate("/admin", { state: { userdata: foundUser } });
              // }

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

        <div  style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="d-flex justify-content-center " style={{ paddingLeft: '2%', paddingRight: '2%', height: 52 }}>
            <div style={{ padding: 13 }} className="d-flex" >
              <img src="Menu_Logo.png" style={{ width: 56, height: 28 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: 0 }} >web portal</p>
            </div>
          </div>
        </div>

      </div>
      <div style={{ backgroundColor: "#313233", height: '100vh' }} >

        <div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '95vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('finefine.png')", height: '100%', backgroundSize: "230vh",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", display: 'flex', backgroundColor: "#313233"
          }} >
      {
                forget === false ?
            <div style={{ maxWidth: 550, height: 267,width:"100%", backgroundColor: "#F3F3F3", borderRadius: 7, }} >
            <div className="kjok" style={{ marginTop: '7%' }} >
                    <div className="d-flex justify-content-evenly" >
                      <p style={{ color: '#1A1A1B', fontSize: 17, fontWeight: '400', paddingTop:12 }} >Username:</p>
                      <input onChange={(e) => { 
                        setUsername(e.target.value)
                      }} value={username} onKeyDown={handleKeyDownfiin} style={{ width: 290,color: '#1A1A1B', height: 50, borderRadius: 5, border: "1px solid #707070"   ,
                        paddingLeft : 11
                       }} type="text" />
                           
                    </div>
                 

                    <div className="d-flex justify-content-evenly mt-3" >
                      <p style={{ color: '#1A1A1B', fontSize: 17, fontWeight: '400',fontFamily: 'Roboto', paddingTop:12}}>Password:</p>
                      <input onChange={(e) => {
                        setPassword(e.target.value)
                      }} value={password} ref={input2Ref} onKeyDown={handleKeyDown} style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070",
                        paddingLeft : 11 }} type="password" />
                           
                    </div>
                
                    <p onClick={() => {
                      setForget(true)
                      // navigate('/forgetpassword')
                    }} style={{
                      color: "#707070", fontSize: 14, fontWeight: '400',fontFamily:'Roboto', textAlign: 'right', marginRight: 68, marginTop: 3,
                      cursor: "pointer"
                    }} >Reset password?</p>

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30, cursor: "pointer" }} >
                <div onClick={() => {
                  loginn()
                }} style={{ backgroundColor: '#316AAF', width: 85, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} >
                  <p style={{ textAlign: 'center',fontSize: 17, color: '#FCFCFC',fontWeight:700,fontFamily: 'Roboto',padding: 2 }} >Login</p>
                </div>
              </div>
                  </div>
                  </div>
             
        
              

                  :
send?<div className="fs-4 text-white">
  <p>
  We have sent an verification link to your registered mail. Kindly verify!!
  </p>
  <p onClick={() => {
  setForget(false),
  setSend(false)
}} style={{
  color: "#fff", fontSize: 15, fontWeight: '500', textAlign: 'center', marginRight: 40, marginTop: 3,
  cursor: "pointer"
}} ><FaArrowLeft /> Back to Login 
</p>
</div> :  
<div style={{ maxWidth: 550, height: 267,width:"100%", backgroundColor: "#F3F3F3", borderRadius: 7, }} >
<div className="kjok" style={{ marginTop: '15%' }} >


<div className="d-flex justify-content-around mt-3" >
  <p style={{ color: '#1A1A1B', fontSize: 21, fontWeight: '500', }}>Enter Email :</p>
  <input onChange={(e) => {
    setForgetvalse(e.target.value)
  }} ref={input3Ref} value={forgetvalue} onKeyDown={handleKeyDowns} style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070",    paddingLeft : 11 }} type="text" />
</div>
<p onClick={() => {
  setForget(false)
  setSend(false)
}} style={{
  color: "#707070", fontSize: 15, fontWeight: '500', textAlign: 'right', marginRight: 40, marginTop: 3,
  cursor: "pointer"
}} ><FaArrowLeft /> Back to Login </p>

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30, cursor: "pointer" }} >
<div onClick={(e) => {
handleVerify(e)
}} style={{ backgroundColor: '#316AAF', width: isLoading?110:85, height: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} >
<p style={{ textAlign: 'center',fontSize: 17, color: '#FCFCFC',fontWeight:700,fontFamily: 'Roboto',padding: 2 }} >{isLoading?'Verifying..':'Verify'}</p>
</div>
</div>
</div>
         </div>       

              }



          






              <SweetAlert2 {...swalProps} />

              {/* <button onClick={()=>{ saveData() }} >Submit</button>
              <button onClick={()=>{ fetchData() }} >get</button> */}

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserRent;
