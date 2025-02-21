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

  const [openIndex, setOpenIndex] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Open modal with the selected image
  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage("");
  };


  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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

      if (foundUser.Role === 'emp') {
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
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: 3 }} >HOME</p>
            </div>
            <div style={{ padding: 13 }} className="d-flex text-center justify-content-center col" >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: 0, marginTop:3 }} >
                {usedname}
                </p>
            </div>

            <div style={{ padding: 13 }} className="d-flex  justify-content-end col" >
              <img src="Menu_Logo.png" style={{ width: 56, height: 28 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: 3 }} >knowledge</p>
            </div>

          </div>
        </div>

      </div>

      <div style={{ backgroundColor: "#ECF1F4", height: '100vh' }} >

        <div className="   p-5">


        <div style={{ width: "60%", margin: "auto", display: "block", position: "relative" }}>
  {/* Search Box - Fixed at the Top */}
  <div
    className="custom-inputoness d-flex justify-content-between"
    style={{
      width: "50%",
      height: 65,
      position: "fixed", // Make it fixed
      top: 100, // Stick to the top
      left: "50%",
      transform: "translateX(-50%)", // Center it
      zIndex: 1000, // Ensure it stays on top
      background: "white", // Optional: Background to prevent transparency issues
      paddingTop: 10,
      paddingBottom: 10,
      boxShadow: "0 8px 1px rgba(0,0,0,0.2)", // Adds a slight shadow
    }}
  >
    <div className="input-group" style={{ width: "100%" }}>
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

  {/* Scrollable Content */}
  <div style={{ marginTop: "70px", overflowY: "auto", maxHeight: "calc(100vh - 60px)" }} className="hide-scrollbar">
    <p style={{ marginTop: "5%", textAlign: "center", fontWeight: "600", fontSize: 30 }}>
      SKO system training videos
    </p>

    <div className="w-100 d-flex justify-content-center align-content-center">
      <img src="/simple.webp" style={{ maxWidth: "500px", borderRadius: "20px" }} alt="example" />
    </div>

    <div
      className="accordion-container bg-transparent"
      style={{
        maxWidth: "1200px",
        margin: "auto",
        borderRadius: "10px",
        marginTop: 40,
      }}
    >
      {/* BASIC */}
      <div
        className="accordion-item"
        style={{
          borderBottom: "1px solid #ddd",
          padding: "0",
        }}
      >
        <button
          className="w-100 px-4 py-3 bg-transparent cursor-pointer"
          onClick={() => toggleAccordion(1)}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "none" }}
        >
          <span style={{ fontSize: 18, fontWeight: "600" }}>BASIC</span>
          <img
            src="down.png"
            alt="toggle icon"
            style={{
              width: "14px",
              height: "12px",
              transform: openIndex === 1 ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
        {openIndex === 1 && (
          <>
            <hr style={{ padding: "0px", margin: "0px" }} />
            <div className="accordion-content px-4 py-3" style={{ display: "flex", alignItems: "center",flexDirection:"column" }}>
            <div className="col">
            <div style={{ marginTop: 20, marginBottom:50 }} className="row">
                <div className="col-6">
                  <img src="/dash.png" alt="example" style={{ width: 100, height: 4,marginBottom:8 }} />
                  <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>SIMPLE</p>
                  <div className="w-100">
                    <p>
                    SKO has been designed to make life easier for kitchens. With the tip of your finger, dockets can be swiped left and right and reshuffled as many times as needed.
This gives chefs control over what dockets need to be prioritised and allows them to see which meals have been taken out to customers.
                    </p>
                    <p>
                    In less than 30 minutes, you’ll already be on your way to using SKO with confidence.
                    </p>
                  </div>
                </div>
                <div className="col-6 ">
                <img className="w-100" style={{borderRadius:"10px"}} src="https://sk-order.com/wp-content/uploads/2023/12/simple.webp" alt="example" />

                </div>
              </div>
            </div>
              <div className="col">
              <div style={{ marginTop: 20, marginBottom:20 }} className="row">
              <div className="col-6 ">
                  <img className="w-100" style={{borderRadius:"10px"}} src="https://sk-order.com/wp-content/uploads/2023/12/pdt2.webp" alt="example" />
                </div>
                <div className="col-6 d-flex flex-column  text-end  ms-auto align-self-end">
<div className="d-flex align-self-end mb-2">
<img src="/dash.png" alt="example" style={{ width: 100, height: 4, marginBottom: 8 }} />
</div>
  <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>VISIBLE</p>
<div className="w-100 d-flex justify-content-end">
<div className="">
    <p>
    Gone are the days of trying to find lost paper dockets. Instead, your digital rail will be placed directly in front of you with clear visibility of all dockets. SKO will automatically organise relevant dockets for each station so chefs know what to prepare and when to do it. Having a SKO setup ensures everyone is in agreement with what dockets are on display. This results in fewer mistakes and an increase in staff satisfaction.
    </p>
  </div>
</div>
</div>

                
              </div>
              </div>
              <div className="col">
            <div style={{ marginTop: 20, marginBottom:50 }} className="row">
                <div className="col-6">
                  <img src="/dash.png" alt="example" style={{ width: 100, height: 4,marginBottom:8 }} />
                  <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>EFFICIENT</p>
                  <div className="w-100">
                    <p>
                    Efficiency is boosted by 10% with SKO. Why?
                    </p>
                    <p>
                    Staff have a greater understanding of what stage the docket is at. This means the correct meals are being served to customers in a timely manner. 
                    </p>
                    <p>
                    If any amendments are made, it’s updated for everyone to see. 
                    </p>
                    <p>
                    Rather than second-guessing whether an order is ready to go, chefs can use SKO to keep dockets on hold or move them on to the pass.
                    </p>
                  </div>
                </div>
                <div className="col-6 ">
                <img className="w-100" style={{borderRadius:"10px"}} src="https://sk-order.com/wp-content/uploads/2023/12/pdt1.webp" alt="example" />
                
                </div>
              </div>
            </div>
           
            </div>
          </>
        )}
      </div>

      {/* CHEF */}
      <div
        className="accordion-item"
        style={{
          borderBottom: "1px solid #ddd",
          padding: "0",
        }}
      >
        <button
          className="w-100 px-4 py-3 bg-transparent cursor-pointer"
          onClick={() => toggleAccordion(2)}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "none" }}
        >
          <span style={{ fontSize: 18, fontWeight: "600" }}>CHEF</span>
          <img
            src="down.png"
            alt="toggle icon"
            style={{
              width: "14px",
              height: "12px",
              transform: openIndex === 2 ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
        {openIndex === 2 && (
          <>
            <hr style={{ padding: "0px", margin: "0px" }} />
            <div className="accordion-content px-4 py-3" style={{ display: "flex", alignItems: "center",flexDirection:"column" }}>
            <div className="col">
            <div style={{ marginTop: 20, marginBottom:50 }} className="row">
                <div className="col-6">
                  <img src="/dash.png" alt="example" style={{ width: 100, height: 4,marginBottom:8 }} />
                  <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>Edit & Move feature</p>
                  <div className="w-100">
                    <p>
                      With SKO’s Edit & Move feature, you can make amendments without disrupting your flow of dockets coming in.
                    </p>
                    <p>
                      After all, who has time to scribble down on a piece of paper when your kitchen is at optimal capacity?  
                      For example, say you need to add a dietary requirement or allergy, all you need to do is add a note to the digital docket and it will instantly update for everyone to see.
                    </p>
                    <p>
                      Also, if a customer wants their entrée and main sent out at the same time you simply hold the item and move it down.
                    </p>
                  </div>
                </div>
                <div className="col-6 ">
                  <video
                    className=""
                    style={{
                      maxWidth:450,
                      marginLeft:-20
                    }}
                    autoPlay
                    playsInline
                    loop
                    muted
                    controls
                    src="https://sk-order.com/wp-content/uploads/2023/12/2023-11-28_Edit-_-Move-feature.mp4"
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                </div>
              </div>
            </div>
              <div className="col">
              <div style={{ marginTop: 20, marginBottom:20 }} className="row">
              <div className="col-6 ">
                  <video
                    className=""
                    style={{
                      maxWidth:450,
                      marginRight:-20
                    }}
                    autoPlay
                    playsInline
                    loop
                    muted
                    controls
                    src="https://a5.techbuzz360.com/sko/wp-content/uploads/2024/04/2024-04-09_New-window-video.mp4"
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                </div>
                <div className="col-6 d-flex flex-column  text-end  ms-auto align-self-end">
<div className="d-flex align-self-end mb-2">
<img src="/dash.png" alt="example" style={{ width: 100, height: 4, marginBottom: 8 }} />
</div>
  <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>New Dockets Position</p>
<div className="w-100 d-flex justify-content-end">
<div className="">
    <p>
    Need to prioritize a bowl of chips or entrees without affecting the order of other dockets?
The ‘NEW’ window on your SKO screen allows you to do this. Simply move dockets left (to end) or right (to start) when deciding if they should be placed at the beginning or end of the rail.
    </p>
    <p>
    Fear not, positioning a docket to the beginning of your rail won't affect the chronological order of existing dockets.
For example, if you prioritize an entree for a customer because you want it to be sent out before their main, you can move the docket to the beginning. Then the app will automatically place the other dockets back to their original order once the entree has been served.
    </p>
  </div>
</div>
</div>

                
              </div>
              </div>

              <div className="col">
      <div style={{ marginTop: 20, marginBottom: 50 }} className="row">
        {/* Left Section (Text) */}
        <div className="col-6">
          <img src="/dash.png" alt="example" style={{ width: 100, height: 4, marginBottom: 8 }} />
          <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>Meals summary</p>
          <div className="w-100">
            <p>
              With one touch, access a live summary of all meals that remain to be cooked and served. Items are organised by
              alphabetical order and cooking temperature, allowing your staff to quickly see which orders will take the longest to cook.
            </p>
            <p>SKO pulls together all the important details which means no more counting or second-guessing.</p>
          </div>
        </div>

        {/* Right Section (Images) */}
        <div className="col-6 d-flex flex-column align-items-center">
          {/* Image Clickable to Open Modal */}
          <div onClick={() => openModal("https://sk-order.com/wp-content/uploads/2023/12/SKO700_FrontView_MealsSummary.png")} style={{ cursor: "pointer" }}>
            <img
              width="400"
              height="161"
              src="https://sk-order.com/wp-content/uploads/2023/12/SKO700_FrontView_Dockets.png"
              className="css-filter size-full"
              alt="SKO Dockets"
              decoding="async"
            />

            {/* Arrow Image (Centered) */}
            <div className="d-flex justify-content-center align-items-center" style={{ position: "relative", height: "30px" }}>
              <img
                width="39"
                height="30"
                src="https://sk-order.com/wp-content/uploads/2023/12/SKO-arrow-product.webp"
                className="brxe-image css-filter size-full"
                alt="Arrow"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            <img
              width="400"
              height="161"
              src="https://sk-order.com/wp-content/uploads/2023/12/SKO700_FrontView_MealsSummary.png"
              className="css-filter size-full"
              alt="Meals Summary"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="modal show d-flex align-items-center justify-content-center"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.8)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
          onClick={closeModal} 
        >
            <button
                className="btn-close position-absolute"
                style={{ top: "10px", right: "10px", zIndex: 10 }}
                onClick={closeModal}
              ></button>
          <div className="modal-dialog bg-transparent" style={{ maxWidth: "90vw" }}>
            <div className="modal-content position-relative bg-transparent">
              <img src={selectedImage} alt="Expanded View" className="img-fluid rounded" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="col">
              <div style={{ marginTop: 20, marginBottom:20 }} className="row">
              <div className="col-6 ">
                  <video
                    className=""
                    style={{
                      maxWidth:450,
                      marginRight:-20
                    }}
                    autoPlay
                    playsInline
                    loop
                    muted
                    controls
                    src="https://sk-order.com/wp-content/uploads/2023/12/2023-11-24_Run-function-_-summary.mp4"
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                </div>
                <div className="col-6 d-flex flex-column  text-end  ms-auto align-self-end">
<div className="d-flex align-self-end mb-2">
<img src="/dash.png" alt="example" style={{ width: 100, height: 4, marginBottom: 8 }} />
</div>
  <p style={{ color: "#316AAA", fontSize: 24, fontWeight: 800 }}>New Dockets Position</p>
<div className="w-100 d-flex justify-content-end">
<div className="">
<p>
            We understand how important it is for you, chef, to coordinate your team’s work while satisfying customers with meals delivered on time.
            </p>
            <p>Usually, you’d have to call dockets out that you want your team to work on to synchronise the workflow.
We’ve made it simpler for you. How?</p>
<p>
Double-tap on the dockets you’d like your stations to see and they instantly shall see them.
</p>
<p>
They can even access a summary of items to see what’s coming up next. No longer will you hear, “Chef, which tables are we going with?”.
</p>
<p>
Instead, kitchen stations will see next orders on their SKO device.
</p>
<p>
Less questions will need to be asked and more time will be gained back for the team.
</p>
  </div>
</div>
</div>

                
              </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
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
