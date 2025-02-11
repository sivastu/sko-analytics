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
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from "firebase/database";
import app from "./firebase";
import Select, { components } from 'react-select';

import { Nav } from "react-bootstrap";

let Admin_dash = () => {
  let [data, setData] = useState('1');
  let navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(true);



  let [fulldatafull, setFulldatafull] = useState()
  let [basicall, setBasicall] = useState()
  let [alldrop, setAlldrop] = useState([])
  let [basic, setBasic] = useState()
  const [selectedOptions, setSelectedOptions] = useState([]);
  let [basicone, setBasicone] = useState([])
  let [hubb, setHubb] = useState([])
  let [ user , setUser ] = useState({})


  const handleChangehubone = (selectedss) => {
    console.log(selectedss, 'selectedssselectedssselectedss')
    setHubb(selectedss)
  };


  const handleChange = (selected) => {
    console.log(JSON.stringify(selected), 'selected')

    setSelectedOptions(selected || []);


    const output = [];

    // // Iterate through the search array
    selected.forEach(({ value }) => {
      // Search in the data object
      Object.entries(alldrop).forEach(([key, items]) => {
        if (key === value) {
          // If the key matches, add all items from the group to the output
          items.forEach(item => {
            output.push({ value: key + '-' + item.name, label: item.name });
          });
        } else {
          // Search within the group's items
          items.forEach(item => {
            if (item.name === value) {
              output.push({ value: key + '-' + item.name, label: key });
            }
          });
        }
      });
    });

    setBasicone(output)
  };


  useEffect(() => {
    loginCheck()
  }, [])


  useEffect(() => {
    getone()
  }, [])

  useEffect(() => {
    getuser()
  }, [])


  const CustomPlaceholder = ({ children, getValue }) => {
    const selected = getValue();
    if (selected.length) {
      const allLabels = selected.map(option => option.label).join(", ");

      // Limit to single line with ellipsis
      const maxLength = 10; // Adjust as needed
      const displayText = allLabels.length > maxLength ? allLabels.slice(0, maxLength) + "..." : allLabels;

      return <span title={allLabels}>{displayText}</span>;
    }
    return null;
  };

  let getuser = async () => {
    const db = getDatabase(app);
    const eventsRefs = ref(db, "user");

    const dateQuerys = query(
      eventsRefs,
    );

    // Fetch the results
    get(dateQuerys)
      .then((snapshots) => {
        if (snapshots.exists()) {
          const eventss = snapshots.val();
          setUser(eventss)
          console.log(JSON.stringify(eventss), 'eventsseventss')

        } else {
          console.log("No events found between the dates.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }




  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: isSelected ? '#f0f8ff' : 'white',
          color: isSelected ? '#0073e6' : 'black',
          cursor: 'pointer',
        }}
      >
        {<div class="switch-containers" style={{ marginRight: 4 }}>
          <input checked={isSelected}
            type="checkbox" id="switch3" />
          <label class="switch-label" for="switch3"></label>
        </div>}
        <span style={{ flexGrow: 1 }}>{data.label}</span>

      </div>
    );
  };

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

  let getone = () => {


    const db = getDatabase(app);
    const eventsRefs = ref(db, "Data");

    const dateQuerys = query(
      eventsRefs,
    );

    // Fetch the results
    get(dateQuerys)
      .then((snapshots) => {
        if (snapshots.exists()) {
          const eventss = snapshots.val();




          const result = {};
          Object.entries(eventss).forEach(([groupName, groupData]) => {


            Object.entries(groupData).forEach(([keyss, valuess]) => {
              Object.entries(valuess).forEach(([keyssa, valuessa]) => {

                if (!result[keyss]) {
                  result[keyss] = [];
                }

                result[keyss].push({
                  name: keyssa + "-" + keyss
                });

              });
            });

          });
          setAlldrop(result)




          const optionsone = [];
          Object.entries(eventss).forEach(([groupName, groupData]) => {
            Object.keys(groupData).forEach((key) => {
              optionsone.push({ value: key, label: key });
            });
          });


          console.log("options:", optionsone);
          // console.log("optionss:", optionsstwo);

          setBasic(optionsone)



        } else {
          console.log("No events found between the dates.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
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
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginTop: -3 }} >(Group Name)</p>
            </div>

            <div style={{ padding: 13 }} className="d-flex" >
              <img src="newlogo.png" style={{ width: 40, height: 22 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >knowledge</p>
            </div>

          </div>
        </div>

      </div>

      <div style={{ backgroundColor: "#ECF1F4", height: '100vh' }} >

        <div className="d-flex justify-content-between p-5">
          <div className="d-flex justify-content-between  " >
            <img src="sett.png" style={{ width: 30, height: 30 }} alt="Example Image" />
            <p style={{ fontSize: 27, fontWeight: '700', color: "#1A1A1B", marginLeft: 10, marginTop: -7 }} >SETTINGS</p>
          </div>
          <div >


            <div >
              <div className="custom-inputoness d-flex justify-content-between" style={{
                width: 650,
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

            </div>

          </div>
        </div>

        <div className="d-flex " style={{ height : '60%' }} >

          <div className=" " >
            <div>
              <Nav.Link
                onClick={() => setOpenDropdown(!openDropdown)}
                style={{ cursor: "pointer", color: '#1A1A1B', fontWeight: '400', fontSize: 21 }}
              >
                <img src="down.png" style={{ width: 10, height: 10, marginLeft: 20 }} alt="Example Image" /> 👤  Users
              </Nav.Link>
              {openDropdown && (
                <div className="ms-3">


                  <div
                    onClick={() => {
                      setData('1')
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border: data === '1' ? "3px solid #316AAF" : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: 191,
                      cursor: 'pointer'

                    }}
                  >
                    <p
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        fontSize: 21,
                        margin: 0, // Removes default margin
                        marginLeft: 50
                      }}
                    >
                      Admin
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setData('2')
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border: data === "2" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: 191,
                      cursor: 'pointer'
                    }}
                  >
                    <p
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        fontSize: 21,
                        margin: 0, // Removes default margin
                        marginLeft: 50
                      }}
                    >
                      Managers
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      setData('3')
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border: data === "3" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: 191,
                      cursor: 'pointer'

                    }}
                  >
                    <p
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        fontSize: 21,
                        margin: 0, // Removes default margin
                        marginLeft: 50
                      }}
                    >
                      Employees
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setData('4')
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border: data === "4" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: 191,
                      cursor: 'pointer'

                    }}
                  >

                    <p
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        fontSize: 21,
                        margin: 0, // Removes default margin
                        marginLeft: 50
                      }}
                    >
                      Roles
                    </p>
                  </div>


                  <div
                    onClick={() => {
                      setData('5')
                    }}
                    style={{
                      marginTop: 30,
                      borderRadius: 10,
                      border: data === "5" ? "3px solid #316AAF" : "3px solid #ECF1F4",
                      marginLeft: -33,
                      height: 58,
                      padding: 10,
                      width: 191,
                      cursor: 'pointer'

                    }}
                  >
                    <p
                      style={{
                        color: "#1A1A1B",
                        fontWeight: 400,
                        fontSize: 21,
                        margin: 0, // Removes default margin
                        marginLeft: 50
                      }}
                    >
                      Security
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className=" " style={{ paddingLeft: 50, paddingRight: 50, width: '100%' , overflow : 'auto' }} >
            <div style={{ border: '1px solid #9F9F9F',  }} className="ggggggggg" >
              <div className="d-flex" style={{ backgroundColor: '#DADADA', padding: 20, height: 60 }} >
                <div style={{ width: '20%' }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }}>Name</p>
                </div>
                <div style={{ width: '20%' }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }}>Email</p>
                </div>
                <div style={{ width: '20%' }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }}>Last sign-in</p>
                </div>
                <div style={{ width: '20%' }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }} >Venue permission</p>
                </div>
                <div style={{ width: '20%' }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }}>Hub permission</p>
                </div>
              </div>

              <div className="d-flex" style={{ padding: 20, height: 60, backgroundColor: "#FCFCFC" }} >
                <div style={{ width: '20%', }} className="d-flex">
                  <img src="down.png" alt="Example Image" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add new user"
                    style={{
                      border: "none",
                      boxShadow: "none",
                    }}
                  />
                </div>
                <div style={{ width: '20%' }} className="d-flex"> <input
                  type="text"
                  className="form-control"
                  placeholder="Type in email"
                  style={{
                    border: "none",
                    boxShadow: "none",
                    marginLeft: -14
                  }}
                />
                </div>
                <div style={{ width: '20%' }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }}>-</p>
                </div>
                <div style={{ width: '20%', paddingRight: 20 }}>
                  <p style={{ color: '#1A1A1B', fontWeight: '400' }} >
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
                              {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                            </components.ValueContainer>
                          );
                        },
                      }}
                      closeMenuOnSelect={false} // Keep dropdown open for further selection
                      hideSelectedOptions={false} // Show all options even if selected
                      styles={{
                        control: (base) => ({ ...base, border: 'unset', color: '#707070', marginTop: -8 }),
                      }}
                    /></p>
                </div>
                <div style={{ width: '20%', paddingRight: 20 }}>
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
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false} // Keep dropdown open for further selection
                    hideSelectedOptions={false} // Show all options even if selected
                    styles={{
                      control: (base) => ({ ...base, border: 'unset', color: '#707070', marginTop: -8 }),
                    }}
                  />
                </div>
              </div>

              <hr style={{ margin: '0px 0px', backgroundColor: '#9F9F9F', height: 1 }} />


              {Object.entries(user).map(([key, value]) => (
                // <div key={key} style={{ marginBottom: 10, padding: 10, background: "#F3F3F3", borderRadius: 5 }}>
                //   <h4 style={{ margin: 0 }}>{key}</h4>
                //   <p style={{ margin: 0 }}>Email: {value.Email}</p>
                //   <p style={{ margin: 0 }}>Role: {value.Role}</p>
                // </div>
                <>
                  <div className="d-flex" style={{ padding: 20, height: 60, backgroundColor: "#FCFCFC" }} >
                    <div style={{ width: '20%', }} className="d-flex">
                      <img src="down.png" alt="Example Image" />
                      <p style={{ color: '#316AAF', fontWeight: '400' }} >{value.name }</p>
                    </div>
                    <div style={{ width: '20%' }} className="d-flex">
                    <p style={{ color: '#707070', fontWeight: '400' }} >{value.Email}</p>
                    </div>
                    <div style={{ width: '20%' }}>
                      <p style={{ color: '#1A1A1B', fontWeight: '400' }}>-</p>
                    </div>
                    <div style={{ width: '20%', paddingRight: 20 }}>
                      <p style={{ color: '#1A1A1B', fontWeight: '400' }} >
                          </p>
                    </div>
                    <div style={{ width: '20%', paddingRight: 20 }}>
                      <p></p>
                    </div>
                  </div>

                  <hr style={{ margin: '0px 0px', backgroundColor: '#9F9F9F', height: 1 }} />
                </>
              ))}
    
            </div>
          </div>


          <div ></div>

        </div>

      </div>
    </div>
  );
};

export default Admin_dash;
