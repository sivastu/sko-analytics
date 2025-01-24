import React, { useEffect, useState , useRef } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers"
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer"; 
import app from "./firebase";
import { getDatabase, ref, set, push , get } from "firebase/database";

let Forgetpassword = () => {

  let [data, setData] = useState();
  const input2Ref = useRef(null);
  const input1Ref = useRef(null);
  const [value, setValue] = useState('');

  let [ username , setUsername ] = useState('')
  let [ password , setPassword ] = useState('')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
     console.log('eeeeeeeeeeeeeee')
     input2Ref.current.blur();
     loginn()
    }
  };
  let navigate = useNavigate();

  const handleKeyDownfiin = (event) => {
    if (event.key === 'Enter') {
      input2Ref.current.focus(); // Focus on the second input
    }
  };



  let loginn = async () => {
    try {

      const db = getDatabase(app);
      const newDocRef =ref(db, `user/${username}`);
 
      const snapshot = await get(newDocRef); // Fetch the data for the user
  
      if (snapshot.exists()) {
        const userData = snapshot.val();
  
        // Check if the password matches
        if (userData.Password === password) {

          if(userData.Role === 1){
            navigate("/multivenues");
          }
          console.log("Login successful:", userData);
        } else {
          console.log("Invalid password.");
        }
      } else {
        console.log("User does not exist.");
      }
    } catch (error) {
      console.error("Error checking user credentials:", error);
    }
  }


  useEffect(()=>{ 

    let getData = async () =>{  
      console.log('resssssssssssssss')
    } 
    getData()

  },[])


  const saveData = async () => {
    const db = getDatabase(app);
    const newDocRef =ref(db, "user/siva");
    set(newDocRef, {
      Email: 'siva',
      Password: 'password'
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
      <Headers />
      <div style={{ backgroundColor: "#525659", height: '100vh' }} >



        <div className="dddd" style={{ backgroundImage: "url('backs.jpg')", height: '100vh', padding: 0 }} >
          <div style={{
            backgroundImage: "url('back.png')", height: '100%', backgroundSize: "contain",
            backgroundPosition: "center", backgroundRepeat: "no-repeat",
            alignItems: "center", justifyContent: "center", display: 'flex'
          }} >

            <div style={{ width: 550, height: 276, backgroundColor: "#F3F3F3", borderRadius: 7,     }} >

            <div className="kjok" style={{ marginTop : '13%' }} > 
              <div className="row" >
                <div className='col-5' >
                <p style={{ color: '#1A1A1B', fontSize: 19, fontWeight: '500', textAlign : 'center' , marginTop : 8 }} >New Password :</p>
                </div>
                <div className='col-7' >
                <input onChange={(e)=>{
                  setUsername(e.target.value)
                }} onKeyDown={handleKeyDownfiin}  style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="text" />
                </div>
               
               
              </div>

              
                <div className="row mt-3" >

                  <div className='col-5' >
                  <p style={{ color: '#1A1A1B', fontSize: 19, fontWeight: '500', textAlign : 'center' , marginTop : 8 }}>Confirm Password :</p>
                  </div>
                  <div className='col-7' >
                    
                  <input onChange={(e)=>{
                    setPassword(e.target.value)
                  }} ref={input2Ref} onKeyDown={handleKeyDown} style={{ width: 290, height: 50, borderRadius: 5, border: "1px solid #707070" }} type="password" />
                  </div>
                  
                </div>
                <p onClick={()=>{
                  navigate('/')
                }}  style={{ color: "#707070", fontSize: 15, fontWeight: '500' , textAlign : 'right' , marginRight : 40 , marginTop : 3 ,
                  cursor : "pointer"
                }} >Login</p>
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

export default Forgetpassword;
