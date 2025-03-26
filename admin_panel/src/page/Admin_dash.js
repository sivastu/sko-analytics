import React, { useEffect, useState, useContext , useRef } from "react";
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
import { FaEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
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
import DropdownSelect from "react-dropdown-select";

import SweetAlert2 from "react-sweetalert2";
import { FiEye } from "react-icons/fi";
import { VscThreeBars } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import { Nav } from "react-bootstrap";
import { toast } from "react-toastify";
import { DataContext } from "../component/DataProvider";
import { concat, debounce } from "lodash";


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

  const [showEditModalAdmin, setShowEditModalAdmin] = useState(false); // For edit modal
  const [showDeleteModalAdmin, setShowDeleteModalAdmin] = useState(false); // For delete modal
  const [selectedAdmin, setSelectedAdmin] = useState(null); // For selected admin
  const [adminToDelete, setAdminToDelete] = useState(null); // For admin to delete

  const [showEditModalManager, setShowEditModalManager] = useState(false); // For edit modal
  const [showDeleteModalManager, setShowDeleteModalManager] = useState(false); // For delete modal
  const [selectedManager, setSelectedManager] = useState(null); // For selected manager
  const [managerToDelete, setManagerToDelete] = useState(null); // For manager to delete

  const [showEditModalEmployee, setShowEditModalEmployee] = useState(false); // For edit modal
  const [showDeleteModalEmployee, setShowDeleteModalEmployee] = useState(false); // For delete modal
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For selected employee
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // For employee to delete

  const selectRef = useRef(null);
  const selectRefone = useRef(null);

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [menuIsOpenone, setMenuIsOpenone] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (selectRef.current && !selectRef.current.contains(event.target)) {
            setMenuIsOpen(false);
          } 


          if (selectRefone.current && !selectRefone.current.contains(event.target)) {
            setMenuIsOpenone(false);
          }


        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
  




  // Handle edit button click for admins
  const handleAdminEditClick = (admin) => {
    setSelectedAdmin({
      ...admin,
      oldEmail: admin.Email, // Store the old email for reference
    });
    setShowEditModalAdmin(true); // Open the edit modal
  };

  // Handle delete button click for admins
  const handleDeleteAdminClick = (admin) => {
    setAdminToDelete(admin); // Set the admin to delete
    setShowDeleteModalAdmin(true); // Open the delete modal
  };

  // Handle edit button click for managers
  const handleManagerEditClick = (manager) => {
    setSelectedManager(manager); // Set the selected manager
    setShowEditModalManager(true); // Open the edit modal
  };

  const handleDeleteManagerClick = (manager) => {
    setManagerToDelete(manager); // Set the manager to delete
    setShowDeleteModalManager(true); // Open the delete modal
  };
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedManager(null);
  };
  const handleManagerInputChange = (e) => {
    setSelectedManager({
      ...selectedManager,
      [e.target.name]: e.target.value,
    });
  };

  // Handle editing an admin
  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    const db = getDatabase(app);

    // Get the old email (before editing)
    const EmailKey = selectedAdmin.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys
    const userRef = ref(db, `user/${EmailKey}`)

    try {
      // Step 1: Delete the old admin entry
      await set(userRef, selectedAdmin);
      toast.success("Admin updated successfully!");
      setShowEditModalAdmin(false); // Close the modal
      getuser(); // Refresh the user list
      // console.log(selectedAdmin)
      // setUsedname(selectedAdmin.name)
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("An error occurred while updating the admin.");
    }
  };

  // Handle deleting an admin
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;

    const db = getDatabase(app);

    const emailKey = adminToDelete.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys
    const userRef = ref(db, `user/${emailKey}`);

    try {
      await set(userRef, null); // Delete the admin from the database
      toast.success("Admin deleted successfully!");
      setShowDeleteModalAdmin(false); // Close the modal
      getuser(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("An error occurred while deleting the admin.");
    }
  };
  // Handle editing a manager
  const handleEditManager = async () => {
    if (!selectedManager) return;

    const db = getDatabase(app);
    const emailKey = selectedManager.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys
    const userRef = ref(db, `user/${emailKey}`);

    try {
      await set(userRef, selectedManager); // Update the manager in the database
      toast.success("Manager updated successfully!");
      setShowEditModalManager(false); // Close the modal
      getuser(); // Refresh the user list
    } catch (error) {
      console.error("Error updating manager:", error);
      toast.error("An error occurred while updating the manager.");
    }
  };

  // Handle deleting a manager
  const handleDeleteManager = async () => {
    if (!managerToDelete) return;

    const db = getDatabase(app);
    const emailKey = managerToDelete.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys
    const userRef = ref(db, `user/${emailKey}`);

    try {
      await set(userRef, null); // Delete the manager from the database
      toast.success("Manager deleted successfully!");
      setShowDeleteModalManager(false); // Close the modal
      getuser(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting manager:", error);
      toast.error("An error occurred while deleting the manager.");
    }
  };
  // Handle edit button click for employees
  const handleEmployeeEditClick = (employee) => {
    setSelectedEmployee(employee); // Set the selected employee
    setShowEditModalEmployee(true); // Open the edit modal
  };

  // Handle delete button click for employees
  const handleDeleteEmployeeClick = (employee) => {
    setEmployeeToDelete(employee); // Set the employee to delete
    setShowDeleteModalEmployee(true); // Open the delete modal
  };
  // Handle editing an employee
  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    const db = getDatabase(app);
    const emailKey = selectedEmployee.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys
    const userRef = ref(db, `user/${emailKey}`);

    try {
      await set(userRef, selectedEmployee); // Update the employee in the database
      toast.success("Employee updated successfully!");
      setShowEditModalEmployee(false); // Close the modal
      getuser(); // Refresh the user list
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("An error occurred while updating the employee.");
    }
  };

  let [oldtak, setOldtak] = useState([])
  let [oldtaks, setOldtaks] = useState([])

  // Handle deleting an employee
  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    const db = getDatabase(app);
    const emailKey = employeeToDelete.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys
    const userRef = ref(db, `user/${emailKey}`);

    try {
      await set(userRef, null); // Delete the employee from the database
      toast.success("Employee deleted successfully!");
      setShowDeleteModalEmployee(false); // Close the modal
      getuser(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("An error occurred while deleting the employee.");
    }
  };

  const handleChangehubone = (selectedss) => {

    const hasAllValue = selectedss.some(item => item.value === "All");
    const hasAllValueold = oldtaks.some(item => item.value === "All");


    console.log(hasAllValue, hasAllValueold, 'hasAllValuehasAllValuehasAllValuehasAllValue')

    setOldtaks(selectedss)

    if (hasAllValue === false && hasAllValueold === true) {

      console.log(hasAllValue, hasAllValueold, 'workeeedddddddd')
      setHubb([]);
      checkuserddd();
      return
    }



    if (hasAllValue === true) {

      setHubb([...basicone, ...[{ value: "All", label: "All Hubs" }]]);
      checkuserddd();


    } else {
      setHubb(selectedss);
      checkuserddd();
    }


  };


  const handleChange = (selected) => {
    console.log(JSON.stringify(selected), "selected");

    // setSelectedOptions(selected || []); 


    ///   { value: "All", label: "All Hubs" }

    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldtak.some(item => item.value === "All");

    setOldtak(selected)

    if (hasAllValue === false && hasAllValueold === true) {
      const output = [];
      [].forEach(({ value }) => {
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
      setSelectedOptions([]);
      setBasicone(output);
      checkuserddd();

      return

    }

    if (hasAllValue === true) {

      const output = [{ value: "All", label: "All Hubs" }];
      basic.forEach(({ value }) => {
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
      setSelectedOptions(basic);
      setBasicone(output);
      checkuserddd();



    } else {
      const output = [{ value: "All", label: "All Hubs" }];
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
      setSelectedOptions(selected);
      setBasicone(output);
      checkuserddd();
    }




    // // Iterate through the search array

  };

  useEffect(() => {
    loginCheckstart(state?.user)
    // loginCheck();
  }, []);



  useEffect(() => {


    getone(state?.data);
  }, []);

  useEffect(() => {
    // getuser()
  }, []);

  const [openSelectId, setOpenSelectId] = useState(null); // Track open Select




  const customContentRenderer = ({ props, state }) => {
    const selectedLabels = state.values.map((item) => item.label).join(", ");

    const maxLength = textCount;
    // Truncate text if it exceeds 18 characters
    const displayText =
      selectedLabels.length > maxLength ? selectedLabels.slice(0, maxLength) + "..." : selectedLabels;

    return (
      <div style={{ padding: "5px", color: "#333" }}>
        {state.values.length > 0 ? displayText : "Select an option"}
      </div>
    );
  };



  const CustomPlaceholder = ({ getValue }) => {
    const selected = getValue();
    if (selected.length) {
      const allLabels = selected.map((option) => option.label).join(", ");

      // Limit to single line with ellipsis
      const maxLength = 10; // Adjust as needed
      const displayText =
        allLabels.length > maxLength ? allLabels.slice(0, maxLength) + "..." : allLabels;

      return (
        <span title={allLabels} style={{
          display: "inline-block",
          maxWidth: "100px", // Adjust width as needed
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {displayText}
        </span>
      );
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
      [mydata.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, "")]: {
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


  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };




  let changeddddd = (seee, fineee, third) => {



    console.log(seee, 'third')


    const emailKey = fineee.Email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, ""); // Firebase doesn't allow dots in keys

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

      console.log(seee, fineee, third, 'seee, fineee, third')
      const db = getDatabase(app);
      const userRef = ref(db, `user/${emailKey}/hub`);

      set(userRef, seee) // Using `update` to modify only the `hub` field
        .then(() => {
          console.log(`Hub updated successfully for ${emailKey}!`);
          loginCheck();
        })
        .catch((error) => {
          console.error(`Error updating hub for ${email}:`, error);
        });
    }
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

      console.log(userData, 'thsi is snapshot')
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

    const optionsone = [{ value: "All", label: "All Venues" }];
    Object.entries(eventss).forEach(([groupName, groupData]) => {
      optionsone.push({ value: groupName, label: groupName });

      Object.keys(groupData).forEach((key) => {
        
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
      [email.replace(/\.com$/, "").replace(/[.#$/\[\]]/g, "")]: {
        Email: email,
        Password: "password",
        Role: data === "1" ? "admin" : data === "2" ? "manager" : "emp",
        name: username,
        venue: selectedOptions.filter(item => item.value !== "All"),
        hub: hubb.filter(item => item.value !== "All"),
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
  const gettextcount = () => {
    if (window.innerWidth >= 1836) return 15;
    if (window.innerWidth >= 1536) return 10; // 2xl
    if (window.innerWidth >= 1380) return 8; // xl
    if (window.innerWidth >= 1024) return 7; // lg
    if (window.innerWidth >= 768) return 5;  // md
    return 5; // default for smaller screens
  };
  const [textCount, setTextCount] = useState(gettextcount());

  const [boxWidth, setBoxWidth] = useState(
    window.innerWidth >= 1400 ? 'auto' : window.innerWidth >= 1024 ? 'auto' : 'auto'
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


  const handleChanges = debounce((e, value, byebye) => {
    changeddddd(e, value, byebye);
  }, 10);


  useEffect(() => {
    const handleResize = () => {
      setTextCount(gettextcount()),
        setBoxWidth(
          window.innerWidth >= 1400 ? 'auto' : window.innerWidth >= 1024 ? 'auto' : 'auto'
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
        window.innerWidth >= 1400 ? 20 : window.innerWidth >= 1024 ? 14 : 14
      );
      setFss(
        window.innerWidth >= 1400 ? 16 : window.innerWidth >= 1024 ? 14 : 14
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  function formatReadableDate(isoDate) {
    const date = new Date(isoDate);

    const day = date.getDate(); // Get day (1-31)
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const year = date.getFullYear(); // Get full year

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format

    return `${day}/${month}/${year} ${hours}.${minutes < 10 ? "0" : ""}${minutes}${ampm}`;
  }
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
              web app
            </p>
          </div>
        </div>
      </div>


      <div style={{ backgroundColor: "#ECF1F4", height: "100vh" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between p-3 ">
          <div className="d-flex align-items-center mb-3 mb-md-0" style={{ paddingLeft: '1%' }}>
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
            <div className="custom-inputoness" style={{ marginRight: '4%', backgroundColor: 'rgb(226 227 227)' }}>
              <div className="input-group position-relative d-flex align-items-center" style={{ backgroundColor: 'rgb(226 227 227)' }}>
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
                    backgroundColor: 'rgb(226 227 227)'
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
                  width: 50,
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

        <div className="d-flex " style={{ height: "60%", marginTop: 50 }}>
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
                  display: 'flex'
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
                <span className="font-size" style={{ marginTop: openDropdown === false ? -10 : -10 }}> Users</span>
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

          {data === "1" || data === "2" || data === "3" ? (
            <>
              <div className="custom-padding " style={{ width: '100%' }}>
                <div

                  style={{
                    width: "100%",
                    overflow: "auto",
                    border: "1px solid #9F9F9F", height: "100%", marginTop: 10
                  }}
                >
                  <div
                    style={{}}
                  >


                    <div
                      className="d-flex"
                      style={{
                        backgroundColor: "#DADADA",
                        padding: 20,
                        height: 60,
                      }}
                    >
                      {[
                        "Name",
                        "Email",
                        "Last sign-in",
                        "Venue permission",
                        "Hub permission",
                        "Action",
                      ].map((header, index) => (
                        <div
                          key={index}
                          style={{
                            width: index === 5 ? "5%" : "19%", // "Action" column gets smaller width
                          }}
                          className={index >= 4 ? "px-md-2 px-lg-0" : ""}
                        >
                          <p
                            style={{
                              color: "#1A1A1B",
                              fontWeight: "400",
                              fontSize: fs,
                              whiteSpace: header === "Venue permission" ? "nowrap" : "normal",
                            }}
                          >
                            {header}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div
                      className="d-flex"
                      style={{
                        padding: 20,
                        height: 60,
                        backgroundColor: "#FCFCFC",
                      }}
                    >
                      <div style={{ width: "19%" }} className="d-flex">
                        <img src="lolp.png" className="nerrrimg" alt="Example Image" />
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

                      <div style={{ width: "19%" }} className="d-flex">
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

                      <div className="ms-md-3 ms-lg-0" style={{ width: "19%" }}>
                        <p style={{ color: "#1A1A1B", fontWeight: "400" }}>-</p>
                      </div>
                      <div  ref={selectRef}   style={{ width: "19%", paddingRight: 20 }}>
                        <Select
                           menuIsOpen={menuIsOpen}
                           onMenuOpen={() => setMenuIsOpen(true)}
                           onMenuClose={() => setMenuIsOpen(false)}
                           onFocus={() => setMenuIsOpen(true)}
                          isMulti
                          className="newoneonees"
                          options={basic}
                          value={selectedOptions}
                          onChange={handleChange}
                          components={{
                            Option: CustomOption,
                            MultiValue: () => null,

                            ValueContainer: ({ children, ...props }) => {
                              const selectedValues = props.getValue();
                              return (
                                <components.ValueContainer {...props} >
                                  {selectedValues.length > 0 ? (
                                    <CustomPlaceholder {...props} />
                                  ) : (
                                    children
                                  )}
                                </components.ValueContainer>
                              );
                            },
                          }}
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          styles={{
                            control: (base) => ({
                              ...base,
                              color: "#1A1A1B",
                              marginTop: -8,
                              fontSize: fss,
                            }),
                          }}
                        />
                      </div>

                      <div ref={selectRefone} style={{ width: "19%", paddingRight: 20 }}>
                        <Select
                         menuIsOpen={menuIsOpenone}
                         onMenuOpen={() => setMenuIsOpenone(true)}
                         onMenuClose={() => setMenuIsOpenone(false)}
                         onFocus={() => setMenuIsOpenone(true)}

                          isMulti
                          className="newoneonees"
                          options={basicone}
                          value={hubb}
                          onChange={handleChangehubone}
                          components={{
                            Option: CustomOption,
                            MultiValue: () => null,
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
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          styles={{
                            control: (base) => ({
                              ...base,
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
                  </div>

                  <div style={{ overflow: "auto", height: "46vh" }}>
                    {data === "1" ? (
                      <>
                        {Object.entries(user)
                          .filter(([_, value]) => value.Role === "admin") // Filter only admins
                          .map(([key, value]) => {



                            const output = [];


                            if (Array.isArray(value.venue)) {
                              value.venue.forEach(({ value }) => {
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
                            } else {
                              console.error("value.venue is not an array or is undefined:", value.venue);
                            }

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
                                    backgroundColor: "#ECF1F4",
                                    height: 60
                                  }}
                                >
                                  <div style={{ width: "19%", display: "flex", alignItems: "center" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center", // Centers items vertically
                                        overflow: "hidden", // Prevents content from overflowing
                                        whiteSpace: "nowrap", // Keeps text in a single line
                                      }}
                                    >
                                      <img
                                        src="lolp.png"
                                        alt="Example Image"
                                        style={{ height: "auto", verticalAlign: "middle", maxWidth: "100%" }}
                                      />
                                      <p
                                        style={{
                                          color: "#316AAF",
                                          fontWeight: "400",
                                          fontSize: fs,
                                          margin: 0, // Remove default margin
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis", // Adds "..." for overflowed text
                                          maxWidth: "100%", // Ensures it doesn't exceed container width
                                          marginLeft: 7, marginRight: 7
                                        }}
                                      >
                                        {value.name}
                                      </p>
                                    </div>
                                  </div>

                                  <div style={{ width: "19%", display: "flex", alignItems: "center" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center", // Centers items vertically
                                        overflow: "hidden", // Prevents content from overflowing
                                        whiteSpace: "nowrap", // Keeps text in a single line
                                      }}
                                    >

                                      <p
                                        style={{
                                          color: "#707070",
                                          fontWeight: "400",
                                          fontSize: fs,
                                          margin: 0, // Remove default margin
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis", // Adds "..." for overflowed text
                                          maxWidth: "100%", // Ensures it doesn't exceed container width
                                          marginLeft: 7, marginRight: 7
                                        }}
                                      >
                                        {value.Email}
                                      </p>
                                    </div>
                                  </div>


                                  <div style={{ width: "19%", display: "flex", alignItems: "center" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center", // Centers items vertically
                                        overflow: "hidden", // Prevents content from overflowing
                                        whiteSpace: "nowrap", // Keeps text in a single line
                                      }}
                                    >

                                      <p
                                        style={{
                                          color: "#707070",
                                          fontWeight: "400",
                                          fontSize: fs,
                                          margin: 0, // Remove default margin
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis", // Adds "..." for overflowed text
                                          maxWidth: "100%", // Ensures it doesn't exceed container width
                                          marginLeft: 7, marginRight: 7
                                        }}
                                      >
                                        {value?.date ? formatReadableDate(value?.date) : '-'}
                                      </p>
                                    </div>
                                  </div>





                                  <div
                                    style={{
                                      width: `19%`,
                                      paddingRight: 20,
                                      color: "#1A1A1B",
                                      fontSize: fs,
                                      display: "flex",
                                      alignItems: 'center'
                                    }}

                                    className="finefffff"
                                  >



                                    <DropdownSelect
                                     
                                      options={basic.filter(item => item.value !== "All")}
                                      values={value.venue}
                                      multi={true}
                                      onChange={(val) => {
                                        handleChanges(val, value, "venue");
                                      }}
                                      contentRenderer={customContentRenderer}
                                      dropdownRenderer={({ props, state, methods }) => (
                                        <div style={{ maxHeight: "300px", zIndex: 100000 }}>
                                        
                                          {props.options.map((option) => {
                                            const isSelected = state.values.some((val) => val.value === option.value);
                                            return (
                                              <div
                                                key={option.value + "-dropdown"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  methods.addItem(option);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignContent: "center",
                                                  padding: "10px",
                                                  gap: 5,
                                                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                  color: isSelected ? "#0073e6" : "black",
                                                  cursor: "pointer",
                                                  fontSize: fss,
                                                }}
                                              > 
                                                <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                  <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                  <label class="switch-label" for={`switch-${option.value}`}></label>
                                                </div> 
                                                <span style={{ flexGrow: 1 }}>{option.label}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      style={{
                                        border: "none",
                                        fontSize: fss,
                                      }}
                                    />







                                    {/* <Select
                                      isSearchable={false}
                                      isMulti
                                      className="newoneoneess"
                                      menuPortalTarget={document.body}
                                      options={basic}
                                      value={value.venue}
                                      onChange={(e, { action }) => {

                                        console.log(action)
                                        if (action === "select-option" || action === "remove-value" || action === "clear" || action === "deselect-option") { 
                                          handleChanges(e, value, "venue");
                                        }


                                      }} // Prevent selection changes
                                      // placeholder={value.venue[0].label + "..."}
                                      placeholder={value.venue?.length ? value.venue[0].label + "..." : "Select Venue"} 
                                      closeMenuOnSelect={false}
                                      hideSelectedOptions={false} 
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "unset",
                                          marginTop: -8,
                                          color: "#1A1A1B",
                                          fontSize: fss,
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 1000001,

                                        }),
                                      }}
                                    /> */}
                                  </div>
                                  <div style={{
                                    width: "19%", paddingRight: 20,
                                    display: "flex",
                                    alignItems: 'center'
                                  }}
                                    className="finefffff"
                                  >


<DropdownSelect
                                     
                                     options={output.filter(item => item.value !== "All")}
                                     values={value.hub}
                                     multi={true}
                                     onChange={(val) => {
                                       handleChanges(val, value, "hub");
                                     }}
                                     contentRenderer={customContentRenderer}
                                     dropdownRenderer={({ props, state, methods }) => (
                                       <div style={{ maxHeight: "300px", zIndex: 100000 }}>
                                       
                                         {props.options.map((option) => {
                                           const isSelected = state.values.some((val) => val.value === option.value);
                                           return (
                                             <div
                                               key={option.value + "-dropdown"}
                                               onClick={(e) => {
                                                 e.stopPropagation();
                                                 methods.addItem(option);
                                               }}
                                               style={{
                                                 display: "flex",
                                                 alignContent: "center",
                                                 padding: "10px",
                                                 gap: 5,
                                                 backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                 color: isSelected ? "#0073e6" : "black",
                                                 cursor: "pointer",
                                                 fontSize: fss,
                                               }}
                                             > 
                                               <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                 <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                 <label class="switch-label" for={`switch-${option.value}`}></label>
                                               </div> 
                                               <span style={{ flexGrow: 1 }}>{option.label}</span>
                                             </div>
                                           );
                                         })}
                                       </div>
                                     )}
                                     style={{
                                       border: "none",
                                       fontSize: fss,
                                     }}
                                   />



                                    {/* <DropdownSelect
                                      options={[{ value: "All", label: "All Hubs" }]}
                                      value={[{ value: "All", label: "All Hubs" }]}
                                      multi={true}
                                      onChange={(val) => {
                                        handleChanges(val, value, "hub"); 
                                      }}
                                      contentRenderer={customContentRenderer}
                                      dropdownRenderer={({ props, state, methods }) => (
                                        <div style={{ maxHeight: "300px", zIndex: 100000 }}>
                           
                                          {props.options.map((option) => {

                       
                                            const isSelected = state.values.some((val) => val.value === option.value);
                                            console.log(state, 'val.valueval.valueval.valueval.valueval.value22222222222222222222222')

                                            return (
                                              <div
                                                key={option.value + "-dropdown"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  methods.addItem(option);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignContent: "center",
                                                  padding: "10px",
                                                  gap: 5,
                                                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                  color: isSelected ? "#0073e6" : "black",
                                                  cursor: "pointer",
                                                  fontSize: fss,
                                                }}
                                              > 
                                                <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                  <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                  <label class="switch-label" for={`switch-${option.value}`}></label>
                                                </div> 
                                                <span style={{ flexGrow: 1 }}>{option.label}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      style={{
                                        border: "none",
                                        fontSize: fss,
                                      }}
                                    /> */}




                                    {/* <Select
                                      isSearchable={false}
                                      isMulti
                                      className="newoneoneess"
                                      menuPortalTarget={document.body}
                                      options={output}
                                      value={value.hub} // Shows selected values
                                      onChange={(e, { action }) => {
                                        console.log('kkkkkkkkkkkkkkkk', value)

                                        if (action === "select-option" || action === "remove-value" || action === "clear" || action === "deselect-option") {


                                          handleChanges(e, value, "hub");
                                        }




                                      }} // Prevent selection changes
                                      // placeholder={value.hub[0].label + "..."}
                                      placeholder={value.hub?.length ? value.hub[0].label + "..." : "Select Hub"}
                                      // components={{
                                      //   Option: CustomOption,
                                      //   MultiValue: () => null, // Hides default tags
                                      //   ValueContainer: ({
                                      //     children,
                                      //     ...props
                                      //   }) => {
                                      //     const selectedValues = props.getValue();
                                      //     return (
                                      //       <components.ValueContainer {...props}>
                                      //         {selectedValues.length > 0 ? (
                                      //           <CustomPlaceholder {...props} />
                                      //         ) : (
                                      //           children
                                      //         )}
                                      //       </components.ValueContainer>
                                      //     );
                                      //   },
                                      // }}
                                      closeMenuOnSelect={false} // Keep dropdown open for further selection
                                      hideSelectedOptions={false} // Show all options even if selected 
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "unset",
                                          marginTop: -8,
                                          color: "#1A1A1B",
                                          fontSize: fss,
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 1000001, // Ensure dropdown appears above everything
                                        }),
                                      }}

                                    /> */}
                                  </div>
                                  <div style={{ width: "5%", paddingLeft: "1%" }} className="d-flex justify-content-between gap-3 align-items-center ">
                                    <div
                                      onClick={() => handleAdminEditClick(value)} // Edit button
                                      style={{ cursor: "pointer" }}
                                    >
                                      <FaEdit />
                                    </div>
                                    <div
                                      onClick={() => handleDeleteAdminClick(value)} // Delete button
                                      style={{ color: "red", cursor: "pointer", marginTop: 5 }}
                                    >
                                      <FaRegTrashCan />
                                    </div>
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
                          .map(([key, value]) => {

                            const output = [];



                            if (Array.isArray(value.venue)) {
                              value.venue.forEach(({ value }) => {
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
                            } else {
                              console.error("value.venue is not an array or is undefined:", value.venue);
                            }



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
                                  <div style={{ width: "19%", display: "flex", alignItems: "center" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center", // Centers items vertically
                                        overflow: "hidden", // Prevents content from overflowing
                                        whiteSpace: "nowrap", // Keeps text in a single line
                                      }}
                                    >
                                      <img
                                        src="lolp.png"
                                        alt="Example Image"
                                        style={{ height: "auto", verticalAlign: "middle", maxWidth: "100%" }}
                                      />
                                      <p
                                        style={{
                                          color: "#316AAF",
                                          fontWeight: "400",
                                          fontSize: fs,
                                          margin: 0, // Remove default margin
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis", // Adds "..." for overflowed text
                                          maxWidth: "100%", // Ensures it doesn't exceed container width
                                          marginLeft: 7, marginRight: 7
                                        }}
                                      >
                                        {value.name}
                                      </p>
                                    </div>
                                  </div>



                                  <div
                                    style={{
                                      width: "19%",
                                      display: "flex",
                                      alignItems: "center", // Centers the p vertically
                                      height: "100%", // Ensures the div has a height
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
                                        width: "100%", // Ensures text obeys the container width
                                        margin: 0, // Remove default margin
                                      }}
                                    >
                                      {value.Email}
                                    </p>
                                  </div>

                                  <div style={{ width: "19%" }}>
                                    <p
                                      style={{
                                        color: "rgb(112, 112, 112)",
                                        fontWeight: "400",
                                        fontSize: fs,
                                        marginTop: -3
                                      }}
                                    >
                                      {value?.date ? formatReadableDate(value?.date) : '-'}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19%",
                                      paddingRight: 20,
                                      color: "#1A1A1B",
                                      fontSize: fs,
                                      display: "flex",
                                      alignItems: 'center'
                                    }}

                                    className="finefffff"

                                  >
                                    {/* <Select
                                      isMulti
                                      isSearchable={false}
                                      className="newoneoneess"
                                      menuPortalTarget={document.body}
                                      options={basic}
                                      value={value.venue}
                                      onChange={(e, { action }) => {

                                        if (action === "select-option" || action === "remove-value" || action === "clear" || action === "deselect-option") {


                                          handleChanges(e, value, "venue");
                                        }



                                      }}
                                      placeholder={value.venue?.length ? value.venue[0].label + "..." : "Select Venue"}
                                      components={{
                                        Option: CustomOption,
                                        MultiValue: () => null,
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
                                      closeMenuOnSelect={false} // Keep dropdown open for further selection
                                      hideSelectedOptions={false} // Disables all options from being selected
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "unset",
                                          marginTop: -8,
                                          color: "#1A1A1B",
                                          fontSize: fss,
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 1000001, // Ensure dropdown appears above everything
                                        }),
                                      }}
                                    /> */}

                                    <DropdownSelect
                                      options={basic.filter(item => item.value !== "All")}
                                      values={value.venue}
                                      multi={true}
                                      onChange={(val) => {

                                        console.log(val, 'successsuccesssuccesssuccesssuccess')

                                        handleChanges(val, value, "venue");
                                      }}
                                      placeholder="Select an option"
                                      contentRenderer={customContentRenderer}
                                      dropdownRenderer={({ props, state, methods }) => (
                                        <div style={{ maxHeight: "300px", zIndex: 100000 }}>
                                          {/* First Option (Placeholder) */}
                                          {/* <div
                                            key="placeholder-dropdown"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              methods.clearAll(); // Clears all selections
                                              methods.addItem({ value: "__placeholder__", label: "Select an option" });
                                            }}
                                            style={{
                                              display: "flex",
                                              alignContent: "center",
                                              padding: "10px",
                                              gap: 5,
                                              backgroundColor: "white",
                                              color: "black",
                                              cursor: "pointer",
                                              fontSize: fss,
                                            }}
                                          >
                                            <span style={{ flexGrow: 1 }}>Select an option</span>
                                          </div> */}

                                          {/* Other Options */}
                                          {props.options.map((option) => {
                                            const isSelected = state.values.some((val) => val.value === option.value);
                                            return (
                                              <div
                                                key={option.value + "-dropdown"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  methods.addItem(option);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignContent: "center",
                                                  padding: "10px",
                                                  gap: 5,
                                                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                  color: isSelected ? "#0073e6" : "black",
                                                  cursor: "pointer",
                                                  fontSize: fss,
                                                }}
                                              >
                                                {/* Checkbox Toggle */}
                                                <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                  <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                  <label class="switch-label" for={`switch-${option.value}`}></label>
                                                </div>
                                                {/* Option Label */}
                                                <span style={{ flexGrow: 1 }}>{option.label}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      style={{
                                        border: "none",
                                        fontSize: fss,
                                      }}
                                    />

                                  </div>
                                  <div style={{
                                    width: "19%", paddingRight: 20,
                                    display: "flex",
                                    alignItems: 'center'
                                  }}

                                    className="finefffff"
                                  >


<DropdownSelect
                                      options={output.filter(item => item.value !== "All")}
                                      values={value.hub}
                                      multi={true}
                                      onChange={(val) => {

                                        console.log(val, 'successsuccesssuccesssuccesssuccess')

                                        handleChanges(val, value, "venue");
                                      }}
                                      placeholder="Select an option"
                                      contentRenderer={customContentRenderer}
                                      dropdownRenderer={({ props, state, methods }) => (
                                        <div style={{ maxHeight: "300px", zIndex: 100000 }}>
                                          {/* First Option (Placeholder) */}
                                          {/* <div
                                            key="placeholder-dropdown"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              methods.clearAll(); // Clears all selections
                                              methods.addItem({ value: "__placeholder__", label: "Select an option" });
                                            }}
                                            style={{
                                              display: "flex",
                                              alignContent: "center",
                                              padding: "10px",
                                              gap: 5,
                                              backgroundColor: "white",
                                              color: "black",
                                              cursor: "pointer",
                                              fontSize: fss,
                                            }}
                                          >
                                            <span style={{ flexGrow: 1 }}>Select an option</span>
                                          </div> */}

                                          {/* Other Options */}
                                          {props.options.map((option) => {
                                            const isSelected = state.values.some((val) => val.value === option.value);
                                            return (
                                              <div
                                                key={option.value + "-dropdown"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  methods.addItem(option);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignContent: "center",
                                                  padding: "10px",
                                                  gap: 5,
                                                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                  color: isSelected ? "#0073e6" : "black",
                                                  cursor: "pointer",
                                                  fontSize: fss,
                                                }}
                                              >
                                                {/* Checkbox Toggle */}
                                                <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                  <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                  <label class="switch-label" for={`switch-${option.value}`}></label>
                                                </div>
                                                {/* Option Label */}
                                                <span style={{ flexGrow: 1 }}>{option.label}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      style={{
                                        border: "none",
                                        fontSize: fss,
                                      }}
                                    />


                                  
                                    {/* <Select
                                      isMulti
                                      isSearchable={false}
                                      className="newoneoneess"
                                      options={output}
                                      value={value.hub} // Shows selected values
                                      menuPortalTarget={document.body}
                                      onChange={(e, { action }) => {

                                        if (action === "select-option" || action === "remove-value" || action === "clear" || action === "deselect-option") {


                                          handleChanges(e, value, "hub");
                                        }
                                      }} // Prevent selection changes
                                      // placeholder={value.hub[0].label + "..."} 

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
                                          marginTop: -8,
                                          color: "#1A1A1B",
                                          fontSize: fss,
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 1000001, // Ensure dropdown appears above everything
                                        }),
                                      }}
                                    /> */}
                                  </div>
                                  <div style={{ width: '5%', paddingLeft: "1%" }} className="d-flex justify-content-between gap-3 align-items-center ">
                                    <div onClick={() => handleManagerEditClick(value)} style={{ cursor: "pointer" }}>
                                      <FaEdit />
                                    </div>
                                    <div className="" onClick={() => handleDeleteManagerClick(value)} style={{ color: "red", cursor: "pointer" }}>
                                      <FaRegTrashCan />
                                    </div>
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
                            )
                          })}

                      </>
                    ) : data === "3" ? (
                      <>
                        {Object.entries(user)
                          .filter(([_, value]) => value.Role === "emp") // Filter only admins
                          .map(([key, value]) => {


                            const output = [];


                            if (Array.isArray(value.venue)) {
                              value.venue.forEach(({ value }) => {
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
                            } else {
                              console.error("value.venue is not an array or is undefined:", value.venue);
                            }




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
                                  <div style={{ width: "19%", display: "flex", alignItems: "center" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center", // Centers items vertically
                                        overflow: "hidden", // Prevents content from overflowing
                                        whiteSpace: "nowrap", // Keeps text in a single line
                                      }}
                                    >
                                      <img
                                        src="lolp.png"
                                        alt="Example Image"
                                        style={{ height: "auto", verticalAlign: "middle", maxWidth: "100%" }}
                                      />
                                      <p
                                        style={{
                                          color: "#316AAF",
                                          fontWeight: "400",
                                          fontSize: fs,
                                          margin: 0, // Remove default margin
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                          textOverflow: "ellipsis", // Adds "..." for overflowed text
                                          maxWidth: "100%", // Ensures it doesn't exceed container width
                                          marginLeft: 7, marginRight: 7
                                        }}
                                      >
                                        {value.name}
                                      </p>
                                    </div>
                                  </div>



                                  <div
                                    style={{
                                      width: "19%",
                                      display: "flex",
                                      alignItems: "center", // Centers the p vertically
                                      height: "100%", // Ensures the div has a height
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
                                        width: "100%", // Ensures text obeys the container width
                                        margin: 0, // Remove default margin
                                      }}
                                    >
                                      {value.Email}
                                    </p>
                                  </div>

                                  <div style={{ width: "19%" }}>
                                    <p
                                      style={{
                                        color: "rgb(112, 112, 112)",
                                        fontWeight: "400",
                                        fontSize: fs,
                                      }}
                                    >
                                      {value?.date ? formatReadableDate(value?.date) : '-'}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      width: "19%",
                                      paddingRight: 20,
                                      color: "#1A1A1B",
                                      display: "flex",
                                      alignItems: 'center'
                                    }}

                                    className="custom-select-container finefffff"
                                  >

                                    <DropdownSelect
                                      options={basic.filter(item => item.value !== "All")}
                                      values={value.venue}
                                      menuPortalTarget={document.body}
                                      multi={true}
                                      onChange={(val) => {

                                        console.log(val, 'successsuccesssuccesssuccesssuccess')

                                        handleChanges(val, value, "venue");
                                      }}
                                      placeholder="Select an option"
                                      contentRenderer={customContentRenderer}
                                      dropdownRenderer={({ props, state, methods }) => (
                                        <div style={{ maxHeight: "300px", zIndex: 100000  }}>
                                          {/* First Option (Placeholder) */}
                                          {/* <div
                                            key="placeholder-dropdown"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              methods.clearAll(); // Clears all selections
                                              methods.addItem({ value: "__placeholder__", label: "Select an option" });
                                            }}
                                            style={{
                                              display: "flex",
                                              alignContent: "center",
                                              padding: "10px",
                                              gap: 5,
                                              backgroundColor: "white",
                                              color: "black",
                                              cursor: "pointer",
                                              fontSize: fss,
                                            }}
                                          >
                                            <span style={{ flexGrow: 1 }}>Select an option</span>
                                          </div> */}

                                          {/* Other Options */}
                                          {props.options.map((option) => {
                                            const isSelected = state.values.some((val) => val.value === option.value);
                                            return (
                                              <div
                                                key={option.value + "-dropdown"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  methods.addItem(option);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignContent: "center",
                                                  padding: "10px",
                                                  gap: 5,
                                                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                  color: isSelected ? "#0073e6" : "black",
                                                  cursor: "pointer",
                                                  fontSize: fss,
                                                }}
                                              >
                                                {/* Checkbox Toggle */}
                                                <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                  <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                  <label class="switch-label" for={`switch-${option.value}`}></label>
                                                </div>
                                                {/* Option Label */}
                                                <span style={{ flexGrow: 1 }}>{option.label}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      style={{
                                        border: "none",
                                        fontSize: fss,
                                      }}
                                    />

                                    {/* <Select
                                      isMulti
                                      isSearchable={false}
                                      className="newoneoneess"
                                      options={basic}
                                      value={value.venue}
                                      onChange={(e, { action }) => {

                                        if (action === "select-option" || action === "remove-value" || action === "clear" || action === "deselect-option") {


                                          handleChanges(e, value, "venue");
                                        }


                                      }}
                                      placeholder={value.venue?.length ? value.venue[0].label + "..." : "Select Venue"}
                                      menuPortalTarget={document.body}
                                      components={{
                                        Option: CustomOption,
                                        MultiValue: () => null,
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
                                      closeMenuOnSelect={false}
                                      hideSelectedOptions={false}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "unset",
                                          marginTop: -8,
                                          color: "#1A1A1B",
                                          fontSize: fss,
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 1000001, // Ensure dropdown appears above everything
                                        }),
                                      }}
                                    /> */}
                                  </div>
                                  <div style={{
                                    width: "19%", paddingRight: 20,
                                    display: "flex",
                                    alignItems: 'center'
                                  }}
                                    className="finefffff"
                                  >
                                    {/* <Select
                                      isMulti
                                      isSearchable={false}
                                      className="newoneoneess custom-select-container"
                                      options={output}
                                      value={value.hub} // Shows selected values
                                      onChange={(e, { action }) => {

                                        if (action === "select-option" || action === "remove-value" || action === "clear" || action === "deselect-option") {


                                          handleChanges(e, value, "hub");
                                        }


                                      }} // Prevent selection changes
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
                                      menuPortalTarget={document.body}
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "unset",
                                          marginTop: -8,
                                          color: "#1A1A1B",
                                          fontSize: fss
                                        }),
                                        menu: (base) => ({
                                          ...base,
                                          zIndex: 1000001, // Ensure dropdown appears above everything
                                        }),
                                      }}
                                    /> */}


<DropdownSelect
                                      options={output.filter(item => item.value !== "All")}
                                      values={value.hub}
                                      menuPortalTarget={document.body}
                                      multi={true}
                                      onChange={(val) => {

                                        console.log(val, 'successsuccesssuccesssuccesssuccess')

                                        handleChanges(val, value, "venue");
                                      }}
                                      placeholder="Select an option"
                                      contentRenderer={customContentRenderer}
                                      dropdownRenderer={({ props, state, methods }) => (
                                        <div style={{ maxHeight: "300px", zIndex: 100000  }}>
                                          {/* First Option (Placeholder) */}
                                          {/* <div
                                            key="placeholder-dropdown"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              methods.clearAll(); // Clears all selections
                                              methods.addItem({ value: "__placeholder__", label: "Select an option" });
                                            }}
                                            style={{
                                              display: "flex",
                                              alignContent: "center",
                                              padding: "10px",
                                              gap: 5,
                                              backgroundColor: "white",
                                              color: "black",
                                              cursor: "pointer",
                                              fontSize: fss,
                                            }}
                                          >
                                            <span style={{ flexGrow: 1 }}>Select an option</span>
                                          </div> */}

                                          {/* Other Options */}
                                          {props.options.map((option) => {
                                            const isSelected = state.values.some((val) => val.value === option.value);
                                            return (
                                              <div
                                                key={option.value + "-dropdown"}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  methods.addItem(option);
                                                }}
                                                style={{
                                                  display: "flex",
                                                  alignContent: "center",
                                                  padding: "10px",
                                                  gap: 5,
                                                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                                                  color: isSelected ? "#0073e6" : "black",
                                                  cursor: "pointer",
                                                  fontSize: fss,
                                                }}
                                              >
                                                {/* Checkbox Toggle */}
                                                <div class="switch-containers" style={{ marginRight: 4, marginTop: "-5px" }}>
                                                  <input checked={isSelected} type="checkbox" id={`switch-${option.value}`} disabled />
                                                  <label class="switch-label" for={`switch-${option.value}`}></label>
                                                </div>
                                                {/* Option Label */}
                                                <span style={{ flexGrow: 1 }}>{option.label}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      style={{
                                        border: "none",
                                        fontSize: fss,
                                      }}
                                    />


                                   


                                  </div>
                                  <div className="d-flex justify-content-between gap-3 align-items-center " style={{ width: "5%", paddingLeft: "1%" }}>
                                    <div
                                      onClick={() => handleEmployeeEditClick(value)} // Edit button
                                      style={{ cursor: "pointer" }}
                                    >
                                      <FaEdit />
                                    </div>
                                    <div
                                      onClick={() => handleDeleteEmployeeClick(value)} // Delete button
                                      style={{ color: "red", cursor: "pointer", marginTop: 5 }}
                                    >
                                      <FaRegTrashCan />
                                    </div>
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
                            )
                          })}
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
            </>

          ) : data === "4" ? (


            <div style={{ padding: "0 50px", width: '100%' }}> {/* Adds 10% side spacing */}
              <div style={{ border: "1px solid #9F9F9F", overflow: "hidden", height: '100%' }}>
                {/* Header Row */}
                <div className="d-flex" style={{ backgroundColor: "#DADADA", padding: "12px", borderBottom: "1px solid #9F9F9F" }}>
                  <div style={{ width: "33%", display: "flex", alignItems: "center" }}>
                    <p style={{ color: "#1A1A1B", fontWeight: "600", fontSize: fs, marginBottom: 0 }}>Name</p>
                  </div>
                  <div style={{ width: "34%", display: "flex", alignItems: "center" }}>
                    <p style={{ color: "#1A1A1B", fontWeight: "600", fontSize: fs, marginBottom: 0 }}>Access</p>
                  </div>
                  <div style={{ width: "33%", display: "flex", alignItems: "center" }}>
                    <p style={{ color: "#1A1A1B", fontWeight: "600", fontSize: fs, marginBottom: 0 }}>Permissions</p>
                  </div>
                </div>

                {/* Data Rows */}
                {[
                  { name: "Admin", access: "Settings, Analytics, Training videos", permissions: "Create any users, Reset users passwords" },
                  { name: "Managers", access: "Analytics, Training videos", permissions: "Create employee users, Reset personal password" },
                  { name: "Employees", access: "Training videos", permissions: "Reset personal password" },
                ].map((item, index, array) => (
                  <div
                    key={index}
                    className="d-flex"
                    style={{
                      padding: "30px",
                      borderBottom: "1px solid #9F9F9F",  // Adds border to all rows
                      backgroundColor: "#ECF1F4"
                    }}
                  >
                    <div style={{ width: "33%", display: "flex", alignItems: "center" }}>
                      <p style={{ color: "#316AAF", fontWeight: "500", fontSize: fs, marginBottom: 0 }}>{item.name}</p>
                    </div>
                    <div style={{ width: "34%", display: "flex", alignItems: "center" }}>
                      <p style={{ color: "#707070", fontWeight: "400", fontSize: fs, marginBottom: 0 }}>{item.access}</p>
                    </div>
                    <div style={{ width: "33%", display: "flex", alignItems: "center" }}>
                      <p style={{ color: "#707070", fontWeight: "400", fontSize: fs, marginBottom: 0 }}>{item.permissions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: "0 50px", width: "100%" }}>
                <div style={{ border: "1px solid #9F9F9F", overflow: "hidden", height: "100%" }}>

                  {/* Header Row */}
                  <div
                    className="d-flex"
                    style={{
                      backgroundColor: "#DADADA",
                      padding: 20,
                      height: 60,
                      borderBottom: "1px solid #9F9F9F",
                    }}
                  >
                    <div style={{ width: "33%" }}></div>
                    <div style={{ width: "34%" }}></div>
                    <div style={{ width: "33%" }}></div>
                  </div>

                  {/* Rows */}
                  {[
                    { label: "Full Name", value: editname, setValue: setEditname, disabled: editnamebool, setDisabled: setEditnamebool, type: "text", icon: true },
                    { label: "Email", value: editemail, setValue: setEditemail, disabled: true, icon: false },
                    { label: "Password", value: editpass, setValue: setEditpass, type: editpassbool ? "text" : "password", toggle: setEditpassbool, isPassword: true },
                  ].map((item, index) => (
                    <React.Fragment key={index}>
                      <div
                        className="d-flex"
                        style={{
                          padding: 40,
                          height: 60,
                          backgroundColor: "#ECF1F4",
                        }}
                      >
                        <div style={{ width: "20%" }} className="d-flex">
                          <p style={{ color: "#316AAF", fontWeight: "400" }}>{item.label}</p>
                        </div>
                        <div style={{ width: "20%" }} className="d-flex">
                          <input
                            value={item.value}
                            onChange={(e) => {
                              item.setValue(e.target.value);
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
                            disabled={item.disabled}
                            type={item.type || "text"}
                            id="switch3"
                          />
                        </div>
                        <div style={{ width: "40%" }}>
                          {item.icon && (
                            <img
                              onClick={() => item.setDisabled(!item.disabled)}
                              src="pencil.png"
                              alt="Edit"
                            />
                          )}
                          {item.isPassword && (
                            <label className="round-checkbox">
                              <input
                                checked={editpassbool}
                                onChange={(e) => item.toggle(e.target.checked)}
                                type="checkbox"
                              />
                              {editpassbool ? <FiEye /> : <FiEyeOff />}
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Add separator for all rows */}
                      <hr
                        style={{
                          margin: "0px 0px",
                          backgroundColor: "#9F9F9F",
                          height: 1,
                        }}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </>
          )}


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
        {/* Edit Modal for Managers */}
        {showEditModalManager && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                width: 400,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Edit Manager
              </h2>

              {/* Name Input */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={selectedManager?.name || ""}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      name: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Email:</label>
                <input
                  type="email"
                  name="Email"
                  disabled
                  value={selectedManager?.Email || ""}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      Email: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowEditModalManager(false)} // Close the modal
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditManager} // Handle edit
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#316AAF",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal for Managers */}
        {showDeleteModalManager && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                width: 400,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Delete Manager
              </h2>

              <p style={{ marginBottom: 20 }}>
                Are you sure you want to delete{" "}
                <strong>{managerToDelete?.name}</strong>?
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowDeleteModalManager(false)} // Close the modal
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteManager} // Handle deletion
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ff4d4f", // Red color for delete button
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal for Employees */}
        {showEditModalEmployee && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                width: 400,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Edit Employee
              </h2>

              {/* Name Input */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee?.name || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      name: e.target.value,
                    })
                  }

                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Email:</label>
                <input
                  type="email"
                  name="Email"
                  disabled
                  value={selectedEmployee?.Email || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      Email: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowEditModalEmployee(false)} // Close the modal
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditEmployee} // Handle edit
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#316AAF",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal for Employees */}
        {showDeleteModalEmployee && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                width: 400,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Delete Employee
              </h2>

              <p style={{ marginBottom: 20 }}>
                Are you sure you want to delete{" "}
                <strong>{employeeToDelete?.name}</strong>?
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowDeleteModalEmployee(false)} // Close the modal
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEmployee} // Handle deletion
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ff4d4f", // Red color for delete button
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal for Admins */}
        {showEditModalAdmin && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                width: 400,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Edit Admin
              </h2>

              {/* Name Input */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={selectedAdmin?.name || ""}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      name: e.target.value,
                    })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5 }}>Email:</label>
                <input
                  type="email"
                  name="Email"
                  value={selectedAdmin?.Email || ""}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      Email: e.target.value,
                    })
                  }
                  disabled
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowEditModalAdmin(false)} // Close the modal
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditAdmin} // Handle edit
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#316AAF",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal for Admins */}
        {showDeleteModalAdmin && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 8,
                width: 400,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
                Delete Admin
              </h2>

              <p style={{ marginBottom: 20 }}>
                Are you sure you want to delete{" "}
                <strong>{adminToDelete?.name}</strong>?
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  onClick={() => setShowDeleteModalAdmin(false)} // Close the modal
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdmin} // Handle deletion
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#ff4d4f", // Red color for delete button
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SweetAlert2 {...swalProps} />
    </div>
  );
};

export default Admin_dash;
