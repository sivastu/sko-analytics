import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers"

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import * as CryptoJS from 'crypto-js'
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo, update } from "firebase/database";
import app from "./firebase";
import Select, { components } from 'react-select';
import SweetAlert2 from 'react-sweetalert2';

import { Nav } from "react-bootstrap";

let Training = () => {
  let [data, setData] = useState('1');
  let navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(true);
  const [swalProps, setSwalProps] = useState({ show: false });

  let [ck, setCk] = useState(false)


  let [fulldatafull, setFulldatafull] = useState()
  let [basicall, setBasicall] = useState()
  let [alldrop, setAlldrop] = useState([])
  let [basic, setBasic] = useState()
  const [selectedOptions, setSelectedOptions] = useState([]);
  let [basicone, setBasicone] = useState([])
  let [hubb, setHubb] = useState([])
  let [user, setUser] = useState({})

  let [mydata, setMydata] = useState()
  let [username, setUsername] = useState()
  let [email, setEmail] = useState()


  let [editname, setEditname] = useState()
  let [editemail, setEditemail] = useState()
  let [editpass, setEditpass] = useState()


  let [editnamebool, setEditnamebool] = useState(true)
  let [editemailbool, setEditemailbool] = useState(true)
  let [editpassbool, setEditpassbool] = useState(true)

  let [btncolor, setButtoncolor] = useState(false)






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
    setBasicall(parsedatajson)
    const db = getDatabase(app);
    const newDocRef = ref(db, `user`);

    const snapshot = await get(newDocRef); // Fetch the data for the user

    if (snapshot.exists()) {
      const userData = snapshot.val();
      setUser(userData)
      // Check if the password matches
      const foundUser = Object.values(userData).find(user => user.Email === parsedatajson.Email);

      if(foundUser.Role === 'emp'){
        navigate('/')
        return
      }

      if (foundUser) {
        setMydata(foundUser)
        // Check if the password matches
        if (foundUser.Password === parsedatajson.Password) {
          setEditname(foundUser.name)
          setEditemail(foundUser.Email)
          setEditpass(foundUser.Password)
        } else {
          // navigate('/')
          return
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
      <div  >

        <div style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="d-flex justify-content-between " style={{ paddingLeft: '2%', paddingRight: '2%' }}>
            <div style={{ padding: 17, }} className="d-flex" onClick={() => {
              navigate(-1)
            }} >
              <img src="arrow.png" style={{ width: 20, height: 20 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -7 }} >HOME</p>
            </div>

            <div style={{ padding: 13, }} >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginTop: -3 }} >{usedname}</p>
            </div>

            <div style={{ padding: 13 }} className="d-flex" >
              <img src="newlogo.png" style={{ width: 40, height: 22 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >knowledge</p>
            </div>

          </div>
        </div>

      </div>

      <div style={{ backgroundColor: "#ECF1F4", height: '100vh' }} >

        <div className="   p-5">
         

            <div style={{ width  : '60%' , margin : 'auto' , display : 'block' }} >
              <div className="custom-inputoness d-flex justify-content-between" style={{
                width: "100%",
                height: 45
              }}>

                <div className="input-group"  >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    style={{
                      border: "none",
                      boxShadow: "none",
                      marginRight: "45px",
                    }}
                  />
                  <span
                    className="input-group-text"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      position: "absolute",
                      right: 10,
                    }}
                  >
                    🔍
                  </span>
                </div>


              </div>


              <p style={{ marginTop : '5%' , textAlign : 'center' , fontWeight : '600' , fontSize : 30 }}>SKO system training videos</p>

            </div>
 
        </div>



        <div className="d-flex justify-content-between p-5">

          <div >

          </div>
        </div>

        <div className="d-flex " style={{ height: '60%' }} >


        </div>



      </div>

      <SweetAlert2 {...swalProps} />
    </div>
  );
};

export default Training;
