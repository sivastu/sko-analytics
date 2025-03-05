import React, { useEffect, useState , useContext  } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";
import Headers from "../component/Headers";
import { FiEyeOff } from "react-icons/fi";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import * as CryptoJS from "crypto-js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  query,
  orderByChild,
  equalTo,
  update,
} from "firebase/database";
import app from "./firebase";
import Select, { components } from "react-select";
import SweetAlert2 from "react-sweetalert2";
import { FiEye } from "react-icons/fi";
import { VscThreeBars } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { Nav } from "react-bootstrap";
import { toast } from "react-toastify";
import { DataContext } from "../component/DataProvider";

let Admin_dash = () => {
  let [data, setData] = useState("1");
  let navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(true);
  const [swalProps, setSwalProps] = useState({ show: false });

  let [ck, setCk] = useState(false);
  const [dotsRef, setDotsRef] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const toggleModal = (e) => {
    if (!showModal) {
      positionModal();
    }
    setShowModal(!showModal);
  };
  const positionModal = () => {
    if (dotsRef) {
      const rect = dotsRef.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };
  let [fulldatafull, setFulldatafull] = useState();
  let [basicall, setBasicall] = useState();
  let [alldrop, setAlldrop] = useState([]);
  let [basic, setBasic] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  let [basicone, setBasicone] = useState([]);
  let [hubb, setHubb] = useState([]);
  let [user, setUser] = useState({});

  let [newusers, setNewuser] = useState({});

  let [mydata, setMydata] = useState();
  let [username, setUsername] = useState();
  let [email, setEmail] = useState();

  const [rotation, setRotation] = useState(0);

  let [editname, setEditname] = useState();
  let [editemail, setEditemail] = useState();
  let [editpass, setEditpass] = useState();

  let [editnamebool, setEditnamebool] = useState(true);
  let [editemailbool, setEditemailbool] = useState(true);
  let [editpassbool, setEditpassbool] = useState(true);

  let [btncolor, setButtoncolor] = useState(false);

  let [searchvalue, setSearchvalue] = useState("");
  const { state } = useContext(DataContext);

  const handleChangehubone = (selectedss) => {
    console.log(selectedss, "selectedssselectedssselectedss");
    setHubb(selectedss);
    checkuserddd();
  };

  const handleChange = (selected) => {
    console.log(JSON.stringify(selected), "selected");

    setSelectedOptions(selected || []);

    const output = [{ value: "All", label: "All Hubs" }];

    // // Iterate through the search array
    selected.forEach(({ value }) => {
      // Search in the data object
      Object.entries(alldrop).forEach(([key, items]) => {
        if (key === value) {
          // If the key matches, add all items from the group to the output
          items.forEach((item) => {
            output.push({ value: key + "-" + item.name, label: item.name });
          });
        } else {
          // Search within the group's items
          items.forEach((item) => {
            if (item.name === value) {
              output.push({ value: key + "-" + item.name, label: key });
            }
          });
        }
      });
    });

    setBasicone(output);
    checkuserddd();
  };

  useEffect(() => {
    loginCheckstart(state?.user)
    // loginCheck();
  }, []);

  

  useEffect(() => {

    

    console.log( state , 'statestatestatestatestate' )
    getone(state?.data);
  }, []);

  useEffect(() => {
    // getuser()
  }, []);

  const CustomPlaceholder = ({ children, getValue }) => {
    const selected = getValue();
    if (selected.length) {
      const allLabels = selected.map((option) => option.label).join(", ");

      // Limit to single line with ellipsis
      const maxLength = 10; // Adjust as needed
      const displayText =
        allLabels.length > maxLength
          ? allLabels.slice(0, maxLength) + "..."
          : allLabels;

      return <span title={allLabels}>{displayText}</span>;
    }
    return null;
  };

  let newuseredit = () => {
    console.log(mydata, "ggggggggggg");
    if (editname === undefined || editname === "" || editname === null) {
      setSwalProps({
        show: true,
        title: "Enter Valid Username",
        text: " ",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    if (editpass === undefined || editpass === "" || editpass === null) {
      setSwalProps({
        show: true,
        title: "Enter Valid Password",
        text: " ",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    // setSwalProps({
    //   show: true,
    //   title: 'Invalid password',
    //   text: ' ',
    //   icon: 'error',
    //   didClose: () => {
    //     console.log('Swal closed');
    //     setSwalProps({ show: false });
    //   }
    // });

    let newData = {
      [mydata.Email.replace(".com", "")]: {
        Password: editpass,
        name: editname,

        Email: mydata.Email,
        Role: mydata.Role,
        venue: mydata.venue,
        hub: mydata.hub,
      },
    };

    const db = getDatabase(app);
    const eventsRefs = ref(db, "user");

    const dateQuerys = query(eventsRefs);

    // Fetch the results
    update(dateQuerys, newData)
      .then(() => {
        setSwalProps({
          show: true,
          title: "User Updated successfully!",
          text: "",
          icon: "success",
          didClose: () => {
            console.log("Swal closed");
            setSwalProps({ show: false });
          },
        });
        setButtoncolor(false);
        getuser();
        return;

        console.log("Data added successfully!");
      })
      .catch((error) => {
        setSwalProps({
          show: true,
          title: error,
          text: "",
          icon: "error",
          didClose: () => {
            console.log("Swal closed");
            setSwalProps({ show: false });
          },
        });
        return;
        console.error("Error adding data:", error);
      });
  };

  let getuser = async () => {
    const db = getDatabase(app);
    const eventsRefs = ref(db, "user");

    const dateQuerys = query(eventsRefs);

    // Fetch the results
    get(dateQuerys)
      .then((snapshots) => {
        if (snapshots.exists()) {
          const eventss = snapshots.val();
          setUser(eventss);
          console.log(JSON.stringify(eventss), "eventsseventss");
        } else {
          console.log("No events found between the dates.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: isSelected ? "#f0f8ff" : "white",
          color: isSelected ? "#0073e6" : "black",
          cursor: "pointer",
        }}
      >
        {
          <div class="switch-containers" style={{ marginRight: 4 }}>
            <input checked={isSelected} type="checkbox" id="switch3" />
            <label class="switch-label" for="switch3"></label>
          </div>
        }
        <span style={{ flexGrow: 1 }}>{data.label}</span>
      </div>
    );
  };

  let [usedname, setUsedname] = useState("");
  function getName(data) {
    if (!data.venue || data.venue.length === 0) {
      return data.name; // Default to name if venue is missing or empty
    }

    const hasAll = data.venue.some((v) => v.value === "All");

    if (hasAll && data.venue.length > 1) {
      return data.name;
    } else if (data.venue.length === 1 && !hasAll) {
      return data.venue[0].value;
    }

    return data.name;
  }

  let changeddddd = (seee, fineee, third) => {
    const emailKey = fineee.Email.replace(/\.com/g, ""); // Firebase doesn't allow dots in keys

    console.log(emailKey);

    if (third === "venue") {
      const db = getDatabase(app);
      const userRef = ref(db, `user/${emailKey}/venue`);

      set(userRef, seee) // Using `update` to modify only the `hub` field
        .then(() => {
          console.log(`Hub updated successfully for ${email}!`);
          loginCheck();
        })
        .catch((error) => {
          console.error(`Error updating hub for ${email}:`, error);
        });
    } else {
      const db = getDatabase(app);
      const userRef = ref(db, `user/${emailKey}/hub`);

      set(userRef, seee) // Using `update` to modify only the `hub` field
        .then(() => {
          console.log(`Hub updated successfully for ${email}!`);
          loginCheck();
        })
        .catch((error) => {
          console.error(`Error updating hub for ${email}:`, error);
        });
    }
    console.log(seee, fineee);
  };

  let loginCheckstart = async (snapshot) => {
    let getdata = sessionStorage.getItem("data");
    if (getdata === undefined || getdata === "" || getdata === null) {
      sessionStorage.removeItem("data");
      navigate("/");
      return;
    }
    let decry = decrypt(getdata);

    let parsedatajson = JSON.parse(decry);
    let name = getName(parsedatajson);
    setUsedname(name);
    setBasicall(parsedatajson); 
 
      const userData = snapshot 
      setUser(userData);
      setNewuser(userData);
      // Check if the password matches
      const foundUser = Object.values(userData).find(
        (user) => user.Email === parsedatajson.Email
      );

      if (foundUser) {
        if (foundUser.Role === "emp") {
          sessionStorage.removeItem("data");
          navigate("/");
          return;
        }
        setMydata(foundUser);
        // Check if the password matches
        if (foundUser.Password === parsedatajson.Password) {
          setEditname(foundUser.name);
          setEditemail(foundUser.Email);
          setEditpass(foundUser.Password);
        } else {
          // navigate('/')
          return;
        }
      } else {
        console.log("User does not exist.");
      } 
  };


  let loginCheck = async () => {
    let getdata = sessionStorage.getItem("data");
    if (getdata === undefined || getdata === "" || getdata === null) {
      sessionStorage.removeItem("data");
      navigate("/");
      return;
    }
    let decry = decrypt(getdata);

    let parsedatajson = JSON.parse(decry);
    let name = getName(parsedatajson);
    setUsedname(name);
    setBasicall(parsedatajson);
    const db = getDatabase(app);
    const newDocRef = ref(db, `user`);

    const snapshot = await get(newDocRef); // Fetch the data for the user

    if (snapshot.exists()) {
      const userData = snapshot.val();
      setUser(userData);
      setNewuser(userData);
      // Check if the password matches
      const foundUser = Object.values(userData).find(
        (user) => user.Email === parsedatajson.Email
      );

      if (foundUser) {
        if (foundUser.Role === "emp") {
          sessionStorage.removeItem("data");
          navigate("/");
          return;
        }
        setMydata(foundUser);
        // Check if the password matches
        if (foundUser.Password === parsedatajson.Password) {
          setEditname(foundUser.name);
          setEditemail(foundUser.Email);
          setEditpass(foundUser.Password);
        } else {
          // navigate('/')
          return;
        }
      } else {
        console.log("User does not exist.");
      }
    }
  };

  let getone = (eventss) => {  

          const result = {};
          Object.entries(eventss).forEach(([groupName, groupData]) => {
            Object.entries(groupData).forEach(([keyss, valuess]) => {
              Object.entries(valuess).forEach(([keyssa, valuessa]) => {
                if (!result[keyss]) {
                  result[keyss] = [];
                }

                result[keyss].push({
                  name: keyssa + "-" + keyss,
                });
              });
            });
          });
          setAlldrop(result);

          const optionsone = [{ value: "All", label: "All Venue" }];
          Object.entries(eventss).forEach(([groupName, groupData]) => {
            Object.keys(groupData).forEach((key) => {
              optionsone.push({ value: key, label: key });
            });
          });

          console.log("options:", optionsone);
          // console.log("optionss:", optionsstwo);

          setBasic(optionsone);
      
  };

  const encrypt = (plainText) => {
    const cipherText = CryptoJS.AES.encrypt(plainText, "secretKey").toString();
    console.log(cipherText, "cipherText");
    return cipherText;
  };

  const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, "secretKey");
    const plainText = bytes.toString(CryptoJS.enc.Utf8);
    return plainText;
  };

  let checkuserddd = () => {
    console.log(data, "dataaaaaaaaaaaa");

    if (username === undefined || username === "" || username === null) {
      setCk(false);
      return;
    }

    if (email === undefined || email === "" || email === null) {
      setCk(false);
      return;
    }

    function isValidEmail(emails) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(emails);
    }
    let emailveri = isValidEmail(email);

    if (emailveri === false) {
      setCk(false);
      return;
    }

    if (selectedOptions.length === 0) {
      setCk(false);
      return;
    }

    if (hubb.length === 0) {
      setCk(false);
      return;
    }

    function isEmailExists(emails) {
      return Object.values(user).some((user) => user.Email === emails);
    }

    let ecii = isEmailExists(email);

    if (ecii === true) {
      setCk(false);
      return;
    }

    setCk(true);
  };

  let newuser = () => {
    if (data === "4" || data === "5" || data === "6") {
      return;
    }
    if (
      !username &&
      !email &&
      hubb.length === 0 &&
      selectedOptions.length === 0
    ) {
      setSwalProps({
        show: true,
        title: "All fields are mandatory",
        text: " ",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }
    if (username === undefined || username === "" || username === null) {
      setSwalProps({
        show: true,
        title: "Enter Valid Username",
        text: " ",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    if (email === undefined || email === "" || email === null) {
      setSwalProps({
        show: true,
        title: "Enter Valid Email",
        text: " ",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    function isValidEmail(emails) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(emails);
    }
    let emailveri = isValidEmail(email);

    if (emailveri === false) {
      setSwalProps({
        show: true,
        title: "Enter Valid Email",
        text: " ",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    if (selectedOptions.length === 0) {
      setSwalProps({
        show: true,
        title: "Select Venue",
        text: "",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    if (hubb.length === 0) {
      setSwalProps({
        show: true,
        title: "Select Hubs",
        text: "",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    function isEmailExists(emails) {
      return Object.values(user).some((user) => user.Email === emails);
    }

    let ecii = isEmailExists(email);

    if (ecii === true) {
      setSwalProps({
        show: true,
        title: "Email Already Used",
        text: "",
        icon: "error",
        didClose: () => {
          console.log("Swal closed");
          setSwalProps({ show: false });
        },
      });
      return;
    }

    // setSwalProps({
    //   show: true,
    //   title: 'Invalid password',
    //   text: ' ',
    //   icon: 'error',
    //   didClose: () => {
    //     console.log('Swal closed');
    //     setSwalProps({ show: false });
    //   }
    // });

    let newData = {
      [email.replace(".com", "")]: {
        Email: email,
        Password: "password",
        Role: data === "1" ? "admin" : data === "2" ? "manager" : "emp",
        name: username,
        venue: selectedOptions,
        hub: hubb,
      },
    };

    const db = getDatabase(app);
    const eventsRefs = ref(db, "user");

    const dateQuerys = query(eventsRefs);

    // Fetch the results
    update(dateQuerys, newData)
      .then(() => {
        setUsername("");
        setEmail("");
        setHubb([]);
        setSelectedOptions([]);
        setSwalProps({
          show: true,
          title: "User added successfully!",
          text: "",
          icon: "success",
          didClose: () => {
            console.log("Swal closed");
            setSwalProps({ show: false });
          },
        });

        setCk(false);
        getuser();
        return;

        console.log("Data added successfully!");
      })
      .catch((error) => {
        setSwalProps({
          show: true,
          title: error,
          text: "",
          icon: "error",
          didClose: () => {
            console.log("Swal closed");
            setSwalProps({ show: false });
          },
        });
        return;
        console.error("Error adding data:", error);
      });

    console.log(username, "username");
    console.log(email, "email");
    console.log(hubb, "hubb");
    console.log(selectedOptions, "selectedOptions");
  };

  const handleRotate = () => {
    if (openDropdown) {
      setRotation((prevRotation) => prevRotation - 90); // Rotates by 90 degrees on each click
    } else {
      setRotation((prevRotation) => prevRotation + 90); // Rotates by 90 degrees on each click
    }
  };

  let searchresult = (val) => {
    console.log(val);
    console.log(JSON.stringify(user), "useruseruseruser ");

    const regex = new RegExp(val, "i"); // Case-insensitive search

    const filteredUsers = Object.values(newusers).filter(
      (user) => regex.test(user.Email) || regex.test(user.name)
    );

    setUser(filteredUsers);
  };

  const [boxWidth, setBoxWidth] = useState(
    window.innerWidth >= 1400 ? 190 : window.innerWidth >= 1024 ? 180 : 160
  );
  const [ml, setMl] = useState(
    window.innerWidth >= 1400 ? 50 : window.innerWidth >= 1024 ? 45 : 40
  );
  const [mml, setMml] = useState(
    window.innerWidth >= 1400 ? 33 : window.innerWidth >= 1024 ? 28 : 24
  );
  const [sh, setSh] = useState(
    window.innerWidth >= 1400 ? 45 : window.innerWidth >= 1024 ? 40 : 35
  );
  const [fs, setFs] = useState(
    window.innerWidth >= 1400 ? 20 : window.innerWidth >= 1024 ? 16 : 16
  );
  const [fss, setFss] = useState(
    window.innerWidth >= 1400 ? 16 : window.innerWidth >= 1024 ? 14 : 14
  );

  useEffect(() => {
    const handleResize = () => {
      setBoxWidth(
        window.innerWidth >= 1400 ? 190 : window.innerWidth >= 1024 ? 180 : 160
      );
      setMl(
        window.innerWidth >= 1400 ? 50 : window.innerWidth >= 1024 ? 45 : 40
      );
      setMml(
        window.innerWidth >= 1400 ? 33 : window.innerWidth >= 1024 ? 28 : 24
      );
      setSh(
        window.innerWidth >= 1400 ? 45 : window.innerWidth >= 1024 ? 40 : 35
      );
      setFs(
        window.innerWidth >= 1400 ? 20 : window.innerWidth >= 1024 ? 16 : 16
      );
      setFss(
        window.innerWidth >= 1400 ? 16 : window.innerWidth >= 1024 ? 14 : 14
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="hide-scrollbar" style={{ overflow: "hidden" }}>
      <div
        className=""
        style={{
          height: 52,
          background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }}
      >
        <div
          className="row justify-content-between "
          style={{ paddingLeft: "2%", paddingRight: "2%", height: 52 }}
        >
          <div
            style={{ padding: 13 }}
            className="d-flex col"
            onClick={() => {
              navigate(-1);
            }}
          >
            <img
              src="arrow.png"
              style={{ width: 20, height: 20, marginTop: 3 }}
              alt="Example Image"
            />
            <p
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#fff",
                marginLeft: 10,
                marginTop: -3,
              }}
            >
              HOME
            </p>
          </div>
          <div
            style={{ padding: 13 }}
            className="d-flex text-center justify-content-center col"
          >
            <p
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#fff",
                paddingLeft: 0,
                marginTop: -3,
              }}
            >
              {usedname}
            </p>
          </div>

          <div
            style={{ padding: 13 }}
            className="d-flex  justify-content-end col"
          >
            <img
              src="Menu_Logo.png"
              style={{ width: 56, height: 28 }}
              alt="Example Image"
            />
            <p
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#fff",
                marginLeft: 10,
                marginTop: -3,
              }}
            >
              knowledge
            </p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#ECF1F4", height: "100vh" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between p-3 ">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <img
              src="sett.png"
              style={{ width: 30, height: 30 }}
              alt="Settings Icon"
            />
            <p className="mb-0 ms-2 fs-4  fw-bold" style={{ color: "#1A1A1B" }}>
              SETTINGS
            </p>
          </div>

          <div className="col-12 col-md-8 col-lg-6">
            <div className="custom-inputoness" style={{ marginRight : '4%' , backgroundColor : 'rgb(226 227 227)' }}>
              <div className="input-group position-relative d-flex align-items-center" style={{ backgroundColor : 'rgb(226 227 227)' }}>
                <input
                  onChange={(e) => {
                    setSearchvalue(e.target.value);
                    searchresult(e.target.value);
                  }}
                  value={searchvalue}
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="Search..."
                  style={{
                    paddingRight: "2.5rem",
                    height: sh,
                    backgroundColor : 'rgb(226 227 227)'
                  }}
                />
                <div
                  className="position-absolute fdfvdsfvsdvsdzxcvsd"
                  style={{
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  🔍
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-block d-lg-none p-2">
          <div
            ref={(ref) => setDotsRef(ref)}
            onClick={toggleModal}
            style={{ cursor: "pointer" }}
          >
            {showModal ? <RxCross2 size={24} /> : <VscThreeBars size={24} />}
          </div>
        </div>

        {/* Custom positioned modal */}
        {showModal && (
          <div
            className="position-fixed   shadow rounded"
            style={{
              backgroundColor: "#ECF1F4",
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
              width: boxWidth + 40,
              zIndex: 1050,

              padding: "10px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <div className="menu-content">
              {/* Admin */}
              <div
                onClick={() => {
                  setData("1");
                  setUsername("");
                  setEmail("");
                  setSelectedOptions([]);
                  setSelectedOptions([]);
                  toggleModal();
                }}
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  border:
                    data === "1" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                  height: 58,
                  marginLeft: -33,
                  padding: 10,
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                <p
                  className="font-size"
                  style={{
                    color: "#1A1A1B",
                    fontWeight: 400,
                    marginTop: 5,
                    margin: 0,
                    marginLeft: ml,
                  }}
                >
                  Admin
                </p>
              </div>

              {/* Managers */}
              <div
                onClick={() => {
                  setData("2");

                  setUsername("");
                  setEmail("");
                  setSelectedOptions([]);
                  setSelectedOptions([]);
                  toggleModal();
                }}
                style={{
                  marginTop: 15,
                  borderRadius: 10,
                  border:
                    data === "2" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                  height: 58,
                  padding: 10,
                  marginLeft: -33,
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                <p
                  className="font-size"
                  style={{
                    color: "#1A1A1B",
                    fontWeight: 400,
                    marginTop: 5,
                    margin: 0,
                    marginLeft: ml,
                  }}
                >
                  Managers
                </p>
              </div>

              {/* Employees */}
              <div
                onClick={() => {
                  setData("3");

                  setUsername("");
                  setEmail("");
                  setSelectedOptions([]);
                  setSelectedOptions([]);
                  toggleModal();
                }}
                style={{
                  marginTop: 15,
                  borderRadius: 10,
                  marginLeft: -33,
                  border:
                    data === "3" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                  height: 58,
                  padding: 10,
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                <p
                  className="font-size"
                  style={{
                    color: "#1A1A1B",
                    fontWeight: 400,
                    marginTop: 5,
                    margin: 0,
                    marginLeft: ml,
                  }}
                >
                  Employees
                </p>
              </div>

              {/* Roles */}
              <div
                onClick={() => {
                  setData("4");

                  setUsername("");
                  setEmail("");
                  setSelectedOptions([]);
                  setSelectedOptions([]);
                  toggleModal();
                }}
                style={{
                  marginTop: 15,
                  borderRadius: 10,
                  marginLeft: -33,
                  border:
                    data === "4" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                  height: 58,
                  padding: 10,
                  width: "100%",
                  cursor: "pointer",
                }}
                className="d-flex"
              >
                <img
                  src="manset.png"
                  style={{
                    marginLeft: ml,
                    marginRight: 0,
                    width: 40,
                    height: 40,
                    marginTop: 2,
                  }}
                  alt="Roles Icon"
                />
                <p
                  className="font-size"
                  style={{
                    color: "#1A1A1B",
                    fontWeight: 400,
                    marginTop: 5,
                    margin: 0,
                  }}
                >
                  Roles
                </p>
              </div>

              {/* Security */}
              <div
                onClick={() => {
                  setData("5");

                  setUsername("");
                  setEmail("");
                  setSelectedOptions([]);
                  setSelectedOptions([]);
                  toggleModal();
                }}
                style={{
                  marginTop: 15,
                  marginBottom: 10,
                  borderRadius: 10,
                  marginLeft: -33,
                  border:
                    data === "5" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                  height: 58,
                  padding: 10,
                  width: "100%",
                  cursor: "pointer",
                }}
                className="d-flex"
              >
                <img
                  src="settings.png"
                  style={{
                    marginLeft: ml,
                    marginRight: 0,
                    width: 40,
                    height: 40,
                    marginTop: 0,
                  }}
                  alt="Security Icon"
                />
                <p
                  className="font-size"
                  style={{
                    color: "#1A1A1B",
                    fontWeight: 400,
                    marginTop: 5,
                    margin: 0,
                  }}
                >
                  Security
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop to close modal when clicking outside */}
        {showModal && (
          <div
            onClick={() => setShowModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1040,
            }}
          />
        )}

        <div className="d-flex " style={{ height: "60%" , marginTop : 50 }}>
          <div className=" d-lg-block d-none">
            <div>
              <Nav.Link
                onClick={() => {
                  handleRotate();
                  setOpenDropdown(!openDropdown);
                }}
                className="font-size"
                style={{
                  cursor: "pointer",
                  color: "#1A1A1B",
                  fontWeight: "400",
                  width: boxWidth,
                }}
              >
                <img
                  src="down.png"
                  style={{
                    marginLeft: 20,
                    transform: `rotate(${rotation}deg)`,
                    height: "10px",
                    width: "14px",
                  }}
                  alt="Example Image"
                />
                <img
                  src="person.png"
                  style={{
                    marginTop: -6,
                    marginLeft: 10,
                    marginRight: 8,
                    height: "20px",
                    width: "24px",
                  }}
                  alt="Example Image"
                />
                <span className="font-size"> Users</span>
              </Nav.Link>
              {openDropdown && (
                <div className="ms-lg-3 ms-md-0">
                  <div
                    onClick={() => {
                      setData("1");
                      setUsername("");
                      setEmail("");
                      setSelectedOptions([]);
                      setSelectedOptions([]);
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border:
                        data === "1"
                          ? "3px solid #316AAF"
                          : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: boxWidth,
                      cursor: "pointer",
                    }}
                  >
                    <p
                      className="font-size"
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        marginTop: 5,
                        margin: 0, // Removes default margin
                        marginLeft: ml,
                      }}
                    >
                      Admin
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setData("2");

                      setUsername("");
                      setEmail("");
                      setSelectedOptions([]);
                      setSelectedOptions([]);
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border:
                        data === "2"
                          ? "3px solid #316AAF"
                          : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: boxWidth,
                      cursor: "pointer",
                    }}
                  >
                    <p
                      className="font-size"
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        marginTop: 5,
                        margin: 0, // Removes default margin
                        marginLeft: ml,
                      }}
                    >
                      Managers
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      setData("3");

                      setUsername("");
                      setEmail("");
                      setSelectedOptions([]);
                      setSelectedOptions([]);
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border:
                        data === "3"
                          ? "3px solid #316AAF"
                          : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: boxWidth,
                      cursor: "pointer",
                    }}
                  >
                    <p
                      className="font-size"
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        marginTop: 5,
                        margin: 0, // Removes default margin
                        marginLeft: ml,
                      }}
                    >
                      Employees
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setData("4");

                      setUsername("");
                      setEmail("");
                      setSelectedOptions([]);
                      setSelectedOptions([]);
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border:
                        data === "4"
                          ? "3px solid #316AAF"
                          : "3px solid #ECF1F4",
                      marginLeft: -36,
                      height: 58,
                      padding: 10,
                      width: boxWidth,
                      cursor: "pointer",
                    }}
                    className="d-flex"
                  >
                    <img
                      src="manset.png"
                      style={{
                        marginLeft: ml,
                        marginRight: 0,
                        width: 40,
                        height: 40,
                        marginTop: 2,
                      }}
                      alt="Example Image"
                    />

                    <p
                      className="font-size"
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        marginTop: 5,
                        margin: 0, // Removes default margin
                      }}
                    >
                      Roles
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setData("5");

                      setUsername("");
                      setEmail("");
                      setSelectedOptions([]);
                      setSelectedOptions([]);
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border:
                        data === "5"
                          ? "3px solid #316AAF"
                          : "3px solid #ECF1F4",
                      marginLeft: -40,
                      height: 58,
                      padding: 10,
                      width: boxWidth + 10,
                      cursor: "pointer",
                    }}
                    className="d-flex"
                  >
                    <img
                      src="settings.png"
                      style={{
                        marginLeft: ml,
                        marginRight: 0,
                        width: 40,
                        height: 40,
                        marginTop: 0,
                      }}
                      alt="Example Image"
                    />
                    <p
                      className="font-size"
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        marginTop: 5,
                        margin: 0, // Removes default margin
                      }}
                    >
                      Security
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="custom-padding "
            style={{
              width: "100%",
              overflow:
                data === "1" || data === "2" || data === "3"
                  ? "auto"
                  : "hidden",
            }}
          >
            <div
              style={{ border: "1px solid #9F9F9F", height: "100%" , marginTop : 10 }}
              className="ggggggggg"
            >
              {data === "1" || data === "2" || data === "3" ? (
                <>
                  <div
                    className="d-flex"
                    style={{
                      backgroundColor: "#DADADA",
                      padding: 20,
                      height: 60,
                    }}
                  >
                    <div style={{ width: "20%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Name
                      </p>
                    </div>
                    <div style={{ width: "20%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Email
                      </p>
                    </div>
                    <div style={{ width: "20%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Last sign-in
                      </p>
                    </div>
                    <div  style={{ width: "20%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Venue permission
                      </p>
                    </div>
                    <div className="px-md-2 px-lg-0" style={{ width: "20%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Hub permission
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex "
                    style={{
                      padding: 20,
                      height: 60,
                      backgroundColor: "#FCFCFC",
                    }}
                  >
                    <div style={{ width: "20%" }} className="d-flex">
                      <img
                        src="lolp.png"
                        className="nerrrimg"
                        alt="Example Image"
                      />
                      <input
                        onChange={(e) => {
                          setUsername(e.target.value);
                          checkuserddd();
                        }}
                        value={username}
                        type="text"
                        className="form-control"
                        placeholder="Add new user"
                        style={{
                          fontSize: fs,
                          border: "none",
                          padding: "0",
                          boxShadow: "none",
                        }}
                      />
                    </div>
                    <div style={{ width: "20%" }} className="d-flex">
                      {" "}
                      <input
                        type="text"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          checkuserddd();
                        }}
                        value={email}
                        className="form-control"
                        placeholder="Type in email"
                        style={{
                          fontSize: fs,
                          border: "none",
                          boxShadow: "none",
                          marginLeft: -14,
                        }}
                      />
                    </div>
                    <div className="ms-md-3 ms-lg-0" style={{ width: "20%" }}>
                      <p style={{ color: "#1A1A1B", fontWeight: "400" }}>-</p>
                    </div>
                    <div style={{ width: "20%", paddingRight: 20 }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        <Select
                          isMulti
                          className="newoneonees"
                          options={basic}
                          value={selectedOptions}
                          onChange={handleChange}
                          placeholder="Select options..."
                          components={{
                            Option: CustomOption,
                            MultiValue: () => null, // Hides default tags
                            ValueContainer: ({ children, ...props }) => {
                              const selectedValues = props.getValue();
                              return (
                                <components.ValueContainer {...props}>
                                  {selectedValues.length > 0 ? (
                                    <CustomPlaceholder {...props} />
                                  ) : (
                                    children
                                  )}
                                </components.ValueContainer>
                              );
                            },
                          }}
                          closeMenuOnSelect={false} // Keep dropdown open for further selection
                          hideSelectedOptions={false} // Show all options even if selected
                          styles={{
                            control: (base) => ({
                              ...base,
                              border: "unset",
                              color: "#1A1A1B",
                              marginTop: -8,
                              fontSize: fss,
                            }),
                          }}
                        />
                      </p>
                    </div>
                    <div
                      style={{
                        width: "20%",
                        paddingRight: 20,
                        color: "#1A1A1B",
                        fontSize: fs,
                      }}
                    >
                      <Select
                        isMulti
                        className="newoneonees"
                        options={basicone}
                        value={hubb}
                        onChange={handleChangehubone}
                        placeholder="Select options..."
                        components={{
                          Option: CustomOption, // Custom tick option
                          MultiValue: () => null, // Hides default tags
                          ValueContainer: ({ children, ...props }) => {
                            const selectedValues = props.getValue();
                            return (
                              <components.ValueContainer {...props}>
                                {selectedValues.length > 0 ? (
                                  <CustomPlaceholder {...props} />
                                ) : (
                                  children
                                )}
                              </components.ValueContainer>
                            );
                          },
                        }}
                        closeMenuOnSelect={false} // Keep dropdown open for further selection
                        hideSelectedOptions={false} // Show all options even if selected
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "unset",
                            color: "#1A1A1B",
                            marginTop: -8,
                            fontSize: fss,
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <hr
                    style={{
                      margin: "0px 0px",
                      backgroundColor: "#9F9F9F",
                      height: 1,
                    }}
                  />
                </>
              ) : data === "4" ? (
                <div style={{ height: "40vh" }}>
                  <div
                    className="d-flex"
                    style={{
                      backgroundColor: "#DADADA",
                      padding: 20,
                      height: 84,
                    }}
                  >
                    <div style={{ width: "33%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Name
                      </p>
                    </div>
                    <div style={{ width: "34%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Access
                      </p>
                    </div>
                    <div style={{ width: "33%" }}>
                      <p
                        style={{
                          color: "#1A1A1B",
                          fontWeight: "400",
                          fontSize: fs,
                        }}
                      >
                        Permissions
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex"
                    style={{
                      padding: 20,
                      height: 84,
                      backgroundColor: "#ECF1F4",
                    }}
                  >
                    <div style={{ width: "33%" }} className="d-flex mt-2">
                      <p style={{ color: "#316AAF", fontWeight: "400",fontSize:fs }}>
                        Admin
                      </p>
                    </div>
                    <div style={{ width: "34%" }} className="d-flex mt-2">
                      <p style={{ color: "#707070", fontWeight: "400",fontSize:fs }}>
                        Settings, Analytics, Training videos
                      </p>
                    </div>
                    <div  className="mt-2" style={{ width: "33%" }}>
                      <p style={{ color: "#707070", fontWeight: "400",fontSize:fs }}>
                        Create any users, Reset users passwords
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      margin: "0px 0px",
                      backgroundColor: "#9F9F9F",
                      height: 1,
                    }}
                  />

                  <div
                    className="d-flex"
                    style={{
                      padding: 20,
                      height: 84,
                      backgroundColor: "#ECF1F4",
                    }}
                  >
                    <div className="mt-2 d-flex" style={{ width: "33%" }} >
                      <p style={{ color: "#316AAF", fontWeight: "400",fontSize:fs }}>
                        Managers
                      </p>
                    </div>
                    <div className="mt-2 d-flex" style={{ width: "34%" }}>
                      <p style={{ color: "#707070", fontWeight: "400",   fontSize:fs }}>
                        Analytics, Training videos
                      </p>
                    </div>
                    <div className="mt-2" style={{ width: "33%" }}>
                      <p style={{ color: "#707070", fontWeight: "400",fontSize:fs }}>
                        Create employee users, Reset personal password
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      margin: "0px 0px",
                      backgroundColor: "#9F9F9F",
                      height: 1,
                    }}
                  />

                  <div
                    className="d-flex"
                    style={{
                      padding: 20,
                      height: 84,
                      backgroundColor: "#ECF1F4",
                    }}
                  >
                    <div className="mt-2 d-flex" style={{ width: "33%" }}>
                      <p style={{ color: "#316AAF", fontWeight: "400",fontSize:fs }}>
                        Employees
                      </p>
                    </div>
                    <div className="mt-2 d-flex" style={{ width: "34%" }} >
                      <p style={{ color: "#707070", fontWeight: "400",fontSize:fs }}>
                        Training videos
                      </p>
                    </div>
                    <div className="mt-2" style={{ width: "33%" }}>
                      <p style={{ color: "#707070", fontWeight: "400",fontSize:fs }}>
                        Reset personal password
                      </p>
                    </div>
                  </div>

                  <hr
                    style={{
                      margin: "0px 0px",
                      backgroundColor: "#9F9F9F",
                      height: 1,
                    }}
                  />
                </div>
              ) : (
                <>
                  <div style={{ height: "40vh" }}>
                    <div
                      className="d-flex"
                      style={{
                        backgroundColor: "#DADADA",
                        padding: 20,
                        height: 60,
                      }}
                    >
                      <div style={{ width: "33%" }}></div>
                      <div style={{ width: "34%" }}></div>
                      <div style={{ width: "33%" }}></div>
                    </div>

                    <div
                      className="d-flex"
                      style={{
                        padding: 20,
                        height: 60,
                        backgroundColor: "#ECF1F4",
                      }}
                    >
                      <div style={{ width: "20%" }} className="d-flex">
                        <p style={{ color: "#316AAF", fontWeight: "400" }}>
                          Full Name
                        </p>
                      </div>
                      <div style={{ width: "20%" }} className="d-flex">
                        <input
                          value={editname}
                          onChange={(e) => {
                            setEditname(e.target.value);
                            setButtoncolor(true);
                          }}
                          className="form-control"
                          placeholder="Search..."
                          style={{
                            border: "none",
                            boxShadow: "none",
                            width: "100%",
                            height: 40,
                            backgroundColor: "#ECF1F4",
                            marginTop: -9,
                          }}
                          disabled={editnamebool}
                          type="text"
                          id="switch3"
                        />
                      </div>
                      <div style={{ width: "40%" }}>
                        <img
                          onClick={(e) => {
                            setEditnamebool(!editnamebool);
                          }}
                          src="pencil.png"
                          alt="Example Image"
                        />
                      </div>
                    </div>

                    <hr
                      style={{
                        margin: "0px 0px",
                        backgroundColor: "#9F9F9F",
                        height: 1,
                      }}
                    />

                    <div
                      className="d-flex"
                      style={{
                        padding: 20,
                        height: 60,
                        backgroundColor: "#ECF1F4",
                      }}
                    >
                      <div style={{ width: "20%" }} className="d-flex">
                        <p style={{ color: "#316AAF", fontWeight: "400" }}>
                          Email
                        </p>
                      </div>
                      <div style={{ width: "20%" }} className="d-flex">
                        <input
                          value={editemail}
                          onChange={(e) => {
                            setEditemail(e.target.value);
                            setButtoncolor(true);
                          }}
                          className="form-control"
                          placeholder="Search..."
                          style={{
                            border: "none",
                            boxShadow: "none",
                            width: "100%",
                            height: 40,
                            backgroundColor: "#ECF1F4",
                            marginTop: -9,
                          }}
                          disabled={true}
                          type="text"
                          id="switch3"
                        />
                      </div>
                      <div style={{ width: "40%" }}>
                        {/* <img onClick={(e) => {
                              setEditemailbool(!editemailbool)
                            }} src="pencil.png" alt="Example Image" /> */}
                      </div>
                    </div>

                    <hr
                      style={{
                        margin: "0px 0px",
                        backgroundColor: "#9F9F9F",
                        height: 1,
                      }}
                    />

                    <div
                      className="d-flex"
                      style={{
                        padding: 20,
                        height: 60,
                        backgroundColor: "#ECF1F4",
                      }}
                    >
                      <div style={{ width: "20%" }} className="d-flex">
                        <p style={{ color: "#316AAF", fontWeight: "400" }}>
                          Password
                        </p>
                      </div>
                      <div style={{ width: "20%" }} className="d-flex">
                        <input
                          value={editpass}
                          onChange={(e) => {
                            setEditpass(e.target.value);
                            setButtoncolor(true);
                          }}
                          className="form-control"
                          placeholder="Search..."
                          style={{
                            border: "none",
                            boxShadow: "none",
                            width: "100%",
                            height: 40,
                            backgroundColor: "#ECF1F4",
                            marginTop: -9,
                          }}
                          type={editpassbool === true ? "text" : "password"}
                          id="switch3"
                        />
                      </div>
                      <div style={{ width: "40%" }}>
                        <label class="round-checkbox">
                          <input
                            checked={editpassbool}
                            onChange={(e) => {
                              setEditpassbool(e.target.checked);
                            }}
                            type="checkbox"
                          />
                          {editpassbool ? <FiEye /> : <FiEyeOff />}
                        </label>
                      </div>
                    </div>

                    <hr
                      style={{
                        margin: "0px 0px",
                        backgroundColor: "#9F9F9F",
                        height: 1,
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ overflow: "auto", height: "46vh" }}>
                {data === "1" ? (
                  <>
                    {Object.entries(user)
                      .filter(([_, value]) => value.Role === "admin") // Filter only admins
                      .map(([key, value]) => {
                        // const modifiedData = value.venue.map(item => ({   
                        //   label: item.label,
                        //   value: item.value.split("-")[0] // Extracts only the first part before "-"
                        // }));

                        return (
                          <>
                            <div
                              className="d-flex"
                              style={{
                                padding: 20,
                                height: 60,
                                backgroundColor: "#ECF1F4",
                              }}
                            >
                              <div style={{ width: "20%" }} className="d-flex">
                                <img
                                  src="lolp.png"
                                  className="nerrrimg"
                                  alt="Example Image"
                                />
                                <p
                                  style={{
                                    color: "#316AAF",
                                    fontWeight: "400",
                                    fontSize: fs,
                                  }}
                                >
                                  {value.name}
                                </p>
                              </div>
                              <div
  style={{ 
    width: "20%",  
    display: "flex",  
    alignItems: "center"  // Align text vertically
  }}
  onClick={() => {
    console.log(JSON.stringify(basic), "value.hubvalue.hub");
  }}
>
  <p
    style={{
      color: "#707070",
      fontWeight: "400",
      fontSize: fs,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      width: "100%",  // Ensure the text obeys the container width
    }}
  >
    {value.Email}
  </p>
</div>

                              <div className="ms-md-3 ms-lg-0" style={{ width: `20%` }}>
                                <p
                                  style={{
                                    color: "#1A1A1B",
                                    fontWeight: "400",
                                    fontSize: fs,
                                  }}
                                >
                                  -
                                </p>
                              </div>
                              <div
                                style={{
                                  width: `20%`,
                                  paddingRight: 20,
                                  color: "#1A1A1B",
                                  fontSize: fs,
                                }}
                              >
                                <Select
                                  isMulti
                                  className="newoneoneess"
                                  options={basic}
                                  value={value.venue} // Shows selected values
                                  onChange={(e) => {
                                    changeddddd(e, value, "venue");
                                  }} // Prevent selection changes
                                  // placeholder={value.venue[0].label + "..."}
                                  placeholder={value.venue?.length ? value.venue[0].label + "..." : "Select Venue"}

                                  components={{
                                    Option: CustomOption,
                                    MultiValue: () => null, // Hides default tags
                                    ValueContainer: ({
                                      children,
                                      ...props
                                    }) => {
                                      const selectedValues = props.getValue();
                                      return (
                                        <components.ValueContainer {...props}>
                                          {selectedValues.length > 0 ? (
                                            <CustomPlaceholder {...props} />
                                          ) : (
                                            children
                                          )}
                                        </components.ValueContainer>
                                      );
                                    },
                                  }} // Keep dropdown open for further selection
                                  closeMenuOnSelect={true} // Keep dropdown open for further selection
                                  hideSelectedOptions={false} // Disables all options from being selected
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      border: "unset",
                                      marginTop: -8,
                                      color: "#1A1A1B",
                                      fontSize: fss,
                                    }),
                                  }}
                                />
                              </div>
                              <div style={{ width: "20%", paddingRight: 20 }}>
                                <Select
                                  isMulti
                                  className="newoneoneess"
                                  options={basicone}
                                  value={value.hub} // Shows selected values
                                  onChange={() => {}} // Prevent selection changes
                                  // placeholder={value.hub[0].label + "..."}
                                  placeholder={value.hub?.length ? value.hub[0].label + "..." : "Select Hub"}

                                  components={{
                                    Option: CustomOption,
                                    MultiValue: () => null, // Hides default tags
                                    ValueContainer: ({
                                      children,
                                      ...props
                                    }) => {
                                      const selectedValues = props.getValue();
                                      return (
                                        <components.ValueContainer {...props}>
                                          {selectedValues.length > 0 ? (
                                            <CustomPlaceholder {...props} />
                                          ) : (
                                            children
                                          )}
                                        </components.ValueContainer>
                                      );
                                    },
                                  }}
                                  closeMenuOnSelect={false} // Keep dropdown open for further selection
                                  hideSelectedOptions={false} // Show all options even if selected
                                  isOptionDisabled={() => true} // Disables all options from being selected
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      border: "unset",
                                      marginTop: -8,
                                      color: "#1A1A1B",
                                      fontSize: fss,
                                    }),
                                  }}
                                />
                              </div>
                            </div>

                            <hr
                              style={{
                                margin: "0px 0px",
                                backgroundColor: "#9F9F9F",
                                height: 1,
                              }}
                            />
                          </>
                        );
                      })}
                  </>
                ) : data === "2" ? (
                  <>
                    {Object.entries(user)
                      .filter(([_, value]) => value.Role === "manager") // Filter only admins
                      .map(([key, value]) => (
                        <>
                          <div
                            className="d-flex"
                            style={{
                              padding: 20,
                              height: 60,
                              backgroundColor: "#ECF1F4",
                            }}
                          >
                            <div style={{ width: "20%" }} className="d-flex">
                              <img
                                src="lolp.png"
                                className="nerrrimg"
                                alt="Example Image"
                              />
                              <p
                                style={{
                                  color: "#316AAF",
                                  fontWeight: "400",
                                  fontSize: fs,
                                }}
                              >
                                {value.name}
                              </p>
                            </div>
                            <div style={{ width: "20%" }} className="d-flex">
                              <p
                                style={{
                                  color: "#707070",
                                  fontWeight: "400",
                                  fontSize: fs,
                                }}
                              >
                                {value.Email}
                              </p>
                            </div>
                            <div style={{ width: "20%" }}>
                              <p
                                style={{
                                  color: "#1A1A1B",
                                  fontWeight: "400",
                                  fontSize: fs,
                                }}
                              >
                                -
                              </p>
                            </div>
                            <div
                              style={{
                                width: "20%",
                                paddingRight: 20,
                                color: "#1A1A1B",
                                fontSize: fs,
                              }}
                            >
                              <Select
                                isMulti
                                className="newoneoneess"
                                options={basic}
                                value={value.venue} // Shows selected values
                                onChange={(e) => {
                                  changeddddd(e, value, "venue");
                                }} // Prevent selection changes
                                placeholder={value.venue?.length ? value.venue[0].label + "..." : "Select Venue"}

                                components={{
                                  Option: CustomOption,
                                  MultiValue: () => null, // Hides default tags
                                  ValueContainer: ({ children, ...props }) => {
                                    const selectedValues = props.getValue();
                                    return (
                                      <components.ValueContainer {...props}>
                                        {selectedValues.length > 0 ? (
                                          <CustomPlaceholder {...props} />
                                        ) : (
                                          children
                                        )}
                                      </components.ValueContainer>
                                    );
                                  },
                                }} // Keep dropdown open for further selection
                                closeMenuOnSelect={true} // Keep dropdown open for further selection
                                hideSelectedOptions={false} // Disables all options from being selected
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    border: "unset",
                                    marginTop: -8,
                                    color: "#1A1A1B",
                                    fontSize: fss,
                                  }),
                                }}
                              />
                            </div>
                            <div style={{ width: "20%", paddingRight: 20 }}>
                              <Select
                                isMulti
                                className="newoneoneess"
                                options={basicone}
                                value={value.hub} // Shows selected values
                                onChange={() => {}} // Prevent selection changes
                                // placeholder={value.hub[0].label + "..."}
                                placeholder={value.hub?.length ? value.hub[0].label + "..." : "Select Hub"}

                                components={{
                                  Option: CustomOption,
                                  MultiValue: () => null, // Hides default tags
                                  ValueContainer: ({ children, ...props }) => {
                                    const selectedValues = props.getValue();
                                    return (
                                      <components.ValueContainer {...props}>
                                        {selectedValues.length > 0 ? (
                                          <CustomPlaceholder {...props} />
                                        ) : (
                                          children
                                        )}
                                      </components.ValueContainer>
                                    );
                                  },
                                }}
                                closeMenuOnSelect={false} // Keep dropdown open for further selection
                                hideSelectedOptions={false} // Show all options even if selected
                                isOptionDisabled={() => true} // Disables all options from being selected
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    border: "unset",
                                    marginTop: -8,
                                    color: "#1A1A1B",
                                    fontSize: fss,
                                  }),
                                }}
                              />
                            </div>
                          </div>

                          <hr
                            style={{
                              margin: "0px 0px",
                              backgroundColor: "#9F9F9F",
                              height: 1,
                            }}
                          />
                        </>
                      ))}
                  </>
                ) : data === "3" ? (
                  <>
                    {Object.entries(user)
                      .filter(([_, value]) => value.Role === "emp") // Filter only admins
                      .map(([key, value]) => (
                        <>
                          <div
                            className="d-flex"
                            style={{
                              padding: 20,
                              height: 60,
                              backgroundColor: "#ECF1F4",
                            }}
                          >
                            <div style={{ width: "20%" }} className="d-flex">
                              <img
                                src="lolp.png"
                                className="nerrrimg"
                                alt="Example Image"
                              />
                              <p
                                style={{ color: "#316AAF", fontWeight: "400" }}
                              >
                                {value.name}
                              </p>
                            </div>
                            <div style={{ width: "20%" }} className="d-flex">
                              <p
                                style={{ color: "#707070", fontWeight: "400" }}
                              >
                                {value.Email}
                              </p>
                            </div>
                            <div style={{ width: "20%" }}>
                              <p
                                style={{ color: "#1A1A1B", fontWeight: "400" }}
                              >
                                -
                              </p>
                            </div>
                            <div
                              style={{
                                width: "20%",
                                paddingRight: 20,
                                color: "#1A1A1B",
                              }}
                            >
                              <Select
                                isMulti
                                className="newoneoneess"
                                options={basic}
                                value={value.venue} // Shows selected values
                                onChange={(e) => {
                                  changeddddd(e, value, "venue");
                                }} // Prevent selection changes
                                placeholder={value.venue?.length ? value.venue[0].label + "..." : "Select Venue"}

                                components={{
                                  Option: CustomOption,
                                  MultiValue: () => null, // Hides default tags
                                  ValueContainer: ({ children, ...props }) => {
                                    const selectedValues = props.getValue();
                                    return (
                                      <components.ValueContainer {...props}>
                                        {selectedValues.length > 0 ? (
                                          <CustomPlaceholder {...props} />
                                        ) : (
                                          children
                                        )}
                                      </components.ValueContainer>
                                    );
                                  },
                                }} // Keep dropdown open for further selection
                                closeMenuOnSelect={true} // Keep dropdown open for further selection
                                hideSelectedOptions={false} // Disables all options from being selected
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    border: "unset",
                                    marginTop: -8,
                                    color: "#1A1A1B",
                                    fontSize:fss
                                  }),
                                }}
                              />
                            </div>
                            <div style={{ width: "20%", paddingRight: 20 }}>
                              <Select
                                isMulti
                                className="newoneoneess"
                                options={basicone}
                                value={value.hub} // Shows selected values
                                onChange={() => {}} // Prevent selection changes
                                placeholder={value.hub?.length ? value.hub[0].label + "..." : "Select Hub"}

                                components={{
                                  Option: CustomOption,
                                  MultiValue: () => null, // Hides default tags
                                  ValueContainer: ({ children, ...props }) => {
                                    const selectedValues = props.getValue();
                                    return (
                                      <components.ValueContainer {...props}>
                                        {selectedValues.length > 0 ? (
                                          <CustomPlaceholder {...props} />
                                        ) : (
                                          children
                                        )}
                                      </components.ValueContainer>
                                    );
                                  },
                                }}
                                closeMenuOnSelect={false} // Keep dropdown open for further selection
                                hideSelectedOptions={false} // Show all options even if selected
                                isOptionDisabled={() => true} // Disables all options from being selected
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    border: "unset",
                                    marginTop: -8,
                                    color: "#1A1A1B",
                                    fontSize:fss
                                  }),
                                }}
                              />
                            </div>
                          </div>

                          <hr
                            style={{
                              margin: "0px 0px",
                              backgroundColor: "#9F9F9F",
                              height: 1,
                            }}
                          />
                        </>
                      ))}
                  </>
                ) : data === "4" ? (
                  <></>
                ) : data === "5" ? (
                  <></>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        {data === "1" || data === "2" || data === "3" || data == "4" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer",
              marginTop: 20,
            }}
          >
            <div
              onClick={() => {
                newuser();
              }}
              style={{
                backgroundColor: ck === true ? "#316AAF" : "#316AAF",
                width: 100,
                height: 35,
                borderRadius: 5,
                padding: 6,
                textAlign: "center",
                marginRight: 50,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  color: "#fff",
                  margin: 0,
                }}
              >
                Save
              </p>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              cursor: "pointer",
              marginTop: 20,
            }}
          >
            <div
              onClick={() => {
                if (btncolor === true) {
                  newuseredit();
                }
              }}
              style={{
                backgroundColor: btncolor === true ? "#316AAF" : "#316AAF",
                width: 100,
                height: 35,
                borderRadius: 5,
                padding: 6,
                textAlign: "center",
                marginRight: 50,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  color: "#fff",
                  margin: 0,
                }}
              >
                Save
              </p>
            </div>
          </div>
        )}
      </div>

      <SweetAlert2 {...swalProps} />
    </div>
  );
};

export default Admin_dash;
