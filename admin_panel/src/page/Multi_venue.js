
import React, { useEffect, useState, useRef, useContext } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt, { max } from "big-integer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCaretDown } from "react-icons/fa6";
import TimePicker from 'react-time-picker';
import Swal from 'sweetalert2'
import Select, { components } from 'react-select';
import { FaCheck } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import * as CryptoJS from 'crypto-js'
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import app from "./firebase";
import { DataContext } from "../component/DataProvider";
import {
  getDatabase, ref, set, push, get, query,
  startAt, endAt, orderByChild, equalTo,
  orderByKey
} from "firebase/database";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    backgroundColor: '#F3F3F3',
    transform: 'translate(-50%, -50%)',
    border: '3px solid #ababab',
    borderRadius: '10px',
    width: '60%',
    boxShadow: '0 6px 1px rgba(0, 0, 0, 0.2)'
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');



let Multi_venue = () => {
  let [data, setData] = useState();
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [startDate, endDate] = dateRange;


  let [basicall, setBasicall] = useState()
  let [basic, setBasic] = useState()
  let [basicone, setBasicone] = useState([])

  let [basiconefive, setBasiconefive] = useState([])
  let [basiconesix, setBasiconesix] = useState([])

  let [basicfine, setBasicfine] = useState([{
    "value": "Maximum",
    "label": "Maximum"
  },
  {
    "value": "Minimum",
    "label": "Minimum"
  },])

  let [hubb, setHubb] = useState([])
  let [hubbtwo, setHubbtwo] = useState([])
  let [hubbswitch, setHubbswitch] = useState(true)
  let [isPdfLoad, setIsPdfLoad] = useState(false);
  let [isExcelLoad, setIsExcelLoad] = useState(false);
  //parse meals
  let [meals, setMeals] = useState(1)


  //edit
  let [editall, setEditall] = useState([])
  let [editallone, setEditallone] = useState([])
  let [served, setServed] = useState([])
  let [servedone, setServedone] = useState([])

  let [stampval, setStampval] = useState([])
  //refund meals
  let [minperday, setMinperday] = useState([])
  let [maxperday, setMaxperday] = useState([])


  const optionshub = [{
    "label": "All Stages",
    "value": "All"
  },
  { value: 'R', label: 'On Process' },
  { value: 'H', label: 'On Hold' },
  { value: 'P', label: 'On Pass' },
  // { value: 'S', label: 'Served' },
  ];

  const optionstakeaway = [
    { value: 'All', label: 'All takeaways' },
    { value: 'TAKEAWAY', label: 'Takeaways' },
    { value: 'DELIVERY', label: 'Deliveries' },
    { value: 'Pick-ups', label: 'Pick-ups' },
  ];
  ///old
  let [oldven, setOldven] = useState([])
  let [oldhub, setOldhub] = useState([])
  let [oldpro, setOldpro] = useState(optionshub)
  let [oldcou, setOldcou] = useState([])
  let [oldtak, setOldtak] = useState(optionstakeaway)

  let [oldhubtwo, setOldhubtwo] = useState([])

  let [oldvenfive, setOldvenfive] = useState([])
  let [oldvensix, setOldvensix] = useState([])

  let [alldrop, setAlldrop] = useState([])

  let [filterdataone, setFilterdataone] = useState({})
  let [filterdatatwo, setFilterdatatwo] = useState({})

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let [cval1, setcval1] = useState()
  let [cval2, setcval2] = useState()



  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [menuIsOpenone, setMenuIsOpenone] = useState(false);
  const [menuIsOpentwo, setMenuIsOpentwo] = useState(false);
  const [menuIsOpenthree, setMenuIsOpenthree] = useState(false);
  const [menuIsOpenfour, setMenuIsOpenfour] = useState(false);

  const [menuIsOpenfive, setMenuIsOpenfive] = useState(false);
  const [menuIsOpensix, setMenuIsOpensix] = useState(false);


  const selectReffive = useRef(null);

  const selectRefsix = useRef(null);



  const selectRef = useRef(null);

  const selectRefone = useRef(null);
  const selectReftwo = useRef(null);
  const selectRefthree = useRef(null);
  const selectReffour = useRef(null);

  const { state } = useContext(DataContext);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setMenuIsOpen(false);
      }

      if (selectRefone.current && !selectRefone.current.contains(event.target)) {
        setMenuIsOpenone(false);
      }
      if (selectReftwo.current && !selectReftwo.current.contains(event.target)) {
        setMenuIsOpentwo(false);
      }
      if (selectRefthree.current && !selectRefthree.current.contains(event.target)) {
        setMenuIsOpenthree(false);
      }
      if (selectReffour.current && !selectReffour.current.contains(event.target)) {
        setMenuIsOpenfour(false);
      }


      if (selectReffive.current && !selectReffive.current.contains(event.target)) {
        setMenuIsOpenfive(false);
      }
      if (selectRefsix.current && !selectRefsix.current.contains(event.target)) {
        setMenuIsOpensix(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  function findFirstOccurrences(stampData) {
    const [timestamp, ...actions] = stampData.split(" ");

    const firstOccurrences = {}; // To store first occurrences

    for (let action of actions) {
      const time = action.substring(0, 4); // Extract time (hhmm)
      const statusCode = action.substring(4); // Extract status code

      let status = "";
      if (/^R\d+$/.test(statusCode)) status = "Process";
      else if (/^P\d+$/.test(statusCode)) status = "Pass";
      else if (/^H\d+$/.test(statusCode)) status = "Hold";

      if (status && !firstOccurrences[status]) {
        firstOccurrences[status] = { status, time: `${time.substring(0, 2)}:${time.substring(2, 4)}` };
      }

      // Stop if all statuses are found
      if (Object.keys(firstOccurrences).length === 3) break;
    }

    return Object.values(firstOccurrences);
  }




  function openModal(finebyme, finebyme2) {
    console.log(JSON.stringify(finebyme), 'finebymefinebyme')




    function filterItemsByNote(order) {
      const groupedItems = {};

      order.ITEMS.forEach(item => {
        let note = (item.NOTE || "").toString().trim();

        if (!note) {
          note = "empty"; // If NOTE is empty, assign "empty"
        } else if (note.startsWith("(") && note.includes(")")) {
          const match = note.match(/\([A-Z]\d+([a-zA-Z]+)\)/); // Extracts text after letter and number inside ()
          if (match) {
            note = match[1]; // Extract only the category name
          }
        }

        if (!groupedItems[note]) {
          groupedItems[note] = [];
        }

        groupedItems[note].push(item);
      });

      return groupedItems;
    }
    let finedata = filterItemsByNote(finebyme.order)


    let Stampdata = findFirstOccurrences(finebyme?.order?.STAMP)
    console.log(Stampdata, 'kk')
    setStampval(Stampdata)

    setIsOpen(true);
    setcval1(finebyme)
    setcval2(finedata)


  }



  function afterOpenModal() {
    // references are now sync'd and can be accessed. 
  }

  function closeModal() {
    setIsOpen(false);
  }


  useEffect(() => {
    loginCheck(state?.user)
    getone(state?.data)
    // getonez()

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

  let loginCheck = async (snapshot) => {
    let getdata = sessionStorage.getItem('data')
    if (getdata === undefined || getdata === '' || getdata === null) {
      sessionStorage.removeItem('data')
      navigate('/')
      return
    }
    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)
    let name = getName(parsedatajson)
    setUsedname(name)
    const userData = snapshot
    // Check if the password matches
    const foundUser = Object.values(userData).find(user => user.Email === parsedatajson.Email);
    if (foundUser.Role === 'emp') {
      sessionStorage.removeItem('data')
      navigate('/')
      return
    }
    if (foundUser) {
      // Check if the password matches
      if (foundUser.Password === parsedatajson.Password) {

      } else {
        navigate('/')
        return
      }
    } else {
      console.log("User does not exist.");
    }
  }


  let [onebar, setOneBar] = useState([])
  let [twobar, setTwobar] = useState([])
  let [optionbar, setOption] = useState([])

  let [onebarone, setOneBarone] = useState([])
  let [twobarone, setTwobarone] = useState([])
  let [optionbarone, setOptionone] = useState([])
  const getFormattedDate = (daysBefore) => {
    const date = new Date();
    date.setDate(date.getDate() - daysBefore);

    // Ensure time is set to match the expected format
    date.setUTCHours(18, 30, 0, 0);

    return date; // Return a Date object instead of a string
  };





  const optionshshs = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false, text: 'X-Axis Scrollable Bar Chart' },
    },
    scales: {
      x: {
        ticks: { maxRotation: 45, minRotation: 0 }, // Prevents overlap
      },
      y: {
        beginAtZero: true,
      },
    },
  };


  const datafine = {
    labels: optionbar,
    datasets: [
      {
        label: 'Chosen range',
        data: onebar,
        backgroundColor: '#CA424E',
        borderColor: '#CA424E',
        borderWidth: 1,
      },
      {
        label: 'Comparing range',
        data: twobar,
        backgroundColor: '#B6B6B6',
        borderColor: '#B6B6B6',
        borderWidth: 1,
      },
    ],
  };
  const OrderDisplay = ({ orders = {} }) => {
    if (!orders || Object.keys(orders).length === 0) {
      return <p style={{ textAlign: 'center', color: 'red' }}>No orders available</p>;
    }



    let stamp = cval1?.order?.STAMP

    return (
      <div>
        {Object.entries(orders).map(([course, items]) => (
          <div key={course} style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: '600', fontSize: 15, textAlign: 'center', marginBottom: 0 }}>
              Course: {course === "empty" ? '' : course}
            </p>
            <p style={{ fontWeight: '500', fontSize: 13, textAlign: 'center', color: "#707070" }}>
              Time: R: {stampval[0]?.time} . | P: {stampval[1]?.time}. | H: {stampval[2]?.time}.
            </p>

            <div style={{ marginTop: 10 }}>
              {items?.map((kai, index) => (
                <div key={kai?.ITEMID || index} style={{ marginBottom: 15 }}>
                  <p style={{ fontWeight: '600', fontSize: 13, marginBottom: 0 }}>Item {index + 1}: {kai?.ITEM}</p>
                  <p style={{ fontWeight: '400', fontSize: 13, marginBottom: 0, color: "#707070" }}>Note: {kai?.NOTE || "No Note"}</p>
                  <p style={{ fontWeight: '400', fontSize: 13, marginBottom: 0, color: "#707070" }}>
                    Edited: {["2", "12", "22", "32"].includes(kai?.STATUS) ? 'Yes' : "No"} |
                    Moved: {["3", "13", "23", "33"].includes(kai?.STATUS) ? 'Yes' : "No"} |
                    Deleted: {["4", "24"].includes(kai?.STATUS) ? 'Yes' : "No"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const datafineone = {
    labels: optionbarone,
    datasets: [
      {
        label: 'Chosen range',
        data: onebarone,
        backgroundColor: '#316AAF',
        borderColor: '#8AA3C2',
        borderWidth: 1,
      },
      {
        label: 'Comparing range',
        data: twobarone,
        backgroundColor: '#B6B6B6',
        borderColor: '#B6B6B6',
        borderWidth: 1,
      },
    ],
  };


  const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, 'secretKey')
    const plainText = bytes.toString(CryptoJS.enc.Utf8)
    return plainText

  }
  let [fulldatafull, setFulldatafull] = useState()

  function extractUniqueNotes(datad, predefinedValues) {

    console.log(predefinedValues, 'predefinedValuespredefinedValuespredefinedValuespredefinedValuespredefinedValues')
    let uniqueNotes = new Set();

    for (let group in datad) {


      for (let location in datad[group]) {

        if (!predefinedValues.some(p => p.value === location)) continue; // Skip groups not in predefinedValues

        for (let section in datad[group][location]) {
          for (let date in datad[group][location][section]) {
            datad[group][location][section][date].forEach(order => {
              order.ITEMS.forEach(item => {
                if (item.NOTE) {
                  // Extract the word after (C<number>)
                  const match = item.NOTE.match(/\(C\d+([a-zA-Z]+)\)/);
                  if (match && match[1] && match[1] !== "undefined") {
                    uniqueNotes.add(match[1]); // Add only valid words
                  }
                }
              });
            });
          }
        }
      }
    }

    // Convert Set to desired format
    return [...uniqueNotes].map(note => ({ value: note, label: note }));
  }

  let getone = (snapshots) => {


    const eventss = snapshots

    function removeTrainingNotes(obj) {
      if (Array.isArray(obj)) {
        // If it's an array, filter out objects with "TRAINING" in the NOTE field
        return obj.map(item => {
          if (item.ITEMS) {
            item.ITEMS = item.ITEMS.filter(item => !item.NOTE.includes("TRAINING"));
          }
          return item;
        });
      } else if (typeof obj === "object" && obj !== null) {
        // Recursively call for nested objects
        for (const key in obj) {
          obj[key] = removeTrainingNotes(obj[key]);
        }
      }
      return obj;
    }

    const cleanedData = removeTrainingNotes(eventss);







    setBasicall(cleanedData)
    // const transformData = (data) => {
    //   const result = {};

    //   for (const key of Object.keys(data)) {
    //     const parts = key.split("-");
    //     const [group, location, subLocation, year] = parts;

    //     if (!result[group]) result[group] = {};
    //     if (!result[group][location]) result[group][location] = {};
    //     if (!result[group][location][subLocation]) result[group][location][subLocation] = new Set();

    //     result[group][location][subLocation].add(year);
    //   }

    //   // Convert Sets to arrays for final output
    //   const convertSetsToArrays = (obj) => {
    //     for (const key in obj) {
    //       if (obj[key] instanceof Set) {
    //         obj[key] = Array.from(obj[key]);
    //       } else if (typeof obj[key] === "object") {
    //         convertSetsToArrays(obj[key]);
    //       }
    //     }
    //   };

    //   convertSetsToArrays(result);
    //   return result;
    // };

    // const output = transformData(eventss);
    const result = {};
    Object.entries(cleanedData).forEach(([groupName, groupData]) => {


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
    console.log(result, 'keykeykeykey') // its oblect
    const optionsone = [{
      "label": "All Venue",
      "value": "All"
    }];
    Object.entries(cleanedData).forEach(([groupName, groupData]) => {
      Object.keys(groupData).forEach((key) => {
        optionsone.push({ value: key, label: key });
      });
    });

    // Generate `optionss` for `data[0]` (assuming `GreenbankServicesClub` is the first group)
    // const firstGroup = Object.keys(eventss.GreenbankServicesClub)[0]; // 'GreenbankServicesClub'
    // const optionsstwo = Object.keys(eventss.GreenbankServicesClub[firstGroup]).map((hub) => ({
    //   value: hub,
    //   label: hub,
    // }));


    // console.log("optionss:", optionsstwo);

    let getdata = sessionStorage.getItem('data')

    let decry = decrypt(getdata)

    let parsedatajson = JSON.parse(decry)


    const hasAllValue = parsedatajson.venue.some(item => item.value === "All");
    let realven = [{ label: "All Venues", value: "All" }]

    if (hasAllValue === true) {
      realven.push(...optionsone);
      setBasic(optionsone)
      setOldven(optionsone)
      setSelectedOptions(optionsone)

      let uuuk = extractUniqueNotes(cleanedData, optionsone)
      uuuk.unshift({ label: "All Courses", value: "All" });
      setFulldatafull(uuuk)
      setOldcou(uuuk)
      setSelectedCources(uuuk)

    


      const output = [{
        "label": "All Hubs",
        "value": "All"
      }];

      // // Iterate through the search array
      optionsone.forEach(({ value }) => {
        // Search in the data object
        Object.entries(result).forEach(([key, items]) => {
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
      setHubb(output)


      setOldhub(output)



    } else {
      realven.push(parsedatajson.venue)
      setBasic([...[{
        "label": "All Venue",
        "value": "All"
      }], ...parsedatajson.venue])

      setOldven([...[{
        "label": "All Venue",
        "value": "All"
      }], ...parsedatajson.venue])

      setSelectedOptions([...[{
        "label": "All Venue",
        "value": "All"
      }], ...parsedatajson.venue])

      const output = [{
        "label": "All Hubs",
        "value": "All"
      }];

      // // Iterate through the search array
      [...[{
        "label": "All Venue",
        "value": "All"
      }], ...parsedatajson.venue].forEach(({ value }) => {
        // Search in the data object
        Object.entries(result).forEach(([key, items]) => {
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
      setHubb(output)


      setOldhub(output)




      let uuuk = extractUniqueNotes(cleanedData, parsedatajson.venue)
      uuuk.unshift({ label: "All Courses", value: "All" });
      setSelectedCources(uuuk)
      setOldcou(uuuk)
      setFulldatafull(uuuk)
    }





    const kitchen2Data = cleanedData["ZushiGroup"]["ZushiBarangaroo"].Kitchen["2025-01-20"];
    const optionstakeaway = [
      ...new Set(kitchen2Data.map(item => item.NOTE)) // Extract unique values from the NOTE field
    ].map(value => ({ value, label: value }));


    console.log(optionstakeaway, 'kitchen2Datakitchen2Datakitchen2Data')





    // const output = [];

    //   // // Iterate through the search array
    //   [].forEach(({ value }) => {
    //     // Search in the data object
    //     Object.entries(alldrop).forEach(([key, items]) => {
    //       if (key === value) {
    //         // If the key matches, add all items from the group to the output
    //         items.forEach(item => {
    //           output.push({ value: key + '-' + item.name, label: item.name });
    //         });
    //       } else {
    //         // Search within the group's items
    //         items.forEach(item => {
    //           if (item.name === value) {
    //             output.push({ value: key + '-' + item.name, label: key });
    //           }
    //         });
    //       }
    //     });
    //   });

    //   setBasicone(output)





    const filteredDataonee = {};

    console.log(JSON.stringify(parsedatajson), 'mydatamydatamydatamydatamydatamydatamydata')
    if (parsedatajson.venue) {

      const hasAllValue = parsedatajson.venue.some(item => item.value === "All");

      console.log(hasAllValue, 'hasAllValue')
      if (hasAllValue === true) {

      } else {

        parsedatajson.venue.forEach(filter => {
          const key = filter.value;
          if (cleanedData[key]) {
            filteredDataonee[key] = cleanedData[key];
          }
        });
        setBasicall(filteredDataonee)
      }





    }

    if (parsedatajson.hub) {

      const hasAllValue = parsedatajson.hub.some(item => item.value === "All");
      console.log(hasAllValue, 'hasAllValue hub')

      if (hasAllValue === true) {

      } else {
        function filterDataByDynamicKeys(keysArray) {
          const filteredData = {};

          keysArray.forEach(({ value }) => {
            const [topLevelKey, hubName, secondTopLevelKey] = value.split('-');

            if (filteredDataonee[topLevelKey] && filteredDataonee[topLevelKey][secondTopLevelKey]) {
              const secondLevelData = filteredDataonee[topLevelKey][secondTopLevelKey];

              // Check if the hub exists
              if (secondLevelData[hubName]) {
                if (!filteredData[topLevelKey]) {
                  filteredData[topLevelKey] = {};
                }

                if (!filteredData[topLevelKey][secondTopLevelKey]) {
                  filteredData[topLevelKey][secondTopLevelKey] = {};
                }

                filteredData[topLevelKey][secondTopLevelKey][hubName] = secondLevelData[hubName];
              }
            }
          });

          return filteredData;
        }

        let fina = filterDataByDynamicKeys(parsedatajson.hub)

        setBasicall(fina)
      }


    }







    // alldat = filteredDataonee
    const yesterday = [getFormattedDate(1), getFormattedDate(1)];
    const eightDaysBefore = [getFormattedDate(8), getFormattedDate(8)];
    setDateRangetwo(eightDaysBefore)
    setDateRange(yesterday)
    // filterDataByDate(dateRange, onetime, twotime, basic , hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    // filterDataByDateonee(dateRange, onetime, twotime, basic ,
    //   hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


  }


  let getonez = () => {


    const db = getDatabase(app);
    const eventsRefs = ref(db, "VenueInformation");

    const dateQuerys = query(
      eventsRefs,
    );

    // Fetch the results
    get(dateQuerys)
      .then((snapshots) => {
        if (snapshots.exists()) {
          const eventss = snapshots.val();

          console.log(JSON.stringify(eventss, 'eventsseventss'))


          const result = {};

          Object.keys(eventss).forEach((key, index) => {
            // Split the key into parts
            const [group, , name] = key.split("-");

            // Initialize the group if not already present
            if (!result[group]) {
              result[group] = [];
            }

            // Push the data to the group
            result[group].push({
              ind: index + 1,
              name: name
            });
          });

          // setAlldrop(result)
          console.log(JSON.stringify(result), 'resultresultresult')



        } else {
          console.log("No events found between the dates.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }


  //dummydata

  const [time, setTime] = useState('12:00');

  const formatRange = (start, end) => {
    const formatDate = (date) =>
      date
        ? new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(date)
        : "";
    return `${formatDate(start)}  |  ${formatDate(end)}`;
  };

  const [dateRangetwo, setDateRangetwo] = useState([null, null]); // [startDate, endDate]
  const [startDatetwo, endDatetwo] = dateRangetwo;



  //full data
  let [fulldata, setFulldata] = useState()
  let [fulldatatwo, setFulldatatwo] = useState()



  let updates = (num, val) => {


    if (num === 1) {

      let onee = val[0]
      let date = new Date(onee);
      date.setDate(date.getDate() + 1);
      let formattedDate = date.toISOString().split('T')[0];

      let two = val[1]
      const datetwo = new Date(two);
      datetwo.setDate(datetwo.getDate() + 1);
      const formattedDatetwo = datetwo.toISOString().split('T')[0];
      const db = getDatabase(app);



      const filteredData = {};
      let kindaa = {}



      Object.entries(basicall).forEach(([groupKey, groupData]) => {


        Object.entries(groupData).forEach(([areas, areaDatas]) => {



          Object.entries(areaDatas).forEach(([area, areaData]) => {


            Object.entries(areaData).forEach(([dates, records]) => {
              // Check if the date is within the range


              console.log(dates, formattedDate, formattedDatetwo)
              if (dates >= formattedDate && dates <= formattedDatetwo) {
                // Create the dynamic key based on the index and date
                const index = `${Object.keys(filteredData).length + 1}`;
                const updatedRecord = {
                  ...records,
                  venue: areas,
                  hub: area
                };
                kindaa[areas] = area
                filteredData[`${index}) ${dates}`] = updatedRecord;
              }




            });
          });
        });
      });

      callfordata(filteredData, fulldata)

      setFulldatatwo(filteredData)

      if (dateRangetwo[0] != null && dateRangetwo[1] != null) {

        // let onees = dateRangetwo[0]
        // let dates = new Date(onees);
        // let formattedDates = dates.toISOString().split('T')[0];

        // let twos = dateRangetwo[1]
        // const datetwos = new Date(twos);
        // const formattedDatetwos = datetwos.toISOString().split('T')[0];


        // const eventsRefs = ref(db, "Data");

        // // Create a query for events between the two dates
        // const dateQuerys = query(
        //   eventsRefs,
        //   orderByKey(),
        //   startAt(formattedDates),
        //   endAt(formattedDatetwos)
        // );

        // // Fetch the results
        // get(dateQuerys)
        //   .then((snapshots) => {
        //     if (snapshots.exists()) {
        //       const eventss = snapshots.val();

        //       setFulldata(eventss)


        //       console.log("Events between dates:", eventss);
        //     } else {
        //       console.log("No events found between the dates.");
        //     }
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching events:", error);
        //   });


        let onees = dateRangetwo[0]
        let dates = new Date(onees);
        dates.setDate(dates.getDate() + 1);
        let formattedDates = dates.toISOString().split('T')[0];

        let twos = dateRangetwo[1]
        const datetwos = new Date(twos);
        datetwos.setDate(datetwos.getDate() + 1);
        const formattedDatetwos = datetwos.toISOString().split('T')[0];
        const db = getDatabase(app);



        const filteredDatas = {};



        Object.entries(basicall).forEach(([groupKey, groupData]) => {
          Object.entries(groupData).forEach(([areas, areaDatas]) => {
            Object.entries(areaDatas).forEach(([area, areaData]) => {
              Object.entries(areaData).forEach(([datess, recordss]) => {
                // Check if the date is within the range


                if (datess >= formattedDates && datess <= formattedDatetwos) {
                  // Create the dynamic key based on the index and date
                  const indexs = `${Object.keys(filteredDatas).length + 1}`;

                  const updatedRecord = {
                    ...recordss,
                    venue: areas,
                    hub: area
                  };

                  filteredDatas[`${indexs}) ${datess}`] = updatedRecord;
                }




              });
            });
          });
        });
        callfordata(filteredData, filteredDatas)
        setFulldata(filteredDatas)

      }



    }
    else if (num === 2) {


      // let onee = val[0]
      // let date = new Date(onee);
      // let formattedDate = date.toISOString().split('T')[0];

      // let two = val[1]
      // const datetwo = new Date(two);
      // const formattedDatetwo = datetwo.toISOString().split('T')[0];

      // const db = getDatabase(app);

      // const eventsRef = ref(db, "Data");

      // // Create a query for events between the two dates
      // const dateQuery = query(
      //   eventsRef,
      //   orderByKey(),
      //   startAt(formattedDate),
      //   endAt(formattedDatetwo)
      // );

      // // Fetch the results
      // get(dateQuery)
      //   .then((snapshot) => {
      //     if (snapshot.exists()) {
      //       const events = snapshot.val();

      //       setFulldata(events)


      //       console.log("Events between dates:", events);
      //     } else {
      //       console.log("No events found between the dates.");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching events:", error);
      //   });



      let onee = val[0]
      let date = new Date(onee);
      date.setDate(date.getDate() + 1);
      let formattedDate = date.toISOString().split('T')[0];

      let two = val[1]
      const datetwo = new Date(two);
      datetwo.setDate(datetwo.getDate() + 1);
      const formattedDatetwo = datetwo.toISOString().split('T')[0];
      const db = getDatabase(app);



      const filteredData = {};
      const kindaa = {

      };

      Object.entries(basicall).forEach(([groupKey, groupData]) => {
        Object.entries(groupData).forEach(([areas, areaDatas]) => {
          Object.entries(areaDatas).forEach(([area, areaData]) => {
            Object.entries(areaData).forEach(([dates, records]) => {
              // Check if the date is within the range


              if (dates >= formattedDate && dates <= formattedDatetwo) {
                // Create the dynamic key based on the index and date
                const index = `${Object.keys(filteredData).length + 1}`;

                const updatedRecord = {
                  ...records,
                  venue: areas,
                  hub: area
                };

                filteredData[`${index}) ${dates}`] = updatedRecord;
              }




            });
          });
        });
      });
      callfordata(fulldatatwo, filteredData)
      setFulldata(filteredData)

      if (dateRange[0] != null && dateRange[1] != null) {

        let onees = dateRange[0]
        let dates = new Date(onees);
        dates.setDate(dates.getDate() + 1);
        let formattedDates = dates.toISOString().split('T')[0];

        let twos = dateRange[1]
        const datetwos = new Date(twos);
        datetwos.setDate(datetwos.getDate() + 1);
        const formattedDatetwos = datetwos.toISOString().split('T')[0];
        const db = getDatabase(app);



        const filteredDatas = {};

        Object.entries(basicall).forEach(([groupKey, groupData]) => {
          Object.entries(groupData).forEach(([areas, areaDatas]) => {
            Object.entries(areaDatas).forEach(([area, areaData]) => {
              Object.entries(areaData).forEach(([datess, recordss]) => {
                // Check if the date is within the range

                if (datess >= formattedDates && datess <= formattedDatetwos) {
                  // Create the dynamic key based on the index and date
                  const indexs = `${Object.keys(filteredDatas).length + 1}`;

                  const updatedRecord = {
                    ...recordss,
                    venue: areas,
                    hub: area
                  };

                  filteredDatas[`${indexs}) ${datess}`] = updatedRecord;
                }




              });
            });
          });
        });
        callfordata(filteredDatas, filteredData)
        setFulldatatwo(filteredDatas)

        // let onees = dateRange[0]
        // let dates = new Date(onees);
        // let formattedDates = dates.toISOString().split('T')[0];

        // let twos = dateRange[1]
        // const datetwos = new Date(twos);
        // const formattedDatetwos = datetwos.toISOString().split('T')[0];


        // const eventsRefs = ref(db, "Data");

        // // Create a query for events between the two dates
        // const dateQuerys = query(
        //   eventsRefs,
        //   orderByKey(),
        //   startAt(formattedDates),
        //   endAt(formattedDatetwos)
        // );

        // // Fetch the results
        // get(dateQuerys)
        //   .then((snapshots) => {
        //     if (snapshots.exists()) {
        //       const eventss = snapshots.val();

        //       setFulldatatwo(eventss)


        //       console.log("Events between dates:", eventss);
        //     } else {
        //       console.log("No events found between the dates.");
        //     }
        //   })
        //   .catch((error) => {
        //     console.error("Error fetching events:", error);
        //   });

      }


    }

  }


  let callfordata = (one, two) => {




    if (one === undefined || one === null || one === '' ||
      two === undefined || two === null || two === ""
    ) {

    } else {
      //
      console.log(one, 'one')
      console.log(two, 'two')


      const categorizeItems = (datasssssss) => {
        const edited = ["2", "12", "22", "32"];
        const moved = ["3", "13", "23", "33"];
        const deleted = ["4", "24"];

        const result = {
          edited: [],
          moved: [],
          deleted: [],
          served: [],
          tableMoved: []
        };

        for (const [date, entries] of Object.entries(datasssssss)) {
          const entriessss = Object.values(entries).filter(
            (item) => typeof item === "object" && !Array.isArray(item)
          );

          entriessss.forEach(entry => {


            if (entry.NOTE && entry.NOTE.includes("$ND$")) {
              result.tableMoved.push(entry);
            }


            entry.ITEMS.forEach(item => {
              if (edited.includes(item.STATUS)) {
                result.edited.push(item);
              } else if (moved.includes(item.STATUS)) {
                result.moved.push(item);
              } else if (deleted.includes(item.STATUS)) {
                result.deleted.push(item);
              } else if (parseInt(item.STATUS) > 20) {
                result.served.push(item);
              }
            });
          });

        }

        return result;
      };

      let editttsone = categorizeItems(one)
      let editttstwo = categorizeItems(two)

      console.log(editttsone, 'editttsoneeditttsone')


      setEditall(editttsone)
      setEditallone(editttstwo)

      const processItems = (data) => {
        const dishCounts = {};

        // Iterate through the data to collect and process dishes
        for (const [date, entries] of Object.entries(data)) {

          const entriessss = Object.values(entries).filter(
            (item) => typeof item === "object" && !Array.isArray(item)
          );

          entriessss.forEach(entry => {
            entry.ITEMS.forEach(item => {
              // Remove "Sp\\" prefix if present
              const cleanItemName = item.ITEM.replace(/^Sp\\\s*/, "");

              // If dish is already counted, increment its count and append data
              if (dishCounts[cleanItemName]) {
                dishCounts[cleanItemName].count += parseInt(item.QUANTITY, 10);
                dishCounts[cleanItemName].data.push(item);
              } else {
                // If not, initialize a new entry for the dish
                dishCounts[cleanItemName] = {
                  count: parseInt(item.QUANTITY, 10),
                  name: cleanItemName,
                  data: [item],
                };
              }
            });
          });
        }

        // Convert the dishCounts object to an array
        return Object.values(dishCounts).sort((a, b) => b.count - a.count);
      };


      let minnscount = processItems(one)
      let maxnscount = processItems(two)
      setServed(minnscount)
      setServedone(maxnscount)

      const processRefundedItems = (data) => {
        const results = [];

        // Iterate through each date's data
        for (const [date, entries] of Object.entries(data)) {
          let refundedItems = [];

          const entriessss = Object.values(entries).filter(
            (item) => typeof item === "object" && !Array.isArray(item)
          );


          entriessss.forEach(entry => {
            entry.ITEMS.forEach(item => {
              // Check if "Refunded" exists in the ITEM field
              if (item.NOTE.includes("Refunded")) {
                refundedItems.push(item);
              }
            });
          });

          if (refundedItems.length > 0) {
            // Calculate the total quantity for refunded items
            const totalQuantity = refundedItems.reduce(
              (sum, item) => sum + parseInt(item.QUANTITY, 10),
              0
            );

            results.push({
              date,
              count: totalQuantity,
              name: refundedItems[0].NOTE, // Assuming all refunded items share the same name
              data: refundedItems,
            });
          }
        }

        return results;
      };

      let refundcount = processRefundedItems(one)
      let refundcounttwo = processRefundedItems(two)

      console.log(refundcount, 'refundcountrefundcount')
      console.log(refundcounttwo, 'refundcounttworefundcounttwo')

      setMinperday(refundcount)
      setMaxperday(refundcounttwo)




    }
  }

  let navigate = useNavigate();



  //.select options venue

  const [venueradio, setVenueradio] = useState(true)

  const [venueradiofivese, setVenueradiofivese] = useState(false)

  const [venueradiosix, setVenueradiosix] = useState(false)

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
          backgroundColor: isSelected ? 'transparent' : 'transparent',
          color: isSelected ? 'black' : 'black',
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

  const CustomOptionfinal = (props) => {
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
        <span style={{ flexGrow: 1, marginTop: 6 }}>{data.label}</span>
      </div>
    );
  };

  const CustomMultiValue = () => null;


  const CustomPlaceholder = ({ children, getValue }) => {
    const selected = getValue();
    if (selected.length) {
      const allLabels = selected
        .filter(option => option.label && !option.label.startsWith("All ")) // Ensure label exists
        .map(option => option.label)
        .join(", ");

      // Limit to single line with ellipsis
      const maxLength = 10; // Adjust as needed
      let displayText = ''

      let hasAllfinbyss = selected.some(option => option.label && option.label.startsWith("All "));

      if (hasAllfinbyss === true) {
        const allValue = selected.find(option => option.label && option.label.startsWith("All "))?.label || "";
        displayText = allValue.slice(0, textCount)
      } else {
        displayText = allLabels.slice(0, textCount) + "..."
      }

      return <span style={{
        color: allLabels === 'Maximum' ? 'red' : allLabels === 'Minimum' ? 'blue' : "",
        fontWeight: allLabels === 'Maximum' ? '700' : allLabels === 'Minimum' ? '700' : ""
      }} title={allLabels}>{displayText}</span>;
    }
    return null;
  };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [selectedOptionsfive, setSelectedOptionsfive] = useState([]);
  const [selectedOptionssix, setSelectedOptionssix] = useState([]);


  const [selectedOptionsfine, setSelectedOptionsfine] = useState([basicfine[0]]);


  const handleChange = (selected) => {

    console.log(JSON.stringify(fulldatatwo), 'selected')
    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldven.some(item => item.value === "All");


    setOldven(selected)

    if (hasAllValue === false && hasAllValueold === true) {

      let uuuk = extractUniqueNotes(basicall, [])
      uuuk.unshift({ label: "All Courses", value: "All" });

      setFulldatafull(uuuk)

      setSelectedOptions([]);

      filterDataByDate(dateRange, onetime, twotime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRange, onetime  , twotime  , selectedOptionsfive , 
      //   hubbtwo , selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      const output = [];

      // // Iterate through the search array
      [].forEach(({ value }) => {
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

      return
    }



    if (hasAllValue === true) {

      let uuuk = extractUniqueNotes(basicall, basic)
      uuuk.unshift({ label: "All Courses", value: "All" });

      setFulldatafull(uuuk)


      setSelectedOptions(basic || []);

      filterDataByDate(dateRange, onetime, twotime, basic, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, basic, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      const output = [{
        "label": "All Hub",
        "value": "All"
      }];

      // // Iterate through the search array
      basic.forEach(({ value }) => {
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


    } else {

      let lengthss = selected.length
      let lengthssone = basic.length

      // if (lengthss === lengthssone - 1) {
      //   setSelectedOptions( []);

      //   filterDataByDate(dateRange, onetime, twotime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      //   filterDataByDateonee(dateRangetwo, threetime, fourtime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      //   const output = [];

      //   // // Iterate through the search array
      //   [].forEach(({ value }) => {
      //     // Search in the data object
      //     Object.entries(alldrop).forEach(([key, items]) => {
      //       if (key === value) {
      //         // If the key matches, add all items from the group to the output
      //         items.forEach(item => {
      //           output.push({ value: key + '-' + item.name, label: item.name });
      //         });
      //       } else {
      //         // Search within the group's items
      //         items.forEach(item => {
      //           if (item.name === value) {
      //             output.push({ value: key + '-' + item.name, label: key });
      //           }
      //         });
      //       }
      //     });
      //   });

      //   setBasicone(output)

      //   return
      // }


      let uuuk = extractUniqueNotes(basicall, selected)
      uuuk.unshift({ label: "All Courses", value: "All" });

      setFulldatafull(uuuk)

      setSelectedOptions(selected || []);

      filterDataByDate(dateRange, onetime, twotime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      const output = [{
        "label": "All Hub",
        "value": "All"
      }];

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
    }


    // const validVenues = selected.map(item => item.value);

    //     // Filter the data
    //     const filteredData = Object.fromEntries(
    //       Object.entries(fulldatatwo).filter(([key, value]) => validVenues.includes(value.venue))
    //     );
    //     callfordata(filteredData , fulldata )

    //     setFulldatatwo(filteredData) 


    //     const filteredDatatwo = Object.fromEntries(
    //       Object.entries(fulldata).filter(([key, value]) => validVenues.includes(value.venue))
    //     );

    //     callfordata(filteredData , filteredDatatwo )
    //     setFulldata(filteredDatatwo)

  };

  const handleChangefive = (selected) => {

    console.log(JSON.stringify(fulldatatwo), 'selected')
    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldvenfive.some(item => item.value === "All");


    setOldvenfive(selected)

    if (hasAllValue === false && hasAllValueold === true) {
      setSelectedOptionsfive([]);

      // filterDataByDate(dateRange, onetime, twotime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, [],
        hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      const output = [];

      // // Iterate through the search array
      [].forEach(({ value }) => {
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

      setBasiconefive(output)

      return
    }



    if (hasAllValue === true) {

      setSelectedOptionsfive(basic || []);

      // filterDataByDate(dateRange, onetime, twotime, basic, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, basic, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
      filterDataByDateonee(dateRange, onetime, twotime, basic,
        hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
      const output = [{
        "label": "All Hub",
        "value": "All"
      }];

      // // Iterate through the search array
      basic.forEach(({ value }) => {
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

      setBasiconefive(output)


    } else {

      let lengthss = selected.length
      let lengthssone = basic.length

      // if (lengthss === lengthssone - 1) {
      //   setSelectedOptions( []);

      //   filterDataByDate(dateRange, onetime, twotime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      //   filterDataByDateonee(dateRangetwo, threetime, fourtime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      //   const output = [];

      //   // // Iterate through the search array
      //   [].forEach(({ value }) => {
      //     // Search in the data object
      //     Object.entries(alldrop).forEach(([key, items]) => {
      //       if (key === value) {
      //         // If the key matches, add all items from the group to the output
      //         items.forEach(item => {
      //           output.push({ value: key + '-' + item.name, label: item.name });
      //         });
      //       } else {
      //         // Search within the group's items
      //         items.forEach(item => {
      //           if (item.name === value) {
      //             output.push({ value: key + '-' + item.name, label: key });
      //           }
      //         });
      //       }
      //     });
      //   });

      //   setBasicone(output)

      //   return
      // }

      setSelectedOptionsfive(selected || []);

      // filterDataByDate(dateRange, onetime, twotime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
      filterDataByDateonee(dateRange, onetime, twotime, selected,
        hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
      const output = [{
        "label": "All Hub",
        "value": "All"
      }];

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

      setBasiconefive(output)
    }


  };


  const handleChangefine = (selected) => {
    console.log(editall, 'selected')

    if (editall.length === 0) {

    } else {

      if (selected.value === "Minimum") {
        setEditall((prevState) => ({
          ...prevState,
          orders: [...prevState.orders].sort(
            (a, b) => parseInt(a.processtime.replace(/\D/g, '')) - parseInt(b.processtime.replace(/\D/g, ''))
          ),
        }));
      } else {
        setEditall((prevState) => ({
          ...prevState,
          orders: [...prevState.orders].sort(
            (a, b) => parseInt(b.processtime.replace(/\D/g, '')) - parseInt(a.processtime.replace(/\D/g, ''))
          ),
        }));
      }



    }

    if (editallone.length === 0) {

    } else {

      if (selected.value === "Minimum") {
        setEditallone((prevState) => ({
          ...prevState,
          orders: [...prevState.orders].sort(
            (a, b) => parseInt(a.processtime.replace(/\D/g, '')) - parseInt(b.processtime.replace(/\D/g, ''))
          ),
        }));
      } else {
        setEditallone((prevState) => ({
          ...prevState,
          orders: [...prevState.orders].sort(
            (a, b) => parseInt(b.processtime.replace(/\D/g, '')) - parseInt(a.processtime.replace(/\D/g, ''))
          ),
        }));
      }

    }


    setSelectedOptionsfine(selected || []);


  };




  //.select options hub

  const [Hubradio, setHubradio] = useState(false)


  const [selectedhubOptions, setSelectedhubOptions] = useState(optionshub);


  const handleChangehub = (selected) => {

    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldpro.some(item => item.value === "All");

    setOldpro(selected)

    if (hasAllValue === false && hasAllValueold === true) {


      setSelectedhubOptions([]);
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, [])

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, [])

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, [])
      return

    }


    if (hasAllValue === true) {
      setSelectedhubOptions(optionshub);
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, optionshub)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, optionshub)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, optionshub)

    } else {
      setSelectedhubOptions(selected || []);
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)
      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)
      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)

    }


    // selectedhubOptions


  };


  const handleChangehubone = (selectedss) => {


    const hasAllValue = selectedss.some(item => item.value === "All");
    const hasAllValueold = oldhub.some(item => item.value === "All");

    setOldhub(selectedss)

    if (hasAllValue === false && hasAllValueold === true) {

      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubb([])


      filterDataByDate(dateRange, onetime, twotime, selectedOptions, [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      return
    }

    if (hasAllValue === true) {
      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubb(basicone)


      filterDataByDate(dateRange, onetime, twotime, selectedOptions, basicone, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, basicone, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    } else {
      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubb(selectedss)


      filterDataByDate(dateRange, onetime, twotime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    }





  };


  const handleChangehubtwo = (selectedss) => {


    const hasAllValue = selectedss.some(item => item.value === "All");
    const hasAllValueold = oldhubtwo.some(item => item.value === "All");

    setOldhubtwo(selectedss)

    if (hasAllValue === false && hasAllValueold === true) {

      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubbtwo([])


      // filterDataByDate(dateRange, onetime, twotime, selectedOptions, [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      return
    }

    if (hasAllValue === true) {
      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubbtwo(basiconefive)


      // filterDataByDate(dateRange, onetime, twotime, selectedOptions, basiconefive, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, basiconefive, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        basiconefive, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


    } else {
      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubbtwo(selectedss)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)



      // filterDataByDate(dateRange, onetime, twotime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    }





  };


  //select cources hub
  const [Cources, setCources] = useState(false)
  const optionsCources = [
    { value: 'all', label: 'All venues' },
    { value: 'volvo', label: 'Volvo' },
    { value: 'saab', label: 'Saab' },
    { value: 'mercedes', label: 'Mercedes' },
    { value: 'audi', label: 'Audi' },
  ];

  const [selectedCources, setSelectedCources] = useState([]);
  const handleChangeCources = (selected) => {


    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldcou.some(item => item.value === "All");

    setOldcou(selected)

    if (hasAllValue === false && hasAllValueold === true) {

      setSelectedCources([]);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, [], selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, [], selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, [], selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      return
    }

    if (hasAllValue === true) {

      setSelectedCources(fulldatafull);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, fulldatafull, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, fulldatafull, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, fulldatafull, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


    } else {
      setSelectedCources(selected || []);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
    }




  };


  //select takeaway
  const [takeaway, setTakeaway] = useState(false)

  const [selectedTakeaway, setSelectedTakeaway] = useState(optionstakeaway);
  const handleChangeTakeaway = (selected) => {

    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldtak.some(item => item.value === "All");

    setOldtak(selected)

    if (hasAllValue === false && hasAllValueold === true) {

      setSelectedTakeaway([]);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, [], inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selectedCources, [], inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, [], inputvalue, inputvaluetwo, selectedhubOptions)

      return

    }

    if (hasAllValue === true) {
      setSelectedTakeaway(optionstakeaway);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, optionstakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selectedCources, optionstakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, optionstakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
    } else {
      setSelectedTakeaway(selected || []);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
        hubbtwo, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)


      // filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)
    }


  };
  //times
  let [onetime, setOnetime] = useState('')
  let [twotime, setTwotime] = useState('')
  let [threetime, setThreetime] = useState('')
  let [fourtime, setFourtime] = useState('')

  //input value
  let [inputvalue, setInputvalue] = useState()
  let [inputvaluetwo, setInputvaluetwo] = useState()


  const pdfRef = useRef();

  const pdfRefred = useRef();
  const pdfRefredone = useRef();


  let ggggrt = () => {
    let kkki = 0
    served?.map((reee) => {

      kkki = kkki + reee.count
    })

    return kkki
  }

  let ggggrtz = () => {
    let kkki = 0
    minperday?.map((reee) => {

      kkki = kkki + reee.count
    })

    return kkki
  }

  let ggggrts = () => {
    let kkki = 0
    servedone?.map((reee) => {

      kkki = kkki + reee.count
    })

    return kkki
  }



  function filterDataByDate(vals, time, time2, val21, val22, cources, takeaways, inone, intwo, alltype) {

    let alldat = basicall
    cources = cources.filter(item => item.value !== "All");


    console.log(JSON.stringify(alltype), 'val2245')

    if (vals[1] === null || vals[1] === "null") {

    } else {
      let datesearch = (val) => {
        // Convert the input dates into Date objects
        let onee = val[0];
        let date = new Date(onee);
        date.setDate(date.getDate() + 1);
        let formattedDate = date;  // Use this Date object directly

        let two = val[1];
        const datetwo = new Date(two);
        datetwo.setDate(datetwo.getDate() + 1); // Keep the same date, no modification
        const formattedDatetwo = datetwo;  // Use this Date object directly

        console.log(formattedDate, 'formattedDate', formattedDatetwo);

        // Function to generate all dates between formattedDate and formattedDatetwo
        function generateDatesInRange(startDate, endDate) {
          let dates = [];
          let currentDate = new Date(startDate);

          while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]); // Push the date as string "YYYY-MM-DD"
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
          }
          return dates;
        }

        let dateRange = generateDatesInRange(formattedDate, formattedDatetwo);
        console.log(dateRange, 'dateRange'); // This will show all dates between the range

        // Recursive function to filter the data based on the date range
        function filterObject(obj) {
          let result = {};

          for (const key in obj) {
            // If the value is an object, recursively process it
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
              const filtered = filterObject(obj[key]);
              if (Object.keys(filtered).length > 0) {
                result[key] = filtered;
              }
            }
            // If the value is an array and the key represents a date within the range
            else if (Array.isArray(obj[key]) && dateRange.includes(key)) {
              result[key] = obj[key];
            }
          }
          return result;
        }

        return filterObject(alldat);  // Assuming `basicall` is your data to filter
      }

      alldat = datesearch(vals)

      console.log(alldat, 'one')

    }

    if (time != "" && time2 === '') {
      let filterDataByTime = (targetTime) => {
        // Convert targetTime (e.g. "16:23") to a comparable Date object 
        targetTime = targetTime.replace(":", "");
        console.log(targetTime, 'targetTimetargetTimetargetTime')
        // Function to process STAMP and filter based on time
        function processData(obj) {
          let result = {};

          for (const dateKey in obj) {
            if (typeof obj[dateKey] === 'object' && !Array.isArray(obj[dateKey])) {
              result[dateKey] = processData(obj[dateKey]);
            } else if (Array.isArray(obj[dateKey])) {
              // Filter items based on the STAMP field
              result[dateKey] = obj[dateKey].filter(item => {
                if (item.STAMP) {
                  let stamp = item.STAMP;
                  let timeStr = stamp.split(" ")[1]; // Get the second part (e.g., "1121R0")

                  timeStr = timeStr.replace("R0", ""); // Remove "R0"

                  // Compare the STAMP time with targetTime
                  return timeStr === targetTime;
                }
                return false;
              });
            }
          }

          return result;
        }

        return processData(alldat);
      };


      alldat = filterDataByTime(time)
      console.log(alldat, 'two')

    }

    if (time != "" && time2 != '') {
      let filterDataByTimeRange = (startTime, endTime) => {

        startTime = parseInt(startTime.replace(":", ""), 10);   // Make sure seconds are zero for comparison

        endTime = parseInt(endTime.replace(":", ""), 10);

        function processData(obj) {
          let result = {};

          for (const dateKey in obj) {
            if (typeof obj[dateKey] === 'object' && !Array.isArray(obj[dateKey])) {
              result[dateKey] = processData(obj[dateKey]);
            } else if (Array.isArray(obj[dateKey])) {
              // Filter items based on the STAMP field
              result[dateKey] = obj[dateKey].filter(item => {
                if (item.STAMP) {
                  let stamp = item.STAMP;
                  let timeStr = stamp.split(" ")[1]; // Get the second part (e.g., "1121R0")
                  timeStr = parseInt(timeStr.replace("R0", "")); // Remove "R0" 


                  // Check if the time is within the range
                  return timeStr >= startTime && timeStr <= endTime;
                }
                return false;
              });
            }
          }

          return result;
        }

        return processData(alldat);
      };

      let alldddd = filterDataByTimeRange(time, time2)

      alldat = alldddd

      console.log(alldddd, 'three')
    }

    if (val21.length != 0) {
      const filteredData = {};

      val21.forEach(filter => {
        const key = filter.value;
        for (const mainKey in alldat) {
          if (alldat[mainKey][key]) {
            if (!filteredData[mainKey]) {
              filteredData[mainKey] = {}; // Initialize if not exists
            }
            filteredData[mainKey][key] = alldat[mainKey][key];
          }
        }
      });

      alldat = filteredData

      console.log(filteredData, 'four')

    }

    if (val22.length === 0 || val22 === "") {



    } else {
      // function filterDataByDynamicKey(key) {
      //   // Split the key into top-level key and hub name
      //   const [topLevelKey, hubName] = key.split('-');

      //   // Initialize an empty object for the filtered result
      //   const filteredData = {};

      //   // Check if the top-level key exists in the data
      //   if (alldat[topLevelKey]) {
      //     filteredData[topLevelKey] = {};

      //     // Loop through each second-level key (e.g., "GreenbankServicesClubecall")
      //     for (const secondLevelKey in alldat[topLevelKey]) {
      //       if (alldat[topLevelKey].hasOwnProperty(secondLevelKey)) {
      //         // Check if the second-level key contains the hub name
      //         if (alldat[topLevelKey][secondLevelKey][hubName]) {
      //           // Add the filtered data for that second-level key and hub name
      //           filteredData[topLevelKey][secondLevelKey] = {
      //             [hubName]: alldat[topLevelKey][secondLevelKey][hubName]
      //           };
      //         }
      //       }
      //     }
      //   }

      //   return filteredData;
      // }

      // alldat = filterDataByDynamicKey(val22)

      // console.log(alldat, 'five')

      const filterDataByDynamicKeys = (data, filterCriteria) => {
        const filteredData = {};

        filterCriteria.forEach(({ label }) => {
          const [hub, parent] = label.split('-'); // Extract hub and parent names

          // Find the corresponding key in the data
          for (const key in data) {
            if (data[key][parent] && data[key][parent][hub]) {
              if (!filteredData[key]) filteredData[key] = {};
              if (!filteredData[key][parent]) filteredData[key][parent] = {};
              filteredData[key][parent][hub] = data[key][parent][hub];
            }
          }
        });

        return filteredData;
      };



      // function filterDataByDynamicKeys(keysArray) {
      //   const filteredData = {};

      //   keysArray.forEach(({ value }) => {
      //     const [topLevelKey, hubName, secondTopLevelKey] = value.split('-');

      //     if (alldat[topLevelKey] && alldat[topLevelKey][secondTopLevelKey]) {
      //       const secondLevelData = alldat[topLevelKey][secondTopLevelKey];

      //       // Check if the hub exists
      //       if (secondLevelData[hubName]) {
      //         if (!filteredData[topLevelKey]) {
      //           filteredData[topLevelKey] = {};
      //         }

      //         if (!filteredData[topLevelKey][secondTopLevelKey]) {
      //           filteredData[topLevelKey][secondTopLevelKey] = {};
      //         }

      //         filteredData[topLevelKey][secondTopLevelKey][hubName] = secondLevelData[hubName];
      //       }
      //     }
      //   });

      //   return filteredData;
      // }
      let ofjfij = filterDataByDynamicKeys(alldat, val22)

      alldat = ofjfij

      console.log(alldat, 'five')

    }

    if (cources.length != 0) {


      function filterByNoted(data, filterNotes) {
        let filteredData = {};

        // Extract only values from the filter list
        const validNotes = filterNotes.map(item => item.value);

        for (let group in data) {
          for (let location in data[group]) {
            for (let section in data[group][location]) {
              for (let date in data[group][location][section]) {
                let filteredOrders = data[group][location][section][date].map(order => {
                  let filteredItems = order.ITEMS.filter(item => {
                    if (!item.NOTE) return false; // Ignore empty or undefined NOTE

                    // Extract the word after (C<number>)
                    const match = item.NOTE.match(/\(C\d+([a-zA-Z]+)\)/);
                    if (match && match[1]) {
                      return validNotes.includes(match[1]); // Keep only if in validNotes
                    }
                    return false;
                  });

                  return filteredItems.length > 0 ? { ...order, ITEMS: filteredItems } : null;
                }).filter(order => order !== null);

                if (filteredOrders.length > 0) {
                  if (!filteredData[group]) filteredData[group] = {};
                  if (!filteredData[group][location]) filteredData[group][location] = {};
                  if (!filteredData[group][location][section]) filteredData[group][location][section] = {};
                  filteredData[group][location][section][date] = filteredOrders;
                }
              }
            }
          }
        }

        return filteredData;
      }


      alldat = filterByNoted(alldat, cources)

      console.log(alldat, 'six')



    }

    // if (takeaways.length != 0 && takeaway === true ) {

    //   function filterByNote(data, regex) {
    //     if (Array.isArray(data)) {
    //         return data
    //             .map(item => filterByNote(item, regex))
    //             .filter(item => item !== null);
    //     } else if (typeof data === 'object' && data !== null) {
    //         if (data.hasOwnProperty('NOTE') && regex.test(data.NOTE)) {
    //             return {
    //                 ...data,
    //                 ITEMS: data.ITEMS ? filterByNote(data.ITEMS, regex) : data.ITEMS
    //             };
    //         } else if (!data.hasOwnProperty('NOTE')) {
    //             let filteredObject = {};
    //             for (let key in data) {
    //                 let filteredValue = filterByNote(data[key], regex);
    //                 if (filteredValue !== null) {
    //                     filteredObject[key] = filteredValue;
    //                 }
    //             }
    //             return Object.keys(filteredObject).length > 0 ? filteredObject : null;
    //         }
    //     }
    //     return null;
    // } 
    // const regex = new RegExp(takeaways.map(t => t.value).join("|"), "i"); // Adjust regex dynamically 

    // // const filteredData = filterByNote(originalData, regex);
    // alldat = filterByNote(alldat, regex);



    //   // function filterByNote(filters) {
    //   //   console.log( JSON.stringify(filters) , 'JSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringify')

    //   //   console.log( JSON.stringify(alldat) , 'JSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringify')


    //   //   const allowedNotes = filters.map(f => f.value); // Extract values from filter array 
    //   //   const regex = new RegExp(allowedNotes.join("|"), "i"); // Create regex pattern for filtering

    //   //   function traverse(obj) {
    //   //     if (Array.isArray(obj)) {

    //   //       return obj.map(traverse).filter(entry => entry !== null);
    //   //     } else if (typeof obj === "object" && obj !== null) {

    //   //       let newObj = {};
    //   //       let hasMatch = false;

    //   //       for (let key in obj) { 
    //   //         if (key === "NOTE" && typeof obj[key] === "string" && regex.test(obj[key])) {
    //   //           hasMatch = true;
    //   //         } else {
    //   //           let value = traverse(obj[key]);
    //   //           if (value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
    //   //             newObj[key] = value;
    //   //             hasMatch = true;
    //   //           }
    //   //         }
    //   //       }

    //   //       return hasMatch ? newObj : null;
    //   //     }
    //   //     return obj;
    //   //   }



    //   //   let result = {};
    //   //   Object.keys(alldat).forEach(key => {
    //   //     console.log(alldat , '')

    //   //     let filtered = traverse(alldat[key]);
    //   //     if (filtered && Object.keys(filtered).length > 0) {
    //   //       result[key] = filtered;
    //   //     }
    //   //   });

    //   //   return result;
    //   // }


    //   // alldat = filterByNote(takeaway)

    //   console.log(alldat, 'seven')

    // }else{ 
    // }

    if (inone != undefined) {
      let splitone = inone.split('-')


      if (splitone.length === 2) {

        if (Number(splitone[0]) < Number(splitone[1])) {



          function filterDataByTableRanges(data, ranges) {
            const filteredData = {};

            Object.entries(data).forEach(([groupKey, groupData]) => {
              Object.entries(groupData).forEach(([venueKey, venueData]) => {
                Object.entries(venueData).forEach(([areaKey, areaData]) => {
                  Object.entries(areaData).forEach(([dateKey, records]) => {
                    const filteredRecords = records.filter(record => {
                      const tableNum = parseInt(record.TABLE, 10);
                      return ranges.some(([min, max]) => tableNum >= min && tableNum <= max);
                    });

                    if (filteredRecords.length > 0) {
                      if (!filteredData[groupKey]) filteredData[groupKey] = {};
                      if (!filteredData[groupKey][venueKey]) filteredData[groupKey][venueKey] = {};
                      if (!filteredData[groupKey][venueKey][areaKey]) filteredData[groupKey][venueKey][areaKey] = {};
                      filteredData[groupKey][venueKey][areaKey][dateKey] = filteredRecords;
                    }
                  });
                });
              });
            });

            return filteredData;
          }

          const ranges = [[Number(splitone[0]), Number(splitone[1])]];

          let twelves = filterDataByTableRanges(alldat, ranges)

          alldat = twelves


          console.log(twelves, 'nine')
        } else {

        }

      } else {

      }
    }

    if (inone != undefined && intwo != undefined) {
      let splitone = inone.split('-')

      let splittwo = intwo.split('-')
      console.log(splitone.length, 'ten    lll', splitone.length)
      if (splitone.length === 2 && splittwo.length === 2) {

        if (Number(splitone[0]) < Number(splitone[1]) && Number(splittwo[0]) < Number(splittwo[1])) {



          function filterDataByTableRanges(data, ranges) {
            const filteredData = {};

            Object.entries(data).forEach(([groupKey, groupData]) => {
              Object.entries(groupData).forEach(([venueKey, venueData]) => {
                Object.entries(venueData).forEach(([areaKey, areaData]) => {
                  Object.entries(areaData).forEach(([dateKey, records]) => {
                    const filteredRecords = records.filter(record => {
                      const tableNum = parseInt(record.TABLE, 10);
                      return ranges.some(([min, max]) => tableNum >= min && tableNum <= max);
                    });

                    if (filteredRecords.length > 0) {
                      if (!filteredData[groupKey]) filteredData[groupKey] = {};
                      if (!filteredData[groupKey][venueKey]) filteredData[groupKey][venueKey] = {};
                      if (!filteredData[groupKey][venueKey][areaKey]) filteredData[groupKey][venueKey][areaKey] = {};
                      filteredData[groupKey][venueKey][areaKey][dateKey] = filteredRecords;
                    }
                  });
                });
              });
            });

            return filteredData;
          }

          const ranges = [[Number(splitone[0]), Number(splitone[1])], [Number(splittwo[0]), Number(splittwo[1])]];

          let twelves = filterDataByTableRanges(alldat, ranges)

          alldat = twelves


          console.log(twelves, 'nine')
        } else {

        }

      } else {

      }
    }

    if (alltype === undefined || alltype.length === 0) {

    } else {
      function filterByStamp(data, filterValues) {
        let filteredData = {};

        // Create a mapping of values to stamp identifiers
        const stampMapping = {
          "R": "R0",
          "H": "H0",
          "P": "P0",
          "S": "S0"
        };

        // Extract relevant values
        const validStamps = filterValues.map(f => stampMapping[f.value]).filter(Boolean);

        for (let group in data) {
          for (let location in data[group]) {
            for (let section in data[group][location]) {
              for (let date in data[group][location][section]) {
                let orders = data[group][location][section][date].filter(order =>
                  validStamps.some(stamp => order.STAMP.includes(stamp))
                );

                if (!filteredData[group]) filteredData[group] = {};
                if (!filteredData[group][location]) filteredData[group][location] = {};
                if (!filteredData[group][location][section]) filteredData[group][location][section] = {};

                if (orders.length > 0) {
                  filteredData[group][location][section][date] = orders;
                }
              }
            }
          }
        }

        return filteredData;
      }


      let resultss = filterByStamp(alldat, alltype);

      alldat = resultss

      console.log(resultss, 'tenten')
    }

    const filteredData = {};

    Object.entries(alldat).forEach(([groupKey, groupData]) => {


      Object.entries(groupData).forEach(([areas, areaDatas]) => {



        Object.entries(areaDatas).forEach(([area, areaData]) => {


          Object.entries(areaData).forEach(([dates, records]) => {
            // Check if the date is within the range 
            // Create the dynamic key based on the index and date
            const index = `${Object.keys(filteredData).length + 1}`;

            filteredData[`${index}) ${dates}`] = records;


          });
        });
      });
    });
    setFilterdataone(filteredData)

    callfordataone(filteredData)
    let ghi = processTimeData(alldat)
    let kidshort = ghi.sort((a, b) => a.time.localeCompare(b.time));
    // Extract values into separate arrays
    let timeLabels = kidshort.map(entry => entry.time);
    let timeCounts = kidshort.map(entry => entry.count);

    setOption(timeLabels)
    setOneBar(timeCounts)

    let ghione = processTimeDatatwo(alldat)
    let kidshortone = ghione.sort((a, b) => a.time.localeCompare(b.time));
    // Extract values into separate arrays
    let timeLabelsone = kidshortone.map(entry => entry.time);
    let timeCountsone = kidshortone.map(entry => entry.count);

    setOptionone(timeLabelsone)
    setOneBarone(timeCountsone)
    console.log(JSON.stringify(ghione), 'thousand', ghione)



  }


  function processTimeData(data) {
    let timeCounts = {};

    function extractTime(stamp) {
      let match = stamp.match(/\d{4}(R0|H0|P0|S0)/);
      if (match) {
        return match[0].slice(0, 2) + ":" + match[0].slice(2, 4); // Convert to HH:MM
      }
      return null;
    }

    function roundToInterval(time) {
      let [hour, minute] = time.split(":").map(Number);
      let roundedMinute = Math.floor(minute / 10) * 10; // Round to nearest lower 10-minute mark
      return `${hour}.${roundedMinute.toString().padStart(2, "0")}`;
    }

    for (let group in data) {
      for (let location in data[group]) {
        for (let section in data[group][location]) {
          for (let date in data[group][location][section]) {
            data[group][location][section][date].forEach(order => {
              let stamps = order.STAMP.split(" "); // Split STAMP string
              stamps.forEach(stamp => {
                let extractedTime = extractTime(stamp);
                if (extractedTime) {
                  let interval = roundToInterval(extractedTime);
                  timeCounts[interval] = (timeCounts[interval] || 0) + 1;
                }
              });
            });
          }
        }
      }
    }

    return Object.keys(timeCounts)
      .sort((a, b) => a.localeCompare(b)) // Sort times in ascending order
      .map(time => ({ time, count: timeCounts[time] })).slice(1);
  }

  function processTimeDatatwo(data) {
    let timeCounts = {};

    function extractTime(stamp) {
      // Match only S0, S1, S2, ... values in the stamp
      let match = stamp.match(/\d{4}(S)/);
      if (match) {
        return match[0].slice(0, 2) + ":" + match[0].slice(2, 4); // Convert to HH:MM
      }
      return null; // Skip if S0, S1, etc., is not found
    }

    function roundToInterval(time) {
      let [hour, minute] = time.split(":").map(Number);
      let roundedMinute = Math.floor(minute / 10) * 10; // Round to nearest lower 10-minute mark
      return `${hour}.${roundedMinute.toString().padStart(2, "0")}`;
    }

    for (let group in data) {
      for (let location in data[group]) {
        for (let section in data[group][location]) {
          for (let date in data[group][location][section]) {
            data[group][location][section][date].forEach(order => {
              let stamps = order.STAMP.split(" "); // Split STAMP string
              stamps.forEach(stamp => {
                let extractedTime = extractTime(stamp);
                if (extractedTime) {
                  let interval = roundToInterval(extractedTime);
                  timeCounts[interval] = (timeCounts[interval] || 0) + 1;
                }
              });
            });
          }
        }
      }
    }

    return Object.keys(timeCounts)
      .sort((a, b) => a.localeCompare(b)) // Sort times in ascending order
      .map(time => ({ time, count: timeCounts[time] })).slice(1);
  }



  function filterDataByDateonee(vals, time, time2, val21, val22, cources, takeaways, inone, intwo, alltype) {
    cources = cources.filter(item => item.value !== "All");

    let alldat = basicall

    console.log(JSON.stringify(alltype), 'val2245')

    if (vals[1] === null || vals[1] === "null") {

    } else {
      let datesearch = (val) => {
        // Convert the input dates into Date objects
        let onee = val[0];
        let date = new Date(onee);
        date.setDate(date.getDate() + 1);
        let formattedDate = date;  // Use this Date object directly

        let two = val[1];
        const datetwo = new Date(two);
        datetwo.setDate(datetwo.getDate() + 1); // Keep the same date, no modification
        const formattedDatetwo = datetwo;  // Use this Date object directly

        console.log(formattedDate, 'formattedDate', formattedDatetwo);

        // Function to generate all dates between formattedDate and formattedDatetwo
        function generateDatesInRange(startDate, endDate) {
          let dates = [];
          let currentDate = new Date(startDate);

          while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]); // Push the date as string "YYYY-MM-DD"
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
          }
          return dates;
        }

        let dateRange = generateDatesInRange(formattedDate, formattedDatetwo);
        console.log(dateRange, 'dateRange'); // This will show all dates between the range

        // Recursive function to filter the data based on the date range
        function filterObject(obj) {
          let result = {};

          for (const key in obj) {
            // If the value is an object, recursively process it
            if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
              const filtered = filterObject(obj[key]);
              if (Object.keys(filtered).length > 0) {
                result[key] = filtered;
              }
            }
            // If the value is an array and the key represents a date within the range
            else if (Array.isArray(obj[key]) && dateRange.includes(key)) {
              result[key] = obj[key];
            }
          }
          return result;
        }

        return filterObject(alldat);  // Assuming `basicall` is your data to filter
      }

      alldat = datesearch(vals)

      console.log(alldat, 'one')

    }

    if (time != "" && time2 === '') {
      let filterDataByTime = (targetTime) => {
        // Convert targetTime (e.g. "16:23") to a comparable Date object 
        targetTime = targetTime.replace(":", "");
        console.log(targetTime, 'targetTimetargetTimetargetTime')
        // Function to process STAMP and filter based on time
        function processData(obj) {
          let result = {};

          for (const dateKey in obj) {
            if (typeof obj[dateKey] === 'object' && !Array.isArray(obj[dateKey])) {
              result[dateKey] = processData(obj[dateKey]);
            } else if (Array.isArray(obj[dateKey])) {
              // Filter items based on the STAMP field
              result[dateKey] = obj[dateKey].filter(item => {
                if (item.STAMP) {
                  let stamp = item.STAMP;
                  let timeStr = stamp.split(" ")[1]; // Get the second part (e.g., "1121R0")

                  timeStr = timeStr.replace("R0", ""); // Remove "R0"

                  // Compare the STAMP time with targetTime
                  return timeStr === targetTime;
                }
                return false;
              });
            }
          }

          return result;
        }

        return processData(alldat);
      };


      alldat = filterDataByTime(time)
      console.log(alldat, 'two')

    }

    if (time != "" && time2 != '') {
      let filterDataByTimeRange = (startTime, endTime) => {

        startTime = parseInt(startTime.replace(":", ""), 10);   // Make sure seconds are zero for comparison

        endTime = parseInt(endTime.replace(":", ""), 10);

        function processData(obj) {
          let result = {};

          for (const dateKey in obj) {
            if (typeof obj[dateKey] === 'object' && !Array.isArray(obj[dateKey])) {
              result[dateKey] = processData(obj[dateKey]);
            } else if (Array.isArray(obj[dateKey])) {
              // Filter items based on the STAMP field
              result[dateKey] = obj[dateKey].filter(item => {
                if (item.STAMP) {
                  let stamp = item.STAMP;
                  let timeStr = stamp.split(" ")[1]; // Get the second part (e.g., "1121R0")
                  timeStr = parseInt(timeStr.replace("R0", "")); // Remove "R0" 


                  // Check if the time is within the range
                  return timeStr >= startTime && timeStr <= endTime;
                }
                return false;
              });
            }
          }

          return result;
        }

        return processData(alldat);
      };

      let alldddd = filterDataByTimeRange(time, time2)

      alldat = alldddd

      console.log(alldddd, 'three')
    }

    if (val21.length != 0) {
      const filteredData = {};

      val21.forEach(filter => {
        const key = filter.value;
        for (const mainKey in alldat) {
          if (alldat[mainKey][key]) {
            if (!filteredData[mainKey]) {
              filteredData[mainKey] = {}; // Initialize if not exists
            }
            filteredData[mainKey][key] = alldat[mainKey][key];
          }
        }
      });

      alldat = filteredData

      console.log(filteredData, 'four')

    }

    if (val22.length === 0 || val22 === "") {



    } else {
      // function filterDataByDynamicKey(key) {
      //   // Split the key into top-level key and hub name
      //   const [topLevelKey, hubName] = key.split('-');

      //   // Initialize an empty object for the filtered result
      //   const filteredData = {};

      //   // Check if the top-level key exists in the data
      //   if (alldat[topLevelKey]) {
      //     filteredData[topLevelKey] = {};

      //     // Loop through each second-level key (e.g., "GreenbankServicesClubecall")
      //     for (const secondLevelKey in alldat[topLevelKey]) {
      //       if (alldat[topLevelKey].hasOwnProperty(secondLevelKey)) {
      //         // Check if the second-level key contains the hub name
      //         if (alldat[topLevelKey][secondLevelKey][hubName]) {
      //           // Add the filtered data for that second-level key and hub name
      //           filteredData[topLevelKey][secondLevelKey] = {
      //             [hubName]: alldat[topLevelKey][secondLevelKey][hubName]
      //           };
      //         }
      //       }
      //     }
      //   }

      //   return filteredData;
      // }

      // alldat = filterDataByDynamicKey(val22)

      // console.log(alldat, 'five')

      const filterDataByDynamicKeys = (data, filterCriteria) => {
        const filteredData = {};

        filterCriteria.forEach(({ label }) => {
          const [hub, parent] = label.split('-'); // Extract hub and parent names

          // Find the corresponding key in the data
          for (const key in data) {
            if (data[key][parent] && data[key][parent][hub]) {
              if (!filteredData[key]) filteredData[key] = {};
              if (!filteredData[key][parent]) filteredData[key][parent] = {};
              filteredData[key][parent][hub] = data[key][parent][hub];
            }
          }
        });

        return filteredData;
      };



      // function filterDataByDynamicKeys(keysArray) {
      //   const filteredData = {};

      //   keysArray.forEach(({ value }) => {
      //     const [topLevelKey, hubName, secondTopLevelKey] = value.split('-');

      //     if (alldat[topLevelKey] && alldat[topLevelKey][secondTopLevelKey]) {
      //       const secondLevelData = alldat[topLevelKey][secondTopLevelKey];

      //       // Check if the hub exists
      //       if (secondLevelData[hubName]) {
      //         if (!filteredData[topLevelKey]) {
      //           filteredData[topLevelKey] = {};
      //         }

      //         if (!filteredData[topLevelKey][secondTopLevelKey]) {
      //           filteredData[topLevelKey][secondTopLevelKey] = {};
      //         }

      //         filteredData[topLevelKey][secondTopLevelKey][hubName] = secondLevelData[hubName];
      //       }
      //     }
      //   });

      //   return filteredData;
      // }
      let ofjfij = filterDataByDynamicKeys(alldat, val22)

      alldat = ofjfij

      console.log(alldat, 'five')

    }

    if (cources.length != 0) {


      function filterByNoted(data, filterNotes) {
        let filteredData = {};

        // Extract only values from the filter list
        const validNotes = filterNotes.map(item => item.value);

        for (let group in data) {
          for (let location in data[group]) {
            for (let section in data[group][location]) {
              for (let date in data[group][location][section]) {
                let filteredOrders = data[group][location][section][date].map(order => {
                  let filteredItems = order.ITEMS.filter(item => {
                    if (!item.NOTE) return false; // Ignore empty or undefined NOTE

                    // Extract the word after (C<number>)
                    const match = item.NOTE.match(/\(C\d+([a-zA-Z]+)\)/);
                    if (match && match[1]) {
                      return validNotes.includes(match[1]); // Keep only if in validNotes
                    }
                    return false;
                  });

                  return filteredItems.length > 0 ? { ...order, ITEMS: filteredItems } : null;
                }).filter(order => order !== null);

                if (filteredOrders.length > 0) {
                  if (!filteredData[group]) filteredData[group] = {};
                  if (!filteredData[group][location]) filteredData[group][location] = {};
                  if (!filteredData[group][location][section]) filteredData[group][location][section] = {};
                  filteredData[group][location][section][date] = filteredOrders;
                }
              }
            }
          }
        }

        return filteredData;
      }


      alldat = filterByNoted(alldat, cources)

      console.log(alldat, 'six')



    }

    if (takeaways.length != 0 && takeaway === true) {

      function filterByNote(data, regex) {
        if (Array.isArray(data)) {
          return data
            .map(item => filterByNote(item, regex))
            .filter(item => item !== null);
        } else if (typeof data === 'object' && data !== null) {
          if (data.hasOwnProperty('NOTE') && regex.test(data.NOTE)) {
            return {
              ...data,
              ITEMS: data.ITEMS ? filterByNote(data.ITEMS, regex) : data.ITEMS
            };
          } else if (!data.hasOwnProperty('NOTE')) {
            let filteredObject = {};
            for (let key in data) {
              let filteredValue = filterByNote(data[key], regex);
              if (filteredValue !== null) {
                filteredObject[key] = filteredValue;
              }
            }
            return Object.keys(filteredObject).length > 0 ? filteredObject : null;
          }
        }
        return null;
      }
      const regex = new RegExp(takeaways.map(t => t.value).join("|"), "i"); // Adjust regex dynamically 

      // const filteredData = filterByNote(originalData, regex);
      alldat = filterByNote(alldat, regex);



      // function filterByNote(filters) {
      //   console.log( JSON.stringify(filters) , 'JSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringify')

      //   console.log( JSON.stringify(alldat) , 'JSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringifyJSON.stringify')


      //   const allowedNotes = filters.map(f => f.value); // Extract values from filter array 
      //   const regex = new RegExp(allowedNotes.join("|"), "i"); // Create regex pattern for filtering

      //   function traverse(obj) {
      //     if (Array.isArray(obj)) {

      //       return obj.map(traverse).filter(entry => entry !== null);
      //     } else if (typeof obj === "object" && obj !== null) {

      //       let newObj = {};
      //       let hasMatch = false;

      //       for (let key in obj) { 
      //         if (key === "NOTE" && typeof obj[key] === "string" && regex.test(obj[key])) {
      //           hasMatch = true;
      //         } else {
      //           let value = traverse(obj[key]);
      //           if (value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
      //             newObj[key] = value;
      //             hasMatch = true;
      //           }
      //         }
      //       }

      //       return hasMatch ? newObj : null;
      //     }
      //     return obj;
      //   }



      //   let result = {};
      //   Object.keys(alldat).forEach(key => {
      //     console.log(alldat , '')

      //     let filtered = traverse(alldat[key]);
      //     if (filtered && Object.keys(filtered).length > 0) {
      //       result[key] = filtered;
      //     }
      //   });

      //   return result;
      // }


      // alldat = filterByNote(takeaway)

      console.log(alldat, 'seven')

    } else {
    }

    if (inone != undefined) {
      let splitone = inone.split('-')


      if (splitone.length === 2) {

        if (Number(splitone[0]) < Number(splitone[1])) {



          function filterDataByTableRanges(data, ranges) {
            const filteredData = {};

            Object.entries(data).forEach(([groupKey, groupData]) => {
              Object.entries(groupData).forEach(([venueKey, venueData]) => {
                Object.entries(venueData).forEach(([areaKey, areaData]) => {
                  Object.entries(areaData).forEach(([dateKey, records]) => {
                    const filteredRecords = records.filter(record => {
                      const tableNum = parseInt(record.TABLE, 10);
                      return ranges.some(([min, max]) => tableNum >= min && tableNum <= max);
                    });

                    if (filteredRecords.length > 0) {
                      if (!filteredData[groupKey]) filteredData[groupKey] = {};
                      if (!filteredData[groupKey][venueKey]) filteredData[groupKey][venueKey] = {};
                      if (!filteredData[groupKey][venueKey][areaKey]) filteredData[groupKey][venueKey][areaKey] = {};
                      filteredData[groupKey][venueKey][areaKey][dateKey] = filteredRecords;
                    }
                  });
                });
              });
            });

            return filteredData;
          }

          const ranges = [[Number(splitone[0]), Number(splitone[1])]];

          let twelves = filterDataByTableRanges(alldat, ranges)

          alldat = twelves


          console.log(twelves, 'nine')
        } else {

        }

      } else {

      }
    }

    if (inone != undefined && intwo != undefined) {
      let splitone = inone.split('-')

      let splittwo = intwo.split('-')
      console.log(splitone.length, 'ten    lll', splitone.length)
      if (splitone.length === 2 && splittwo.length === 2) {

        if (Number(splitone[0]) < Number(splitone[1]) && Number(splittwo[0]) < Number(splittwo[1])) {



          function filterDataByTableRanges(data, ranges) {
            const filteredData = {};

            Object.entries(data).forEach(([groupKey, groupData]) => {
              Object.entries(groupData).forEach(([venueKey, venueData]) => {
                Object.entries(venueData).forEach(([areaKey, areaData]) => {
                  Object.entries(areaData).forEach(([dateKey, records]) => {
                    const filteredRecords = records.filter(record => {
                      const tableNum = parseInt(record.TABLE, 10);
                      return ranges.some(([min, max]) => tableNum >= min && tableNum <= max);
                    });

                    if (filteredRecords.length > 0) {
                      if (!filteredData[groupKey]) filteredData[groupKey] = {};
                      if (!filteredData[groupKey][venueKey]) filteredData[groupKey][venueKey] = {};
                      if (!filteredData[groupKey][venueKey][areaKey]) filteredData[groupKey][venueKey][areaKey] = {};
                      filteredData[groupKey][venueKey][areaKey][dateKey] = filteredRecords;
                    }
                  });
                });
              });
            });

            return filteredData;
          }

          const ranges = [[Number(splitone[0]), Number(splitone[1])], [Number(splittwo[0]), Number(splittwo[1])]];

          let twelves = filterDataByTableRanges(alldat, ranges)

          alldat = twelves


          console.log(twelves, 'nine')
        } else {

        }

      } else {

      }
    }

    if (alltype === undefined || alltype.length === 0) {

    } else {
      function filterByStamp(data, filterValues) {
        let filteredData = {};

        // Create a mapping of values to stamp identifiers
        const stampMapping = {
          "R": "R0",
          "H": "H0",
          "P": "P0",
          "S": "S0"
        };

        // Extract relevant values
        const validStamps = filterValues.map(f => stampMapping[f.value]).filter(Boolean);

        for (let group in data) {
          for (let location in data[group]) {
            for (let section in data[group][location]) {
              for (let date in data[group][location][section]) {
                let orders = data[group][location][section][date].filter(order =>
                  validStamps.some(stamp => order.STAMP.includes(stamp))
                );

                if (!filteredData[group]) filteredData[group] = {};
                if (!filteredData[group][location]) filteredData[group][location] = {};
                if (!filteredData[group][location][section]) filteredData[group][location][section] = {};

                if (orders.length > 0) {
                  filteredData[group][location][section][date] = orders;
                }
              }
            }
          }
        }

        return filteredData;
      }


      let resultss = filterByStamp(alldat, alltype);

      alldat = resultss

      console.log(resultss, 'tenten')
    }


    console.log(JSON.stringify(alldat), 'elevenn')



    const filteredData = {};

    Object.entries(alldat).forEach(([groupKey, groupData]) => {


      Object.entries(groupData).forEach(([areas, areaDatas]) => {



        Object.entries(areaDatas).forEach(([area, areaData]) => {


          Object.entries(areaData).forEach(([dates, records]) => {
            // Check if the date is within the range 
            // Create the dynamic key based on the index and date
            const index = `${Object.keys(filteredData).length + 1}`;

            filteredData[`${index}) ${dates}`] = records;


          });
        });
      });
    });


    setFilterdatatwo(filteredData)


    console.log(filteredData, 'eight')


    callfordataonetwo(filteredData)


    let ghi = processTimeData(alldat)

    let kidshort = ghi.sort((a, b) => a.time.localeCompare(b.time));

    // Extract values into separate arrays
    let timeLabels = kidshort.map(entry => entry.time);
    let timeCounts = kidshort.map(entry => entry.count);
    setTwobar(timeCounts)

    let ghitwo = processTimeDatatwo(alldat)

    let kidshorttwo = ghitwo.sort((a, b) => a.time.localeCompare(b.time));

    // Extract values into separate arrays
    let timeLabelstwo = kidshorttwo.map(entry => entry.time);
    let timeCountstwo = kidshorttwo.map(entry => entry.count);

    setTwobarone(timeCountstwo)


  }


  function timeDifference(startTime, endTime) {

    console.log(endTime)

    if (!endTime) {
      return
    }


    // Extract the "S" event using regex
    const match = endTime?.match(/\b(\d{4})S\d\b/);

    if (match) {
      const time = match[1]; // Extract the 4-digit time (e.g., "1500")
      const formattedTime = `${time.slice(0, 2)}:${time.slice(2)}`; // Convert to HH:mm

      // console.log(formattedTime); // Output: "15:00"



      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = formattedTime.split(":").map(Number);

      let diffHours = endHour - startHour;
      let diffMinutes = endMinute - startMinute;

      if (diffMinutes < 0) {
        diffMinutes += 60;
        diffHours -= 1;
      }

      return `${diffHours}:${diffMinutes.toString().padStart(2, "0")}`;
    }


  }

  let callfordataone = (one) => {


    function processData(data) {
      let result = [];
      let processTimes = [];

      Object.entries(data).forEach(([dateKey, orders]) => {
        orders.forEach(order => {
          const date = dateKey.split(") ")[1]; // Extract the date from the key
          const stampParts = order.STAMP.split(" ");
          const extractedDate = stampParts[0].substring(0, 8); // Get the first 8 characters for the date
          const formattedDate = `${extractedDate.substring(0, 4)}-${extractedDate.substring(4, 6)}-${extractedDate.substring(6, 8)}`;

          const timeEntries = stampParts.slice(1).filter(entry => /R\d/.test(entry)); // Filter only R0, R1, etc.
          if (timeEntries.length >= 2) {
            const startTime = timeEntries[0].replace(/[A-Z]\d/, ''); // Remove R0, R1
            const endTime = timeEntries[timeEntries.length - 1].replace(/[A-Z]\d/, '');

            const startTimeFormatted = `${startTime.substring(0, 2)}:${startTime.substring(2, 4)}`;
            const endTimeFormatted = `${endTime.substring(0, 2)}:${endTime.substring(2, 4)}`;

            const start = new Date(`2000-01-01T${startTimeFormatted}:00`);
            const end = new Date(`2000-01-01T${endTimeFormatted}:00`);
            const processTime = Math.round((end - start) / 60000); // Convert milliseconds to minutes


            if (processTime < 2) {

            } else {
              processTimes.push(processTime);

              result.push({
                date: formattedDate,
                processtime: processTime, // Store as a number for sorting
                table: `T${order.TABLE}`,
                starttime: `@${startTimeFormatted}`,
                staff: order.STAFF,
                order: order
              });
            }



            // Calculate processing time

          }
        });
      });

      // Sort orders by process time (high to low)
      result.sort((a, b) => b.processtime - a.processtime);

      // Convert process time back to string format for display
      result = result.map(order => ({
        ...order,
        processtime: `${order.processtime}min`
      }));

      // Calculate average, min, and max processing time
      if (processTimes.length > 0) {
        const totalTime = processTimes.reduce((sum, time) => sum + time, 0);
        const averageTime = Math.round(totalTime / processTimes.length);
        const minTime = Math.min(...processTimes);
        const maxTime = Math.max(...processTimes);

        return {
          orders: result,
          stats: {
            averageProcessTime: `${averageTime}min`,
            minProcessTime: `${minTime}min`,
            maxProcessTime: `${maxTime}min`
          }
        };
      }

      return { orders: result, stats: null };
    }


    let newalldata = processData(one)

    console.log(newalldata, 'newalldatanewalldatanewalldatanewalldata')
    setEditall(newalldata)

    // console.log( JSON.stringify( alltype) , 'oneone') 

    // if(alltype.length === 0 ){

    // }else{

    // }


    // const categorizeItems = (datasssssss) => {
    //   const edited = ["2", "12", "22", "32"];
    //   const moved = ["3", "13", "23", "33"];
    //   const deleted = ["4", "24"];

    //   const result = {
    //     edited: [],
    //     moved: [],
    //     deleted: [],
    //     served: [],
    //     tableMoved: []
    //   };

    //   for (const [date, entries] of Object.entries(datasssssss)) {


    //     entries.forEach(entry => {


    //       if (entry.NOTE && entry.NOTE.includes("$ND$")) {
    //         result.tableMoved.push(entry);
    //       }


    //       entry.ITEMS.forEach(item => {
    //         if (edited.includes(item.STATUS)) {
    //           result.edited.push(item);
    //         } else if (moved.includes(item.STATUS)) {
    //           result.moved.push(item);
    //         } else if (deleted.includes(item.STATUS)) {
    //           result.deleted.push(item);
    //         } else if (parseInt(item.STATUS) > 20) {
    //           result.served.push(item);
    //         }
    //       });
    //     });

    //   }

    //   return result;
    // };

    // let editttsone = categorizeItems(one)
    // // let editttstwo = categorizeItems(two)

    // console.log(editttsone, 'editttsoneeditttsone')


    // setEditall(editttsone)
    // // setEditallone(editttstwo)

    // const processItems = (data) => {
    //   const dishCounts = {};

    //   // Iterate through the data to collect and process dishes
    //   for (const [date, entries] of Object.entries(data)) {



    //     entries.forEach(entry => {
    //       entry.ITEMS.forEach(item => {
    //         // Remove "Sp\\" prefix if present
    //         const cleanItemName = item.ITEM.replace(/^Sp\\\s*/, "");

    //         // If dish is already counted, increment its count and append data
    //         if (dishCounts[cleanItemName]) {
    //           dishCounts[cleanItemName].count += parseInt(item.QUANTITY, 10);
    //           dishCounts[cleanItemName].data.push(item);
    //         } else {
    //           // If not, initialize a new entry for the dish
    //           dishCounts[cleanItemName] = {
    //             count: parseInt(item.QUANTITY, 10),
    //             name: cleanItemName,
    //             data: [item],
    //           };
    //         }
    //       });
    //     });
    //   }

    //   // Convert the dishCounts object to an array
    //   return Object.values(dishCounts).sort((a, b) => b.count - a.count);
    // };


    // let minnscount = processItems(one)
    // // let maxnscount = processItems(two)
    // setServed(minnscount)
    // // setServedone(maxnscount)

    // const processRefundedItems = (data) => {
    //   const results = [];

    //   // Iterate through each date's data
    //   for (const [date, entries] of Object.entries(data)) {
    //     let refundedItems = [];



    //     entries.forEach(entry => {
    //       entry.ITEMS.forEach(item => {
    //         // Check if "Refunded" exists in the ITEM field
    //         if (item?.NOTE?.includes("Refunded")) {
    //           refundedItems.push(item);
    //         }
    //       });
    //     });

    //     if (refundedItems.length > 0) {
    //       // Calculate the total quantity for refunded items
    //       const totalQuantity = refundedItems.reduce(
    //         (sum, item) => sum + parseInt(item.QUANTITY, 10),
    //         0
    //       );

    //       results.push({
    //         date,
    //         count: totalQuantity,
    //         name: refundedItems[0].NOTE, // Assuming all refunded items share the same name
    //         data: refundedItems,
    //       });
    //     }
    //   }

    //   return results;
    // };

    // let refundcount = processRefundedItems(one)
    // // let refundcounttwo = processRefundedItems(two)
    // setMinperday(refundcount)
    // console.log(refundcount ,'refundcountrefundcountrefundcount')
    // // setMaxperday(refundcounttwo)




  }

  let callfordataonetwo = (two) => {


    function processData(data) {
      let result = [];
      let processTimes = [];

      Object.entries(data).forEach(([dateKey, orders]) => {
        orders.forEach(order => {
          const date = dateKey.split(") ")[1]; // Extract the date from the key
          const stampParts = order.STAMP.split(" ");
          const extractedDate = stampParts[0].substring(0, 8); // Get the first 8 characters for the date
          const formattedDate = `${extractedDate.substring(0, 4)}-${extractedDate.substring(4, 6)}-${extractedDate.substring(6, 8)}`;

          const timeEntries = stampParts.slice(1).filter(entry => /R\d/.test(entry)); // Filter only R0, R1, etc.
          if (timeEntries.length >= 2) {
            const startTime = timeEntries[0].replace(/[A-Z]\d/, ''); // Remove R0, R1
            const endTime = timeEntries[timeEntries.length - 1].replace(/[A-Z]\d/, '');

            const startTimeFormatted = `${startTime.substring(0, 2)}:${startTime.substring(2, 4)}`;
            const endTimeFormatted = `${endTime.substring(0, 2)}:${endTime.substring(2, 4)}`;

            // Calculate processing time
            const start = new Date(`2000-01-01T${startTimeFormatted}:00`);
            const end = new Date(`2000-01-01T${endTimeFormatted}:00`);
            const processTime = Math.round((end - start) / 60000); // Convert milliseconds to minutes

            console.log(processTime, 'processTime  processTime ')

            // if( )
            if (processTime < 2) {
              processTimes.push(processTime);

              result.push({
                date: formattedDate,
                processtime: processTime, // Store as a number for sorting
                table: `T${order.TABLE}`,
                starttime: `@${startTimeFormatted}`,
                staff: order.STAFF,
                order: order
              });
            } else {
              processTimes.push(processTime);

              result.push({
                date: formattedDate,
                processtime: processTime, // Store as a number for sorting
                table: `T${order.TABLE}`,
                starttime: `@${startTimeFormatted}`,
                staff: order.STAFF,
                order: order
              });
            }


          }
        });
      });

      // Sort orders by process time (high to low)
      result.sort((a, b) => b.processtime - a.processtime);

      // Convert process time back to string format for display
      result = result.map(order => ({
        ...order,
        processtime: `${order.processtime}min`
      }));

      // Calculate average, min, and max processing time
      if (processTimes.length > 0) {
        const totalTime = processTimes.reduce((sum, time) => sum + time, 0);
        const averageTime = Math.round(totalTime / processTimes.length);
        const minTime = Math.min(...processTimes);
        const maxTime = Math.max(...processTimes);

        return {
          orders: result,
          stats: {
            averageProcessTime: `${averageTime}min`,
            minProcessTime: `${minTime}min`,
            maxProcessTime: `${maxTime}min`
          }
        };
      }

      return { orders: result, stats: null };
    }


    let newalldata = processData(two)

    console.log(newalldata, 'newalldatanewalldatanewalldatanewalldata')
    setEditallone(newalldata)

    // const categorizeItems = (datasssssss) => {
    //   const edited = ["2", "12", "22", "32"];
    //   const moved = ["3", "13", "23", "33"];
    //   const deleted = ["4", "24"];

    //   const result = {
    //     edited: [],
    //     moved: [],
    //     deleted: [],
    //     served: [],
    //     tableMoved: []
    //   };

    //   for (const [date, entries] of Object.entries(datasssssss)) {


    //     entries.forEach(entry => {


    //       if (entry.NOTE && entry.NOTE.includes("$ND$")) {
    //         result.tableMoved.push(entry);
    //       }


    //       entry.ITEMS.forEach(item => {
    //         if (edited.includes(item.STATUS)) {
    //           result.edited.push(item);
    //         } else if (moved.includes(item.STATUS)) {
    //           result.moved.push(item);
    //         } else if (deleted.includes(item.STATUS)) {
    //           result.deleted.push(item);
    //         } else if (parseInt(item.STATUS) > 20) {
    //           result.served.push(item);
    //         }
    //       });
    //     });

    //   }

    //   return result;
    // };

    // // let editttsone = categorizeItems(one)
    // let editttstwo = categorizeItems(two)

    // // console.log(editttsone, 'editttsoneeditttsone')


    // // setEditall(editttsone)
    // setEditallone(editttstwo)

    // const processItems = (data) => {
    //   const dishCounts = {};

    //   // Iterate through the data to collect and process dishes
    //   for (const [date, entries] of Object.entries(data)) {



    //     entries.forEach(entry => {
    //       entry.ITEMS.forEach(item => {
    //         // Remove "Sp\\" prefix if present
    //         const cleanItemName = item.ITEM.replace(/^Sp\\\s*/, "");

    //         // If dish is already counted, increment its count and append data
    //         if (dishCounts[cleanItemName]) {
    //           dishCounts[cleanItemName].count += parseInt(item.QUANTITY, 10);
    //           dishCounts[cleanItemName].data.push(item);
    //         } else {
    //           // If not, initialize a new entry for the dish
    //           dishCounts[cleanItemName] = {
    //             count: parseInt(item.QUANTITY, 10),
    //             name: cleanItemName,
    //             data: [item],
    //           };
    //         }
    //       });
    //     });
    //   }

    //   // Convert the dishCounts object to an array
    //   return Object.values(dishCounts).sort((a, b) => b.count - a.count);
    // };


    // // let minnscount = processItems(one)
    // let maxnscount = processItems(two)
    // // setServed(minnscount)
    // setServedone(maxnscount)

    // const processRefundedItems = (data) => {
    //   const results = [];

    //   // Iterate through each date's data
    //   for (const [date, entries] of Object.entries(data)) {
    //     let refundedItems = [];



    //     entries.forEach(entry => {
    //       entry.ITEMS.forEach(item => {
    //         // Check if "Refunded" exists in the ITEM field
    //         if (item.NOTE.includes("Refunded")) {
    //           refundedItems.push(item);
    //         }
    //       });
    //     });

    //     if (refundedItems.length > 0) {
    //       // Calculate the total quantity for refunded items
    //       const totalQuantity = refundedItems.reduce(
    //         (sum, item) => sum + parseInt(item.QUANTITY, 10),
    //         0
    //       );

    //       results.push({
    //         date,
    //         count: totalQuantity,
    //         name: refundedItems[0].NOTE, // Assuming all refunded items share the same name
    //         data: refundedItems,
    //       });
    //     }
    //   }

    //   return results;
    // };

    // // let refundcount = processRefundedItems(one)
    // let refundcounttwo = processRefundedItems(two)
    // // setMinperday(refundcount)
    // setMaxperday(refundcounttwo)




  }


  let callfordataonesearch = (one, bitedata) => {

    console.log(one, bitedata, 'one, bitedataone, bitedataone, bitedataone, bitedataone, bitedata')

    function processData(data) {
      let result = [];
      let processTimes = [];

      Object.entries(data).forEach(([dateKey, orders]) => {
        orders.forEach(order => {
          const date = dateKey.split(") ")[1]; // Extract the date from the key
          const stampParts = order.STAMP.split(" ");
          const extractedDate = stampParts[0].substring(0, 8); // Get the first 8 characters for the date
          const formattedDate = `${extractedDate.substring(0, 4)}-${extractedDate.substring(4, 6)}-${extractedDate.substring(6, 8)}`;

          const timeEntries = stampParts.slice(1).filter(entry => /R\d/.test(entry)); // Filter only R0, R1, etc.
          if (timeEntries.length >= 2) {
            const startTime = timeEntries[0].replace(/[A-Z]\d/, ''); // Remove R0, R1
            const endTime = timeEntries[timeEntries.length - 1].replace(/[A-Z]\d/, '');

            const startTimeFormatted = `${startTime.substring(0, 2)}:${startTime.substring(2, 4)}`;
            const endTimeFormatted = `${endTime.substring(0, 2)}:${endTime.substring(2, 4)}`;

            const start = new Date(`2000-01-01T${startTimeFormatted}:00`);
            const end = new Date(`2000-01-01T${endTimeFormatted}:00`);
            const processTime = Math.round((end - start) / 60000); // Convert milliseconds to minutes

            const regex = new RegExp(bitedata, "i"); // "i" makes it case-insensitive
            const isMatch = regex.test(order.DOCKETID);



            if (isMatch) {

              processTimes.push(processTime);

              result.push({
                date: formattedDate,
                processtime: processTime, // Store as a number for sorting
                table: `T${order.TABLE}`,
                starttime: `@${startTimeFormatted}`,
                staff: order.STAFF,
                order: order
              });


            } else {

            }



            // Calculate processing time

          }
        });
      });

      // Sort orders by process time (high to low)
      result.sort((a, b) => b.processtime - a.processtime);

      // Convert process time back to string format for display
      result = result.map(order => ({
        ...order,
        processtime: `${order.processtime}min`
      }));

      // Calculate average, min, and max processing time
      if (processTimes.length > 0) {
        const totalTime = processTimes.reduce((sum, time) => sum + time, 0);
        const averageTime = Math.round(totalTime / processTimes.length);
        const minTime = Math.min(...processTimes);
        const maxTime = Math.max(...processTimes);

        return {
          orders: result,
          stats: {
            averageProcessTime: `${averageTime}min`,
            minProcessTime: `${minTime}min`,
            maxProcessTime: `${maxTime}min`
          }
        };
      }

      return { orders: result, stats: null };
    }


    let newalldata = processData(one)

    console.log(newalldata, 'newalldatanewalldatanewalldatanewalldata')
    setEditall(newalldata)



  }

  let callfordataonetwosearch = (two, bitedata) => {


    function processData(data) {
      let result = [];
      let processTimes = [];

      Object.entries(data).forEach(([dateKey, orders]) => {
        orders.forEach(order => {
          const date = dateKey.split(") ")[1]; // Extract the date from the key
          const stampParts = order.STAMP.split(" ");
          const extractedDate = stampParts[0].substring(0, 8); // Get the first 8 characters for the date
          const formattedDate = `${extractedDate.substring(0, 4)}-${extractedDate.substring(4, 6)}-${extractedDate.substring(6, 8)}`;

          const timeEntries = stampParts.slice(1).filter(entry => /R\d/.test(entry)); // Filter only R0, R1, etc.
          if (timeEntries.length >= 2) {
            const startTime = timeEntries[0].replace(/[A-Z]\d/, ''); // Remove R0, R1
            const endTime = timeEntries[timeEntries.length - 1].replace(/[A-Z]\d/, '');

            const startTimeFormatted = `${startTime.substring(0, 2)}:${startTime.substring(2, 4)}`;
            const endTimeFormatted = `${endTime.substring(0, 2)}:${endTime.substring(2, 4)}`;

            const start = new Date(`2000-01-01T${startTimeFormatted}:00`);
            const end = new Date(`2000-01-01T${endTimeFormatted}:00`);
            const processTime = Math.round((end - start) / 60000); // Convert milliseconds to minutes


            console.log(processTime, 'processTimeprocessTimeprocessTimeprocessTime')
            const regex = new RegExp(bitedata, "i"); // "i" makes it case-insensitive
            const isMatch = regex.test(order.DOCKETID);



            if (isMatch) {
              processTimes.push(processTime);

              result.push({
                date: formattedDate,
                processtime: processTime, // Store as a number for sorting
                table: `T${order.TABLE}`,
                starttime: `@${startTimeFormatted}`,
                staff: order.STAFF,
                order: order
              });
            } else {

            }



            // Calculate processing time

          }
        });
      });

      // Sort orders by process time (high to low)
      result.sort((a, b) => b.processtime - a.processtime);

      // Convert process time back to string format for display
      result = result.map(order => ({
        ...order,
        processtime: `${order.processtime}min`
      }));

      // Calculate average, min, and max processing time
      if (processTimes.length > 0) {
        const totalTime = processTimes.reduce((sum, time) => sum + time, 0);
        const averageTime = Math.round(totalTime / processTimes.length);
        const minTime = Math.min(...processTimes);
        const maxTime = Math.max(...processTimes);

        return {
          orders: result,
          stats: {
            averageProcessTime: `${averageTime}min`,
            minProcessTime: `${minTime}min`,
            maxProcessTime: `${maxTime}min`
          }
        };
      }

      return { orders: result, stats: null };
    }



    let newalldata = processData(two)

    console.log(newalldata, 'newalldatanewalldatanewalldatanewalldata')
    setEditallone(newalldata)

    // const categorizeItems = (datasssssss) => {
    //   const edited = ["2", "12", "22", "32"];
    //   const moved = ["3", "13", "23", "33"];
    //   const deleted = ["4", "24"];

    //   const result = {
    //     edited: [],
    //     moved: [],
    //     deleted: [],
    //     served: [],
    //     tableMoved: []
    //   };

    //   for (const [date, entries] of Object.entries(datasssssss)) {


    //     entries.forEach(entry => {


    //       if (entry.NOTE && entry.NOTE.includes("$ND$")) {
    //         result.tableMoved.push(entry);
    //       }


    //       entry.ITEMS.forEach(item => {
    //         if (edited.includes(item.STATUS)) {
    //           result.edited.push(item);
    //         } else if (moved.includes(item.STATUS)) {
    //           result.moved.push(item);
    //         } else if (deleted.includes(item.STATUS)) {
    //           result.deleted.push(item);
    //         } else if (parseInt(item.STATUS) > 20) {
    //           result.served.push(item);
    //         }
    //       });
    //     });

    //   }

    //   return result;
    // };

    // // let editttsone = categorizeItems(one)
    // let editttstwo = categorizeItems(two)

    // // console.log(editttsone, 'editttsoneeditttsone')


    // // setEditall(editttsone)
    // setEditallone(editttstwo)

    // const processItems = (data) => {
    //   const dishCounts = {};

    //   // Iterate through the data to collect and process dishes
    //   for (const [date, entries] of Object.entries(data)) {



    //     entries.forEach(entry => {
    //       entry.ITEMS.forEach(item => {
    //         // Remove "Sp\\" prefix if present
    //         const cleanItemName = item.ITEM.replace(/^Sp\\\s*/, "");

    //         // If dish is already counted, increment its count and append data
    //         if (dishCounts[cleanItemName]) {
    //           dishCounts[cleanItemName].count += parseInt(item.QUANTITY, 10);
    //           dishCounts[cleanItemName].data.push(item);
    //         } else {
    //           // If not, initialize a new entry for the dish
    //           dishCounts[cleanItemName] = {
    //             count: parseInt(item.QUANTITY, 10),
    //             name: cleanItemName,
    //             data: [item],
    //           };
    //         }
    //       });
    //     });
    //   }

    //   // Convert the dishCounts object to an array
    //   return Object.values(dishCounts).sort((a, b) => b.count - a.count);
    // };


    // // let minnscount = processItems(one)
    // let maxnscount = processItems(two)
    // // setServed(minnscount)
    // setServedone(maxnscount)

    // const processRefundedItems = (data) => {
    //   const results = [];

    //   // Iterate through each date's data
    //   for (const [date, entries] of Object.entries(data)) {
    //     let refundedItems = [];



    //     entries.forEach(entry => {
    //       entry.ITEMS.forEach(item => {
    //         // Check if "Refunded" exists in the ITEM field
    //         if (item.NOTE.includes("Refunded")) {
    //           refundedItems.push(item);
    //         }
    //       });
    //     });

    //     if (refundedItems.length > 0) {
    //       // Calculate the total quantity for refunded items
    //       const totalQuantity = refundedItems.reduce(
    //         (sum, item) => sum + parseInt(item.QUANTITY, 10),
    //         0
    //       );

    //       results.push({
    //         date,
    //         count: totalQuantity,
    //         name: refundedItems[0].NOTE, // Assuming all refunded items share the same name
    //         data: refundedItems,
    //       });
    //     }
    //   }

    //   return results;
    // };

    // // let refundcount = processRefundedItems(one)
    // let refundcounttwo = processRefundedItems(two)
    // // setMinperday(refundcount)
    // setMaxperday(refundcounttwo)




  }


  let ggggrtsg = () => {
    let kkki = 0
    minperday?.map((reee) => {

      kkki = kkki + reee.count
    })

    return kkki
  }

  let ggggrtsgg = () => {
    let kkki = 0
    maxperday?.map((reee) => {

      kkki = kkki + reee.count
    })

    return kkki
  }

  let checkkkk = () => {

    //one
    console.log(editall, '1')
    console.log(served, '2')
    console.log(minperday, '3')

    //two
    console.log(editallone, '4')
    console.log(servedone, '5')
    console.log(maxperday, '6')

  }


  let searchvalue = (e) => {
    console.log(editall, 'searchvaluesearchvaluesearchvalue')

    if (e === undefined || e === '' || e === null) {
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, onetime, twotime, selectedOptionsfive, hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
      return
    } else {
      callfordataonesearch(filterdataone, e)
      callfordataonetwosearch(filterdatatwo, e)
    }

  }



  const chartContainerRef = useRef(null);
  const finefine = useRef(null);

  // Function to scroll left
  const scrollLeft = () => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft -= 100; // Adjust scroll distance
    }
  };

  // Function to scroll right
  const scrollRight = () => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft += 100;
    }
  };

  const scrollLeftfine = () => {
    if (finefine.current) {
      finefine.current.scrollLeft -= 100; // Adjust scroll distance
    }
  };

  // Function to scroll right
  const scrollRightfine = () => {
    if (finefine.current) {
      finefine.current.scrollLeft += 100;
    }
  };


  const [showDiv, setShowDiv] = useState(false);
  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Toggle the visibility of the div
  const handleToggleDiv = (e) => {
    e.stopPropagation();
    setShowDiv(!showDiv);
  };


  const [showDivs, setShowDivs] = useState(false);

  const dropdownRefs = useRef(null);
  const toggleButtonRefs = useRef(null);
  // Toggle the visibility of the div
  const fsgdgfdfgdf = () => {
    console.log('gggggggggggggggggggggg')
    setShowDivs(!showDivs);

  };


  const [showDivss, setShowDivss] = useState(false);
  const dropdownRefss = useRef(null);
  const toggleButtonRefss = useRef(null);
  // Toggle the visibility of the div
  const handleToggleDivss = (e) => {
    e.stopPropagation();
    setShowDivss(!showDivss);
  };


  const [showDivsss, setShowDivsss] = useState(false);
  const dropdownRefsss = useRef(null);
  const toggleButtonRefsss = useRef(null);
  // Toggle the visibility of the div
  const handleToggleDivsss = (e) => {
    e.stopPropagation();
    setShowDivsss(!showDivsss);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // List of all dropdown refs and their corresponding toggle button refs
      const dropdowns = [
        { content: dropdownRef, toggle: toggleButtonRef, isOpen: showDiv },
        { content: dropdownRefs, toggle: toggleButtonRefs, isOpen: showDivs },
        { content: dropdownRefss, toggle: toggleButtonRefss, isOpen: showDivss },
        { content: dropdownRefsss, toggle: toggleButtonRefsss, isOpen: showDivsss },
      ];

      // Check if click is outside ALL dropdown contents AND toggle buttons
      const clickedOutside = dropdowns.every(({ content, toggle, isOpen }) => {
        return !isOpen || (
          (!content.current || !content.current.contains(event.target)) &&
          (!toggle.current || !toggle.current.contains(event.target))
        );
      });

      if (clickedOutside) {
        // Close all dropdowns
        setShowDiv(false);
        setShowDivs(false);
        setShowDivss(false);
        setShowDivsss(false);
      }
    };

    // Add listener if ANY dropdown is open
    if (showDiv || showDivs || showDivss || showDivsss) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDiv, showDivs, showDivss, showDivsss]);
  let editexportpdf = async () => {

    const input = pdfRef.current;



    // html2canvas(input, { scale: 2 }).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const imgWidth = 210; // A4 width in mm
    //   const pageHeight = 297; // A4 height in mm
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;
    //   let position = 0;

    //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft > 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   pdf.save("download.pdf");

    // });

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    await doc.html(input, {
      callback: function (doc) {
        doc.save("Dockets Completion.pdf"); // Save after rendering
        setIsPdfLoad(false)
      },
      y: 10,
           width: 190, // Fit content within page
           windowWidth: 1000, // Ensure full width capture  
           margin: 10,
           
           autoPaging: "text",
           html2canvas: {
             useCORS: true, // Handle cross-origin images
           },
    }).catch(() => {
      setIsPdfLoad(false);
    });




    // var doc = new  jsPDF({
    //   orientation: 'p',
    //   unit: 'pt',
    //   format: 'letter'
    // });


    // var field = input;
    // doc.text(10, 10, "test");
    // //add first html
    // await doc.html(field, {
    //   callback: function (doc) {
    //     return doc;
    //   },
    //   width: 210,
    //   windowWidth: 210, 
    //       html2canvas: {
    //           backgroundColor: 'lightyellow',
    //           width: 210, 
    //           height: 150
    //       },
    //       backgroundColor: 'lightblue', 
    //   x: 10,
    //   y: 50,
    //   autoPaging: 'text'
    // });

    // doc.save("download.pdf");
    // window.open(doc.output('bloburl'));


  }

  let mealexportpdf = () => {

    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text('Hello, this is a sample PDF created with jsPDF!', 10, 10);

    // Optionally, you can add other content like images, tables, etc.
    // doc.addImage(imageData, 'JPEG', 10, 20, 180, 160);
    // doc.autoTable({ html: '#my-table' });

    // Save the PDF with a filename
    doc.save('sample.pdf');
    setIsPdfLoad(false)

    console.log('gggggggggggggggggggg')

  }

  let chartexportpdf = async () => {

    const input = pdfRefred.current;



    // html2canvas(input, { scale: 2 }).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const imgWidth = 210; // A4 width in mm
    //   const pageHeight = 297; // A4 height in mm
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;
    //   let position = 0;

    //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft > 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   pdf.save("download.pdf");

    // });

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    await doc.html(input, {
      callback: function (doc) {
        doc.save("Dockets received - timeline.pdf"); // Save after rendering
        setIsPdfLoad(false)
      },
      x: 10,
      y: 20,
      width: 190, // Fit content within page
      windowWidth: 1600, // Ensure full width capture
      autoPaging: "text",
      html2canvas: {
        useCORS: true, // Handle cross-origin images
      },
    }).catch(() => {
      setIsPdfLoad(false);
    });



    // var doc = new  jsPDF({
    //   orientation: 'p',
    //   unit: 'pt',
    //   format: 'letter'
    // });


    // var field = input;
    // doc.text(10, 10, "test");
    // //add first html
    // await doc.html(field, {
    //   callback: function (doc) {
    //     return doc;
    //   },
    //   width: 210,
    //   windowWidth: 210, 
    //       html2canvas: {
    //           backgroundColor: 'lightyellow',
    //           width: 210, 
    //           height: 150
    //       },
    //       backgroundColor: 'lightblue', 
    //   x: 10,
    //   y: 50,
    //   autoPaging: 'text'
    // });

    // doc.save("download.pdf");
    // window.open(doc.output('bloburl'));


  }

  let refundexportpdf = async () => {
    const input = pdfRefredone.current;



    // html2canvas(input, { scale: 2 }).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF("p", "mm", "a4");
    //   const imgWidth = 210; // A4 width in mm
    //   const pageHeight = 297; // A4 height in mm
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   let heightLeft = imgHeight;
    //   let position = 0;

    //   pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft > 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   pdf.save("download.pdf");

    // });

    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    await doc.html(input, {
      callback: function (doc) {
        doc.save("Dockets received - timeline.pdf");
        setIsPdfLoad(false); // Save after rendering
      },
      x: 10,
      y: 20,
      width: 190, // Fit content within page
      windowWidth: 1600, // Ensure full width capture
      autoPaging: "text",
      html2canvas: {
        useCORS: true, // Handle cross-origin images
      },
    }).catch(() => {
      setIsPdfLoad(false);
    });

  }


  // Function 1: downloadDocketsavgExcel with added styling
  const downloadDocketsavgExcel = async () => {
    const selectedVenue = selectedOptions
      .filter(item => item.label !== "All Venue")
      .map(item => item.label)
      .join(", ") || "All Venue";

    const selectedHub = selectedhubOptions
      .filter(item => item.label !== "All Hub")
      .map(item => item.label)
      .join(", ") || "All Hub";

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    };

    const chosenRange = `${formatDate(dateRange[0])} to ${formatDate(dateRange[1])} between ${onetime || "00:00"} to ${twotime || "24:00"}`;
    const comparingRange = `${formatDate(dateRangetwo[0])} to ${formatDate(dateRangetwo[1])} between ${threetime || "00:00"} to ${fourtime || "24:00"}`;

    const selectedStages = selectedhubOptions.length > 0
      ? selectedhubOptions.map(item => item.label).join(", ")
      : "All";

    const tableRanges = `From ${inputvalue}; \n to ${inputvaluetwo}`;

    const selectedCourses = selectedCources.length > 0
      ? selectedCources.map(item => item.label).join(", ")
      : "All";

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Meals Received Timeline");

    // Define styles (added from original function)
    const headerStyle = {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF316AAF" } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };

    const alternatingRowStyle1 = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
    };

    const alternatingRowStyle2 = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F0FF" } }
    };

    const titleStyle = {
      font: { bold: true, size: 14, color: { argb: "FF316AAF" } }
    };

    // Define border style
    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // **Add Filters Section**
    const filtersRow = worksheet.addRow(["Filters:"]);
    filtersRow.font = titleStyle.font;

    worksheet.addRow([`Venue: ${selectedVenue}`, `Stages: ${selectedStages}`, "Table Ranges:", tableRanges]);
    worksheet.addRow(["", `Hub: ${selectedHub}`, `Courses: ${selectedCourses}`, ""]);
    worksheet.addRow(["", "", `Chosen range:\n${chosenRange}`, `Comparing range:\n${comparingRange}`]);
    worksheet.addRow([]); // Empty row for spacing

    // **Add Table Headers**
    const headerRow = worksheet.addRow(["From - To", "From - To", "From - To"]);
    headerRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) { // Only for the table columns
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
        cell.border = borderStyle;
      }
    });

    // **Add Table Data with alternating colors and borders**
    optionbar.forEach((time, index) => {
      const dataRow = worksheet.addRow([time, onebar[index] ?? "-", twobar[index] ?? "-"]);

      // Apply alternating row styles and borders
      dataRow.eachCell((cell, colNumber) => {
        if (colNumber <= 3) { // Only for the table columns
          if (index % 2 === 0) {
            cell.fill = alternatingRowStyle1.fill;
          } else {
            cell.fill = alternatingRowStyle2.fill;
          }
          cell.alignment = { horizontal: 'center' };
          cell.border = borderStyle;
        }
      });
    });

    // **Set Column Widths**
    worksheet.columns = [
      { width: 15 },
      { width: 20 },
      { width: 25 }
    ];

    // **Capture and Insert Chart Image**
    const chartElement = document.getElementById("AvgChart-capture");

    if (chartElement) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure rendering completion

      const canvas = await html2canvas(chartElement, {
        backgroundColor: "#fff", // Ensure a white background
        useCORS: true, // Fix cross-origin issues
        scale: 10, // Higher quality capture
      });

      const imageData = canvas.toDataURL("image/png");

      // Add Image to Workbook
      const imageId = workbook.addImage({
        base64: imageData,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 4, row: 4 }, // Position it properly
        ext: { width: 1000, height: 250 }, // Adjust as needed
      });
    }

    // **Generate and Download the Excel File**
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "MultiDockets_Average_Timeline.xlsx");
    setIsExcelLoad(false)
  };

  // Function 2: downloadDocketsrecExcel with added styling
  const downloadDocketsrecExcel = async () => {
    const selectedVenue = selectedOptions
      .filter(item => item.label !== "All Venue")
      .map(item => item.label)
      .join(", ") || "All Venue";

    const selectedHub = selectedhubOptions
      .filter(item => item.label !== "All Hub")
      .map(item => item.label)
      .join(", ") || "All Hub";

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    };

    const chosenRange = `${formatDate(dateRange[0])} to ${formatDate(dateRange[1])} between ${onetime || "00:00"} to ${twotime || "24:00"}`;
    const comparingRange = `${formatDate(dateRangetwo[0])} to ${formatDate(dateRangetwo[1])} between ${threetime || "00:00"} to ${fourtime || "24:00"}`;

    const selectedStages = selectedhubOptions.length > 0
      ? selectedhubOptions.map(item => item.label).join(", ")
      : "All";

    const tableRanges = `From ${inputvalue}; \n to ${inputvaluetwo}`;

    const selectedCourses = selectedCources.length > 0
      ? selectedCources.map(item => item.label).join(", ")
      : "All";

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Meals Received Timeline");

    // Define styles (added from original function)
    const headerStyle = {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF316AAF" } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };

    const alternatingRowStyle1 = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
    };

    const alternatingRowStyle2 = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F0FF" } }
    };

    const titleStyle = {
      font: { bold: true, size: 14, color: { argb: "FF316AAF" } }
    };

    // Define border style
    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // **Add Filters Section**
    const filtersRow = worksheet.addRow(["Filters:"]);
    filtersRow.font = titleStyle.font;

    worksheet.addRow([`Venue: ${selectedVenue}`, `Stages: ${selectedStages}`, "Table Ranges:", tableRanges]);
    worksheet.addRow(["", `Hub: ${selectedHub}`, `Courses: ${selectedCourses}`, ""]);
    worksheet.addRow(["", "", `Chosen range:\n${chosenRange}`, `Comparing range:\n${comparingRange}`]);
    worksheet.addRow([]); // Empty row for spacing

    // **Add Table Headers**
    const headerRow = worksheet.addRow(["From - To", "From - To", "From - To"]);
    headerRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) { // Only for the table columns
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
        cell.border = borderStyle;
      }
    });

    // **Add Table Data with alternating colors and borders**
    optionbar.forEach((time, index) => {
      const dataRow = worksheet.addRow([time, onebar[index] ?? "-", twobar[index] ?? "-"]);

      // Apply alternating row styles and borders
      dataRow.eachCell((cell, colNumber) => {
        if (colNumber <= 3) { // Only for the table columns
          if (index % 2 === 0) {
            cell.fill = alternatingRowStyle1.fill;
          } else {
            cell.fill = alternatingRowStyle2.fill;
          }
          cell.alignment = { horizontal: 'center' };
          cell.border = borderStyle;
        }
      });
    });

    // **Set Column Widths**
    worksheet.columns = [
      { width: 15 },
      { width: 20 },
      { width: 25 }
    ];

    // **Capture and Insert Chart Image**
    const chartElement = document.getElementById("docChart-capture");

    if (chartElement) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure rendering completion

      const canvas = await html2canvas(chartElement, {
        backgroundColor: "#fff", // Ensure a white background
        useCORS: true, // Fix cross-origin issues
        scale: 10, // Higher quality capture
      });

      const imageData = canvas.toDataURL("image/png");

      // Add Image to Workbook
      const imageId = workbook.addImage({
        base64: imageData,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 4, row: 4 }, // Position it properly
        ext: { width: 1000, height: 250 }, // Adjust as needed
      });
    }

    // **Generate and Download the Excel File**
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "MultiDockets_Received_Timeline.xlsx");
    setIsExcelLoad(false)
  };

  const downloadDocketseditExcel = async () => {
    const data = editallone;
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Dockets Completion");

    // Define styles
    const headerStyle = {
      font: { bold: true, color: { argb: "FFFFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF316AAF" } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };

    const alternatingRowStyle1 = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFFFF" } }
    };

    const alternatingRowStyle2 = {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE6F0FF" } }
    };

    const titleStyle = {
      font: { bold: true, size: 14, color: { argb: "FF316AAF" } }
    };

    // Define border style
    const borderStyle = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Define the column for the second table to start
    const secondTableStartColumn = 6; // Starting from column F

    // Add Table 1 Headers
    const table1HeaderRow = worksheet.addRow([
      "Docket ID",
      "Time Created",
      "Time Served",
      "Waiting Time"
    ]);

    // Apply header style to Table 1 headers
    table1HeaderRow.eachCell((cell, colNumber) => {
      if (colNumber <= 4) { // Only for the first table columns
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
        cell.border = borderStyle;
      }
    });

    // Add Table 1 Data
    if (data.orders && data.orders.length > 0) {
      data.orders.forEach((order, index) => {
        // Extract docket ID
        const docketId = order.order?.DOCKETID || "-";

        // Extract time created from starttime (removing the @ symbol)
        const timeCreated = order.starttime ? order.starttime.replace('@', '') : "-";

        // Extract time served by parsing STAMP (if available)
        let timeServed = "-";
        if (order.order?.STAMP) {
          const stampParts = order.order.STAMP.split(' ');
          if (stampParts.length > 1) {
            // Find the part that ends with 'S0' (served)
            const servedStamp = stampParts.find(part => part.endsWith('S0'));
            if (servedStamp) {
              // Extract time from stamp (assuming format like "1233S0" where 12:33 is the time)
              timeServed = servedStamp.substring(0, 4).replace(/(\d{2})(\d{2})/, "$1:$2");
            }
          }
        }

        // Get processing time
        const waitingTime = order.processtime || "-";

        // Add data row
        const dataRow = worksheet.getRow(index + 2); // +2 because row 1 is header
        dataRow.getCell(1).value = docketId;
        dataRow.getCell(2).value = timeCreated;
        dataRow.getCell(3).value = timeServed;
        dataRow.getCell(4).value = waitingTime;

        // Apply alternating row styles and borders
        for (let i = 1; i <= 4; i++) {
          const cell = dataRow.getCell(i);
          if (index % 2 === 0) {
            cell.fill = alternatingRowStyle1.fill;
          } else {
            cell.fill = alternatingRowStyle2.fill;
          }
          cell.alignment = { horizontal: 'center' };
          cell.border = borderStyle;
        }

        dataRow.commit();
      });
    } else {
      const noDataRow = worksheet.getRow(2);
      noDataRow.getCell(1).value = "No docket data available";
      // Add borders
      for (let i = 1; i <= 4; i++) {
        noDataRow.getCell(i).border = borderStyle;
      }
      noDataRow.commit();
    }

    // Add a separator column
    worksheet.getColumn(5).width = 5;

    // Generate time intervals
    const timeIntervals = generateTimeIntervals(); // You'll need to implement this function

    // Add Table 2 Headers in the first row, starting at column F (6)
    const headers2 = ["From - To", "New Dockets Received", "Number of dockets served with a waiting time of more than 15 minutes"];

    headers2.forEach((header, index) => {
      const cell = table1HeaderRow.getCell(secondTableStartColumn + index);
      cell.value = header;
      cell.font = headerStyle.font;
      cell.fill = headerStyle.fill;
      cell.alignment = headerStyle.alignment;
      cell.border = borderStyle;
    });

    // Add Table 2 Data
    timeIntervals.forEach((interval, index) => {
      // Count dockets received in this time interval
      const docketsReceived = countDocketsInTimeInterval(data.orders, interval, 'received');

      // Count dockets served with waiting time > 15 min in this interval
      const longWaitDockets = countLongWaitingDockets(data.orders, interval);

      // Add row data to the right of the first table
      const rowNum = index + 2; // +2 because row 1 is header
      const dataRow = worksheet.getRow(rowNum);

      dataRow.getCell(secondTableStartColumn).value = interval;
      dataRow.getCell(secondTableStartColumn + 1).value = docketsReceived;
      dataRow.getCell(secondTableStartColumn + 2).value = longWaitDockets;

      // Apply alternating row styles and borders
      for (let i = secondTableStartColumn; i < secondTableStartColumn + 3; i++) {
        const cell = dataRow.getCell(i);
        if (index % 2 === 0) {
          cell.fill = alternatingRowStyle1.fill;
        } else {
          cell.fill = alternatingRowStyle2.fill;
        }
        cell.alignment = { horizontal: 'center' };
        cell.border = borderStyle;
      }

      dataRow.commit();
    });

    // Remove the section that was adding empty bordered cells to the second table
    // This ensures the second table only has borders up to its actual content

    // Set Column Widths
    worksheet.getColumn(1).width = 20;  // Column A
    worksheet.getColumn(2).width = 20;  // Column B
    worksheet.getColumn(3).width = 20;  // Column C
    worksheet.getColumn(4).width = 20;  // Column D
    // Column E is our separator
    worksheet.getColumn(secondTableStartColumn).width = 25;     // Column F
    worksheet.getColumn(secondTableStartColumn + 1).width = 25; // Column G
    worksheet.getColumn(secondTableStartColumn + 2).width = 45; // Column H

    // Generate and Download the Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "MultiDockets_completion_Report.xlsx");
    setIsExcelLoad(false)
  };

  // Helper function to generate time intervals
  const generateTimeIntervals = () => {
    // Generate hourly intervals from 8:00 to 23:00
    const intervals = [];
    for (let hour = 8; hour < 23; hour++) {
      const startHour = hour.toString().padStart(2, '0');
      const endHour = (hour + 1).toString().padStart(2, '0');
      intervals.push(`${startHour}:00 - ${endHour}:00`);
    }
    return intervals;
  };

  // Helper function to count dockets received in a specific time interval
  const countDocketsInTimeInterval = (orders, interval, type) => {
    if (!orders || orders.length === 0) return 0;

    // Parse interval string (e.g., "08:00 - 09:00")
    const [startTime, endTime] = interval.split(' - ');

    return orders.filter(order => {
      // Extract time from starttime
      const orderTime = order.starttime ? order.starttime.replace('@', '') : "";

      // Check if time is within interval
      return isTimeInRange(orderTime, startTime, endTime);
    }).length;
  };

  // Helper function to count dockets with waiting time > 15 minutes in a given interval
  const countLongWaitingDockets = (orders, interval) => {
    if (!orders || orders.length === 0) return 0;

    // Parse interval string (e.g., "08:00 - 09:00")
    const [startTime, endTime] = interval.split(' - ');

    return orders.filter(order => {
      // Extract time from starttime
      const orderTime = order.starttime ? order.starttime.replace('@', '') : "";

      // Check if time is within interval
      if (!isTimeInRange(orderTime, startTime, endTime)) return false;

      // Check if waiting time > 15 minutes
      const waitingTime = order.processtime || "";
      if (!waitingTime) return false;

      // Parse waiting time (e.g., "15min")
      const minutes = parseInt(waitingTime.replace('min', ''), 10);
      return !isNaN(minutes) && minutes > 15;
    }).length;
  };

  // Helper function to check if a time is within a range
  const isTimeInRange = (time, startTime, endTime) => {
    if (!time) return false;

    // Convert to 24h format for comparison
    const timeValue = time.includes(':') ? time : `${time.substring(0, 2)}:${time.substring(2, 4)}`;

    return timeValue >= startTime && timeValue < endTime;
  };

  const getpadd = () => {
    if (window.innerWidth >= 1536) return 80; // 2xl
    if (window.innerWidth >= 1280) return 60; // xl
    if (window.innerWidth >= 1024) return 20; // lg
    if (window.innerWidth >= 768) return 0;  // md
    return 0;
  }
  const getBoxWidth = () => {
    if (window.innerWidth >= 1836) return 800; // 2xl
    if (window.innerWidth >= 1680) return 700; // xl
    if (window.innerWidth >= 1024) return 600; // lg
    if (window.innerWidth >= 768) return 600;  // md
    return 500; // default for smaller screens
  };
  const getBoxHeight = () => {
    if (window.innerWidth >= 1536) return 250; // 2xl
    if (window.innerWidth >= 1280) return 250; // xl
    if (window.innerWidth >= 1024) return 250; // lg
    if (window.innerWidth >= 768) return 250;  // md
    return 250; // default for smaller screens
  };
  const gettextcount = () => {
    if (window.innerWidth >= 1536) return 12; // 2xl
    if (window.innerWidth >= 1380) return 9; // xl
    if (window.innerWidth >= 1024) return 7; // lg
    if (window.innerWidth >= 768) return 5;  // md
    return 5; // default for smaller screens
  };
  const [boxWidth, setBoxWidth] = useState(getBoxWidth());
  const [Height, setHeight] = useState(getBoxHeight());
  const [textCount, setTextCount] = useState(gettextcount());
  const [padd, setPadd] = useState(getpadd());
  const [paddOpp, setPaddOpp] = useState(0);

  useEffect(() => {
    const handleResize = () => { setBoxWidth(getBoxWidth()), setPadd(getpadd()), setPaddOpp(0), setHeight(getBoxHeight()), setTextCount(gettextcount()) };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* <Header name={"Dockets"} center={"Name"} />
       */}

      <div style={{ scrollbarWidth: 'none' }}>
        <div className="" style={{
          height: 52, background: "linear-gradient(#316AAF , #9ac6fc )",
          // border: "1px solid #dbdbdb"
        }} >
          <div className="row justify-content-between " style={{ paddingLeft: '2%', paddingRight: '2%', height: 52 }}>

            <div style={{ padding: 13 }} className="d-flex col"
              onClick={() => {
                navigate(-1)
              }}  >
              <img src="arrow.png" style={{ width: 20, height: 20, marginTop: 3 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >DOCKETS</p>
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

      <div style={{ backgroundColor: "#DADADA", height: '100vh', }} className="finefinrr ">

        <div style={{}} className="dddd hide-scrollbar"  >

          <div className="container-fluid px-0">
            <div className="d-flex flex-wrap justify-content-around pt-4 gap-4">
              {/* Date Range */}
              <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
                <p onClick={() => { checkkkk() }} style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
                  Chosen range:<span style={{ fontWeight: '400' }}> Custom</span>
                </p>
                <div style={{ width: '100%' }}>
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setDateRange(update)
                      if (update[1] === null || update[1] === "null") {
                      } else {
                        filterDataByDate(update, onetime, twotime, selectedOptions, hubb,
                          selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                        filterDataByDateonee(update, onetime, twotime, selectedOptionsfive,
                          hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                      }
                    }}
                    placeholderText="Select a date range"
                    className="custom-input"
                    calendarClassName="custom-calendar"
                    dateFormat="d MMM yyyy"
                    customInput={
                      <div className="custom-display-input" style={{ fontSize: 15, color: '#1A1A1B' }}>
                        {startDate || endDate ? formatRange(startDate, endDate) : "Select a date range"}
                        <FaCaretDown className="calendar-icon" />
                      </div>
                    }
                  />
                </div>
                <div className="mt-3">
                  <div className="custom-inputone d-flex justify-content-between">
                    <input
                      className='inputttt'
                      type="time"
                      value={onetime}
                      style={{ fontSize: 15, color: '#1A1A1B' }}
                      onChange={(e) => {
                        setOnetime(e.target.value)
                        if (dateRange.length === 0 || dateRange === undefined || dateRange === null || dateRange[0] === null || dateRange[1] === null) {
                          return
                        }
                        filterDataByDate(dateRange, e.target.value, twotime, selectedOptions, hubb,
                          selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                        filterDataByDateonee(dateRange, e.target.value, twotime, selectedOptionsfive,
                          hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                      }}
                    />
                    <input
                      className='inputttt'
                      type="time"
                      style={{ fontSize: 15, color: '#1A1A1B' }}
                      value={twotime}
                      onChange={(e) => {
                        setTwotime(e.target.value)
                        if (dateRange.length === 0 || dateRange === undefined || dateRange === null || dateRange[0] === null || dateRange[1] === null) {
                          return
                        }
                        filterDataByDate(dateRange, onetime, e.target.value, selectedOptions, hubb,
                          selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                        filterDataByDateonee(dateRange, onetime, e.target.value, selectedOptionsfive,
                          hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Venue & Hub */}
              <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
                <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>Chosen venue & hub</p>
                <div ref={selectRef} className="custom-inputoness d-flex justify-content-between" style={{ width: '100%', height: 45, borderRadius: menuIsOpen ? ' 8px 8px 0 0' : '8px', border: menuIsOpen ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      id="switch1"
                      checked={venueradio}
                      onChange={(e) => {
                        setVenueradio(e.target.checked)
                        if (e.target.checked === false) {
                          setSelectedOptions([])
                        } else {



                          handleChange([...selectedOptions, ...[{
                            "label": "All Venue",
                            "value": "All"
                          }]])
                          console.log(selectedOptions, 'selectedOptions')
                        }
                      }}
                    />
                    <label className="switch-label" htmlFor="switch1"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpen}
                    onMenuOpen={() => setMenuIsOpen(true)}
                    onMenuClose={() => setMenuIsOpen(false)}
                    onFocus={() => setMenuIsOpen(true)}
                    isDisabled={!venueradio}
                    isMulti
                    className={`newoneonee ${venueradio ? 'hide-first-svg' : ''}`}
                    options={basic}
                    value={selectedOptions}
                    onChange={handleChange}
                    placeholder="All Venues"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none', // ✅ Removes default browser outline
                        boxShadow: state.isFocused ? 'none' : 'none', // ✅ Prevents blue glow on focus
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpen ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpen ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />

                </div>

                <div ref={selectRefone} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45, borderRadius: menuIsOpenone ? ' 8px 8px 0 0' : '8px', border: menuIsOpenone ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      checked={hubbswitch}
                      onChange={(e) => {
                        setHubbswitch(e.target.checked)
                        if (e.target.checked === false) {
                          // Reset logic if needed
                          setHubb([])
                        } else {
                          handleChangehubone([...hubb, ...[{
                            "label": "All Hub",
                            "value": "All"
                          }]])
                        }
                      }}
                      type="checkbox"
                      id="switch35"
                    />
                    <label className="switch-label" htmlFor="switch35"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpenone}
                    onMenuOpen={() => setMenuIsOpenone(true)}
                    onMenuClose={() => setMenuIsOpenone(false)}
                    onFocus={() => setMenuIsOpenone(true)}
                    isDisabled={!hubbswitch}
                    isMulti
                    className={`newoneonee ${hubbswitch ? 'hide-first-svg' : ''}`}
                    options={basicone}
                    value={hubb}
                    onChange={handleChangehubone}
                    placeholder="All Hubs"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none', // ✅ Removes default browser outline
                        boxShadow: state.isFocused ? 'none' : 'none', // ✅ Prevents blue glow on focus
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpenone ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpenone ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Compare with */}
              <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
                <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
                  Compare with:<span style={{ fontWeight: '400' }}> Custom</span>
                </p>
                <div ref={selectReffive} className="custom-inputoness d-flex justify-content-between" style={{ width: '100%', height: 45, borderRadius: menuIsOpenfive ? ' 8px 8px 0 0' : '8px', border: menuIsOpenfive ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      id="switch13"
                      checked={venueradiofivese}
                      onChange={(e) => {
                        setVenueradiofivese(e.target.checked)
                        if (e.target.checked === false) {
                          setSelectedOptionsfive([])
                        } else {
                          handleChangefive([...selectedOptionsfive, ...[{
                            "label": "All Venues",
                            "value": "All"
                          }]])
                        }
                      }}
                    />
                    <label className="switch-label" htmlFor="switch13"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpenfive}
                    onMenuOpen={() => setMenuIsOpenfive(true)}
                    onMenuClose={() => setMenuIsOpenfive(false)}
                    onFocus={() => setMenuIsOpenfive(true)}
                    isDisabled={!venueradiofivese}
                    isMulti
                    className={`newoneonee ${venueradiofivese ? 'hide-first-svg' : ''}`}
                    options={basic}
                    value={selectedOptionsfive}
                    onChange={handleChangefive}
                    placeholder="All Venues"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none', // ✅ Removes default browser outline
                        boxShadow: state.isFocused ? 'none' : 'none', // ✅ Prevents blue glow on focus
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpenfive ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpenfive ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />
                </div>

                <div ref={selectRefsix} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45, borderRadius: menuIsOpensix ? ' 8px 8px 0 0' : '8px', border: menuIsOpensix ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      checked={venueradiosix}
                      onChange={(e) => {
                        setVenueradiosix(e.target.checked)
                        if (e.target.checked === false) {
                          // Reset logic if needed
                          setHubbtwo([])
                        } else {
                          handleChangehubtwo([...basiconefive, ...[{
                            "label": "All Hubs",
                            "value": "All"
                          }]])
                        }
                      }}
                      type="checkbox"
                      id="switch34"
                    />
                    <label className="switch-label" htmlFor="switch34"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpensix}
                    onMenuOpen={() => setMenuIsOpensix(true)}
                    onMenuClose={() => setMenuIsOpensix(false)}
                    onFocus={() => setMenuIsOpensix(true)}
                    isDisabled={!venueradiosix}
                    isMulti
                    className={`newoneonee ${venueradiosix ? 'hide-first-svg' : ''}`}
                    options={basiconefive}
                    value={hubbtwo}
                    onChange={handleChangehubtwo}
                    placeholder="All Hubs"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none',
                        boxShadow: state.isFocused ? 'none' : 'none',
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpensix ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpensix ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Filter by stages/courses */}
              <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
                <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>Filter by stages/courses</p>
                <div ref={selectReftwo} className="custom-inputoness d-flex justify-content-between" style={{ width: '100%', height: 45, borderRadius: menuIsOpentwo ? ' 8px 8px 0 0' : '8px', border: menuIsOpentwo ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      checked={Hubradio}
                      onChange={(e) => {
                        setHubradio(e.target.checked)
                        if (e.target.checked === false) {
                          setSelectedhubOptions([])
                        } else {
                          handleChangehub([...selectedhubOptions, ...[{
                            "label": "All stages",
                            "value": "All"
                          }]])
                        }
                      }}
                      id="switch2"
                    />
                    <label className="switch-label" htmlFor="switch2"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpentwo}
                    onMenuOpen={() => setMenuIsOpentwo(true)}
                    onMenuClose={() => setMenuIsOpentwo(false)}
                    onFocus={() => setMenuIsOpentwo(true)}
                    isDisabled={!Hubradio}
                    isMulti
                    className={`newoneonee ${Hubradio ? 'hide-first-svg' : ''}`}
                    options={optionshub}
                    value={selectedhubOptions}
                    onChange={handleChangehub}
                    placeholder="All stages"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none', // ✅ Removes default browser outline
                        boxShadow: state.isFocused ? 'none' : 'none', // ✅ Prevents blue glow on focus
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpentwo ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpentwo ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />
                </div>

                <div ref={selectRefthree} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45, borderRadius: menuIsOpenthree ? ' 8px 8px 0 0' : '8px', border: menuIsOpenthree ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      checked={Cources}
                      onChange={(e) => {
                        setCources(e.target.checked)
                        if (e.target.checked === false) {
                          setSelectedCources([])
                          handleChangeCources([])
                        } else {
                          handleChangeCources([...fulldatafull, ...[{
                            "label": "All courses",
                            "value": "All"
                          }]])
                        }
                      }}
                      id="switch4"
                    />
                    <label className="switch-label" htmlFor="switch4"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpenthree}
                    onMenuOpen={() => setMenuIsOpenthree(true)}
                    onMenuClose={() => setMenuIsOpenthree(false)}
                    onFocus={() => setMenuIsOpenthree(true)}
                    isDisabled={!Cources}
                    isMulti
                    className={`newoneonee ${Cources ? 'hide-first-svg' : ''}`}
                    options={fulldatafull}
                    value={selectedCources}
                    onChange={handleChangeCources}
                    placeholder="All courses"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none', // ✅ Removes default browser outline
                        boxShadow: state.isFocused ? 'none' : 'none', // ✅ Prevents blue glow on focus
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpenthree ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpenthree ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />
                </div>
              </div>

              {/* Filter by tables/takeaways */}
              <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
                <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>Filter by tables/takeaways</p>
                <div className="custom-inputoness d-flex justify-content-between gap-1" style={{ width: '100%', paddingBottom: 2, paddingTop: 2 }}>
                  <input
                    onChange={(e) => {
                      setInputvalue(e.target.value)
                      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, e.target.value, inputvaluetwo, selectedhubOptions)
                      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
                        hubbtwo, selectedCources, selectedTakeaway, e.target.value, inputvaluetwo, selectedhubOptions)
                    }}
                    value={inputvalue}
                    placeholder="0-9999"
                    style={{ width: '50%', border: 'unset', fontSize: 15, color: '#1A1A1B', borderRight: '1px solid #707070', textAlign: 'center', paddingTop: 9, paddingBottom: 9 }}
                    type="text"
                  />

                  <input
                    onChange={(e) => {
                      setInputvaluetwo(e.target.value)
                      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, e.target.value, selectedhubOptions)
                      filterDataByDateonee(dateRange, onetime, twotime, selectedOptionsfive,
                        hubbtwo, selectedCources, selectedTakeaway, inputvalue, e.target.value, selectedhubOptions)
                    }}
                    value={inputvaluetwo}
                    placeholder="9999-9999"
                    style={{ width: '50%', border: 'unset', fontSize: 15, color: '#1A1A1B', textAlign: 'center', paddingTop: 9, paddingBottom: 9 }}
                    type="text"
                  />
                </div>

                <div ref={selectReffour} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45, borderRadius: menuIsOpenfour ? ' 8px 8px 0 0' : '8px', border: menuIsOpenfour ? '2px solid #707070' : 'none', borderBottom: 'none' }}>
                  <div className="switch-container">
                    <input
                      type="checkbox"
                      checked={takeaway}
                      onChange={(e) => {
                        setTakeaway(e.target.checked)
                        if (e.target.checked === false) {
                          setSelectedTakeaway([])
                        } else {
                          handleChangeTakeaway([...optionstakeaway, ...[{
                            "label": "All takeaways",
                            "value": "All"
                          }]])
                        }
                      }}
                      id="switch5"
                    />
                    <label className="switch-label" htmlFor="switch5"></label>
                  </div>
                  <Select
                    menuIsOpen={menuIsOpenfour}
                    onMenuOpen={() => setMenuIsOpenfour(true)}
                    onMenuClose={() => setMenuIsOpenfour(false)}
                    onFocus={() => setMenuIsOpenfour(true)}
                    isDisabled={!takeaway}
                    isMulti
                    className={`newoneonee ${takeaway ? 'hide-first-svg' : ''}`}
                    options={optionstakeaway}
                    value={selectedTakeaway}
                    onChange={handleChangeTakeaway}
                    placeholder="All takeaways"
                    components={{
                      Option: CustomOption,
                      MultiValue: () => null,
                      ValueContainer: ({ children, ...props }) => {
                        const selectedValues = props.getValue();
                        return (
                          <components.ValueContainer {...props}>
                            {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                          </components.ValueContainer>
                        );
                      },
                    }}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        // border: selectedOptions?.length > 0 ? '2px solid #000' : 'unset',
                        backgroundColor: '#fff',
                        fontSize: 15,
                        color: '#1A1A1B',
                        outline: 'none', // ✅ Removes default browser outline
                        boxShadow: state.isFocused ? 'none' : 'none', // ✅ Prevents blue glow on focus
                        border: 'none'
                      }),
                      menu: (base) => ({
                        ...base,
                        minWidth: 'calc(100% + 72px)',
                        marginLeft: '-60px',
                        border: menuIsOpen ? 'black' : 'none',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        border: menuIsOpenfour ? '2px solid #707070' : 'none',
                        borderTop: 'none'
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>


          {
            meals === 1 ?
              <div className="changeone hide-scrollbar" style={{ marginTop: 100 }} >
                <div className="changetwos">
                  <div className='row'>
                    <div className='col-lg-6 col-md-12 w-100 d-flex justify-content-center' style={{ margin: 'auto' }}>
                      <div class="box" style={{ maxWidth: `${boxWidth}px`, height: `${Height}px` }} onClick={() => {
                        setMeals(2)
                      }}>
                        <div class="boxs" style={{ cursor: 'pointer' }}>
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className='asdfp' style={{ marginBottom: 0, color: '#1A1A1B', fontWeight: 600 }}>Dockets completion time</p>
                              <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }}>(Average)</p>
                            </div>
                            <div>
                              <p className='asdfp' style={{ color: '#316AAF' }}>{editall?.stats?.averageProcessTime || 0}</p>
                            </div>
                          </div>

                          <div class="end-box">
                            <img src="time.png" style={{ width: 90, height: 106 }} className="" alt="Example Image" />
                            <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }} className=''>
                              <div>
                                <div className="d-flex" style={{ marginBottom: 0 }}>
                                  <div className=' ' style={{ width: 200 }}>
                                    <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Minimum</p>
                                  </div>
                                  <div className=' ' style={{ fontWeight: '600' }}>
                                    <p style={{ marginBottom: 0, paddingLeft: 30, }}>{editall?.stats?.minProcessTime || 0}</p>
                                  </div>
                                </div>

                                <div className="d-flex" style={{ marginBottom: 0 }}>
                                  <div className=' ' style={{ width: 200 }}>
                                    <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Maximum</p>
                                  </div>
                                  <div className=' ' style={{ fontWeight: '600' }}>
                                    <p style={{ marginBottom: 0, paddingLeft: 30, }}>{editall?.stats?.maxProcessTime || 0}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-100 ">
                    <div className='row mt-5 '>
                      <div className='col-lg-6 col-md-12 mb-4 d-flex justify-content-lg-end justify-content-center' style={{ paddingRight: `${padd}px`, paddingLeft: paddOpp }}>
                        <div class="box" style={{ maxWidth: `${boxWidth}px`, height: `${Height}px` }} onClick={() => {
                          setMeals(5)
                        }}>
                          <div class="boxs" style={{ cursor: 'pointer' }}>
                            <p className='asdfp' style={{ color: '#1A1A1B', fontWeight: 600 }}>Dockets received - timeline</p>
                            <div class="end-box d-flex justify-content-between">
                              <img src="rts.png" className="d-flex justify-content-between" alt="Example Image" />
                              <p className="asdfps w-50 m-0">(# of dockets received between specific time slots)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-lg-6 col-md-12 mt-md-4 mt-lg-0 mb-4 d-flex  justify-content-lg-start justify-content-center' style={{ paddingLeft: `${padd}px`, paddingRight: paddOpp }}>
                        <div class="box" style={{ maxWidth: `${boxWidth}px`, height: `${Height}px` }} onClick={() => {
                          setMeals(4)
                        }}>
                          <div class="boxs" style={{ cursor: 'pointer' }}>
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className='asdfp' style={{ marginBottom: 0, color: '#1A1A1B', fontWeight: 600 }}>Average completion - timeline</p>
                                <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }}>(Total)</p>
                              </div>
                              <div>
                                {/* <p className='asdfp' style={{ color: '#316AAF' }}>{
                    minperday ? ggggrtz() : 0
                  }</p> */}
                              </div>
                            </div>

                            <div class="end-box d-flex justify-content-between">
                              <img src="bluee.png" className="" alt="Example Image" />
                              <p className="asdfps w-50 m-0">(Average waiting time between specific time slots)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              : meals === 2 ?

                <div className="changeone" style={{ marginTop: 80 }}>
                  <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }}>
                    <div className="row">
                      {/* Left side - Title and Select */}
                      <div className="col-md-6 mb-0 mb-md-0">
                        <div className="d-flex flex-lg-row flex-md-column align-items-md-start align-items-lg-center">
                          <div className="d-flex align-items-center">
                            <img
                              src="black_arrow.png"
                              style={{ width: 20, height: 20, cursor: 'pointer' }}
                              onClick={() => {

                                filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

                                filterDataByDateonee(dateRangetwo, onetime, twotime, selectedOptionsfive, hubbtwo, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                                setMeals(1)
                              }}
                              alt="Back Arrow"
                            />
                            <p style={{ color: '#1A1A1B', fontWeight: 600, fontSize: 20, marginLeft: 10, marginBottom: 0 }}>
                              Dockets completion time
                            </p>
                          </div>

                          <div className="custom-inputonessfine mt-lg-0 mt-md-3 pt-lg-1 pt-md-2 mx-3">
                            <Select
                              className="newoneonee"
                              options={basicfine}
                              value={selectedOptionsfine}
                              onChange={handleChangefine}
                              placeholder="Select options..."
                              components={{
                                Option: CustomOptionfinal,
                                MultiValue: () => null,
                                ValueContainer: ({ children, ...props }) => {
                                  const selectedValues = props.getValue();
                                  return (
                                    <components.ValueContainer {...props}>
                                      {selectedValues.length > 0 ? <CustomPlaceholder {...props} /> : children}
                                    </components.ValueContainer>
                                  );
                                },
                              }}
                              hideSelectedOptions={false}
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  border: 'unset',
                                  color: '#707070',
                                  minWidth: '180px',
                                  maxWidth: '100%'
                                }),
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right side - Search and Menu */}
                      <div className="col-md-6">
                        <div className="d-flex flex-column flex-sm-row justify-content-md-end align-items-sm-center">
                          <div className="custom-inputoness mb-2 mb-sm-0" style={{
                            maxWidth: '250px',
                            width: '100%',
                            height: 45,
                            border: '1px solid rgb(203 203 203)'
                          }}>
                            <div className="input-group">
                              <input
                                onChange={(e) => {
                                  searchvalue(e.target.value)
                                }}
                                type="text"
                                className="form-control"
                                placeholder="Docket Search..."
                                style={{
                                  border: "none",
                                  boxShadow: "none",
                                  paddingRight: "45px",
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
                                  top: '50%',
                                  transform: 'translateY(-50%)'
                                }}
                              >
                                🔍
                              </span>
                            </div>
                          </div>

                          <div className="position-relative mx-3">
                            <img
                              src="threedot.png"
                              ref={toggleButtonRef}
                              style={{ width: 5, height: 20, cursor: 'pointer' }}
                              onClick={handleToggleDiv}
                              className=""
                              alt="Menu"
                            />

                            {showDiv && (
                              <div
                                ref={dropdownRef}
                                style={{
                                  width: 200,
                                  padding: '10px',
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                  position: 'absolute',
                                  right: 0,
                                  zIndex: 1000
                                }}
                              >
                                <p style={{ color: '#707070' }}>Export as</p>
                                <hr />
                                <p
                                  style={{
                                    color: '#000',
                                    cursor: isPdfLoad ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    if (!isPdfLoad) {
                                      setIsPdfLoad(true);  // Prevent click when loading
                                      console.log(JSON.stringify(selectedOptions), 'dateRange');
                                      editexportpdf();
                                    }
                                  }}
                                >
                                  PDF
                                  {isPdfLoad && <span className="loader"></span>} {/* Loader icon */}

                                </p>
                                <p
                                  style={{
                                    color: '#000',
                                    cursor: isExcelLoad ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    if (!isPdfLoad) {
                                      setIsExcelLoad(true);  // Prevent click when loading
                                      downloadDocketseditExcel()
                                    }
                                  }}
                                >
                                  Excel sheet
                                  {isExcelLoad && <span className="loader"></span>} {/* Loader icon */}

                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 50, padding: 20 }}>
                      <div className="d-flex gap-5">
                        <div style={{ width: "40%" }}>
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span>{editall?.stats?.averageProcessTime || 0}</span></p>
                        </div>
                        <div style={{ width: "40%", display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span>{editallone?.stats?.averageProcessTime || 0}</span></p>
                        </div>
                        <div style={{ width: "20%", display: 'flex', justifyContent: 'end', alignItems: 'end', flexDirection: 'column' }}>
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span>
                            {(() => {
                              let numOne = parseInt(editall?.stats?.averageProcessTime || 0);
                              let numTwo = parseInt(editallone?.stats?.averageProcessTime || 0);

                              // Calculate average
                              let average = Math.round((numOne + numTwo) / 2);

                              return <span>{average + "%"} <span style={{ color: average > 0 ? "green" : "red", fontWeight: '700' }}>{average > 0 ?
                                <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={() => { }} className="" alt="Example Image" /> :
                                <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={() => { }} className="" alt="Example Image" />}</span></span>
                            })()}
                          </span></p>
                        </div>
                      </div>

                      <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />

                      <div className="scroll pdf-content" id="scrrrrol pdf-content" style={{ height: 350, overflowY: 'auto' }}>
                        <div>
                          {
                            editall?.orders?.map((dfgh, index) => {
                              const correspondingErv = editallone?.orders?.[index]; // Get corresponding item from `two`

                              return (
                                <div key={index}>
                                  <div className="d-flex gap-5">
                                    {/* Left Column */}
                                    <div style={{ width: "40%" }}>
                                      <div className="d-flex align-items-center" style={{}}>
                                        <p style={{ fontWeight: "700", color: "#000", width: "60%", marginTop: 15 }}>
                                          {dfgh?.processtime + ". " || "N/A"} <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" }}>{dfgh?.date + " " + "[" +
                                            dfgh?.table + "]" + " " + dfgh?.starttime + " " + dfgh?.staff}</span>
                                        </p>

                                        <img
                                          onClick={() => { openModal(dfgh, correspondingErv) }}
                                          src="arrows.png"
                                          style={{ width: 10, height: 14, cursor: "pointer", marginRight: 10 }}
                                          alt="up arrow"
                                        />
                                      </div>
                                    </div>

                                    {/* Center Column */}
                                    {correspondingErv ? (
                                      <div style={{ width: "40%" }}>
                                        <div className="d-flex align-items-center">
                                          <p style={{ fontWeight: "700", color: index === 0 ? 'red' : "#000", width: "60%", marginTop: 15 }}>
                                            {correspondingErv?.processtime + ". " || "N/A"} <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" }}>{correspondingErv?.date + " " + "[" +
                                              correspondingErv?.table + "]" + " " + correspondingErv?.starttime + " " + correspondingErv?.staff} </span>
                                          </p>

                                          <img
                                            onClick={() => { openModal(dfgh, correspondingErv) }}
                                            src="arrows.png"
                                            style={{ width: 10, height: 14, cursor: "pointer", marginRight: 10 }}
                                            alt="up arrow"
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div style={{ width: "40%" }}></div>
                                    )}

                                    {/* Right Column (Percentage Calculation) */}
                                    <div
                                      style={{
                                        justifyContent: "end",
                                        alignItems: "center",
                                        display: "flex",
                                        width: "20%",
                                      }}
                                    >
                                      <p style={{ fontWeight: "500", color: "#000", marginBlock: "7px" }}>
                                        <span>
                                          {(() => {
                                            const processTimeOne = parseInt(dfgh?.processtime) || 0; // Extract number from '38min'
                                            const processTimeTwo = parseInt(correspondingErv?.processtime) || 0;

                                            let percentageChange = 0;
                                            if (processTimeTwo > 0) {
                                              percentageChange = ((processTimeOne - processTimeTwo) / processTimeTwo) * 100;
                                            }

                                            return (
                                              <span style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>
                                                {percentageChange.toFixed(2) + "%"}
                                                <span
                                                  style={{
                                                    color: percentageChange > 0 ? "green" : "red",
                                                    fontWeight: "700",
                                                  }}
                                                >
                                                  {percentageChange > 0 ? (
                                                    <img
                                                      src="up_arw.png"
                                                      style={{ width: 16, height: 16, cursor: "pointer" }}
                                                      alt="up arrow"
                                                    />
                                                  ) : (
                                                    <img
                                                      src="d_arw.png"
                                                      style={{ width: 16, height: 16, cursor: "pointer" }}
                                                      alt="down arrow"
                                                    />
                                                  )}
                                                </span>
                                              </span>
                                            );
                                          })()}
                                        </span>
                                      </p>
                                    </div>
                                  </div>

                                  <hr style={{ margin: "0px 0px", backgroundColor: "black", height: 3 }} />
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                : meals === 3 ?
                  <div className="changeone" style={{ marginTop: 100 }} >
                    <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                      <div className="d-flex justify-content-between" >
                        <div style={{}} className="d-flex " >
                          <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                            setMeals(1)
                          }} className="" alt="Example Image" />
                          <p style={{ fontWeight: '500', fontSize: 20, marginTop: -6, marginLeft: 10 }}>Served meals</p>
                        </div>

                        <div className="position-relative" >
                          <img src="threedot.png" ref={toggleButtonRefs} style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={fsgdgfdfgdf} className="" alt="Example Image" />

                          {showDivs && (
                            <div
                              ref={dropdownRefs}
                              style={{
                                width: 200,
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                position: 'absolute',
                                right: 0,
                                zIndex: 1000
                              }}
                            >
                              <p style={{ color: '#707070' }}>Export as</p>
                              <hr />
                              <p
                                style={{
                                  color: '#000',
                                  cursor: isPdfLoad ? 'not-allowed' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                                onClick={() => {
                                  if (!isPdfLoad) {
                                    setIsPdfLoad(true);  // Prevent click when loading
                                    mealexportpdf()
                                  }
                                }}
                              >
                                PDF
                                {isPdfLoad && <span className="loader"></span>} {/* Loader icon */}

                              </p>
                            </div>
                          )}

                        </div>
                      </div>

                      <div style={{ marginTop: 50, padding: 20 }} >
                        <div className="d-flex justify-content-between" >

                          <div >
                            <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                            <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >{
                              ggggrt()}</span></p>
                          </div>
                          <div >
                            <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                            <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >{

                              ggggrts()
                            }</span></p>
                          </div>
                          <div >
                            <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                            <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                              {(() => {
                                let datd = ggggrt()

                                let datdtwo = ggggrts()

                                let tot = ((datd - datdtwo) / datdtwo) * 100

                                return <span >{tot.toFixed(2) + "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{tot > 0 ? <img src="up_arw.png"
                                  style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={() => {

                                  }} className="" alt="Example Image" /> :
                                  <img src="d_arw.png"
                                    style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={() => {

                                    }} className="" alt="Example Image" />}</span></span>


                                console.log(datd, datdtwo, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvv', tot)
                              })()}</span></p>
                          </div>

                        </div>

                        <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />

                        <div className="scroll" id="scrrrrol" style={{ height: 300, overflowY: 'auto' }} >



                          {
                            served?.map((dfgh, index) => {
                              const correspondingErv = servedone?.[index]; // Get the corresponding item in the `ervedone` array

                              return (
                                <>
                                  <div className="d-flex  ">

                                    <div style={{ width: '33%' }}>
                                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{dfgh?.name}</p>
                                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{dfgh?.count}</p>
                                    </div>

                                    {correspondingErv ? (
                                      <div style={{ width: '33%', textAlign: 'center' }}>
                                        <div >

                                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{correspondingErv?.name}</p>
                                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{correspondingErv?.count}</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div style={{ width: '33%' }} >
                                        </div></>
                                    )}

                                    <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex', width: '33%', }}>
                                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                                        ( Total )
                                        <span>
                                          {(() => {
                                            const datd = dfgh?.count || 0; // Fallback to 0 if no data
                                            const datdtwo = correspondingErv?.count || 0; // Fallback to 0 if no data


                                            const tot = ((datd - datdtwo) / datdtwo) * 100;

                                            return (
                                              <span>
                                                {tot.toFixed(2) + "%"}
                                                <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                                  {tot > 0 ? (
                                                    <img
                                                      src="up_arw.png"
                                                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                                                      alt="up arrow"
                                                    />
                                                  ) : (
                                                    <img
                                                      src="d_arw.png"
                                                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                                                      alt="down arrow"
                                                    />
                                                  )}
                                                </span>
                                              </span>
                                            );
                                          })()}
                                        </span>
                                      </p>
                                    </div>

                                  </div>

                                  <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
                                </>
                              );
                            })
                          }


                        </div>





                      </div>





                    </div>
                  </div>
                  : meals === 4 ?


                    <div className="changeone" style={{ marginTop: 100 }} >
                      <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                        <div className="d-flex justify-content-between" >
                          <div style={{}} className="d-flex " >
                            <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                              setMeals(1)
                            }} className="" alt="Example Image" />
                            <p style={{ fontWeight: '600', color: '#1A1A1B', fontSize: 20, marginTop: 0, marginLeft: 10, marginTop: -6 }}>Average completion - timeline</p>
                          </div>

                          <div className="position-relative">
                            <img src="threedot.png" ref={toggleButtonRefss} style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={handleToggleDivss} className="" alt="Example Image" />

                            {showDivss && (
                              <div
                                ref={dropdownRefss}
                                style={{
                                  width: 200,
                                  padding: '10px',
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                  position: 'absolute',
                                  right: 0,
                                  zIndex: 1000
                                }}
                              >
                                <p style={{ color: '#707070' }}>Export as</p>
                                <hr />
                                <p
                                  style={{
                                    color: '#000',
                                    cursor: isPdfLoad ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    if (!isPdfLoad) {
                                      setIsPdfLoad(true);  // Prevent click when loading
                                      refundexportpdf()
                                    }
                                  }}
                                >
                                  PDF
                                  {isPdfLoad && <span className="loader"></span>} {/* Loader icon */}

                                </p>
                                <p
                                  style={{
                                    color: '#000',
                                    cursor: isExcelLoad ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    if (!isPdfLoad) {
                                      downloadDocketsavgExcel()
                                    }
                                  }}
                                >
                                  Excel sheet
                                  {isExcelLoad && <span className="loader"></span>} {/* Loader icon */}

                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ marginTop: 50, padding: 20 }} >



                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Left Scroll Button */}
                            <button onClick={scrollLeft} style={buttonStyle}>⬅</button>
                            <p className="gggjgjjg"># of new dockets</p>
                            {/* Scrollable Chart Container */}
                            <div ref={chartContainerRef} className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                              <div style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                <Bar data={datafineone} options={optionshshs} id="AvgChart-capture" />
                              </div>
                            </div>

                            {/* Right Scroll Button */}
                            <button onClick={scrollRight} style={buttonStyle}>➡</button>


                          </div>


                          <div style={{ visibility: 'hidden' , position : 'absolute' }}>
                            <div ref={pdfRefredone}  >

                              <p style={{ fontWeight: '700', fontSize: 25, color: '#000', wordSpacing: -5 }}>Dockets received - timeline - From {selectedOptionsfine[0]?.label}to
                                {selectedOptionsfine[0]?.label === "Minimum" ? "Maximum" : "Minimum"}</p>

                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >{(() => {

                                const filteredOptions = selectedOptions.filter(item => item.label !== "All Venue");
                                const result = filteredOptions.map(item => item.label).join(", ");


                                if (result === "" || result === undefined || result === null) {
                                  return 'All Venue'
                                } else {

                                  return result

                                }


                              })()}</p>

                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: 20, wordSpacing: -5 }} >Group name</p>
                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >For the period {(() => {
                                const datefineda = new Date(dateRange[0]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} to {(() => {
                                const datefineda = new Date(dateRange[1]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} between {onetime || "00:00"} to {twotime || "24:00"}</p>
                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >Compared with the period {(() => {
                                const datefineda = new Date(dateRangetwo[0]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} to {(() => {
                                const datefineda = new Date(dateRangetwo[1]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} between {threetime || "00:00"} to {fourtime || "24:00"}</p>

                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20, wordSpacing: -5 }} >Table ranges contains: All</p>
                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20, wordSpacing: -5 }} >Stages contains: {(() => {

                                const result = selectedhubOptions.map(item => item.label).join(",");

                                if (result === "" || result === undefined || result === null) {
                                  return 'All'
                                } else {

                                  return result

                                }


                              })()} </p>
                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20, wordSpacing: -5 }} >Courses contains: {(() => {

                                const result = selectedCources.map(item => item.label).join(",");

                                if (result === "" || result === undefined || result === null) {
                                  return 'All'
                                } else {

                                  return result

                                }


                              })()}</p>



                              <div className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                                <div style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                  <Bar data={datafineone} options={optionshshs} />
                                </div>
                              </div>

                            </div >
                          </div>



                        </div>





                      </div>
                    </div>

                    :

                    <div className="changeone" style={{ marginTop: 100 }} >
                      <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                        <div className="d-flex justify-content-between" >
                          <div style={{}} className="d-flex " >
                            <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                              setMeals(1)
                            }} className="" alt="Example Image" />
                            <p style={{ fontWeight: '600', color: '#1A1A1B', fontSize: 20, marginTop: 0, marginLeft: 10, marginTop: -6 }}>Dockets received - timeline</p>
                          </div>

                          <div className="position-relative">
                            <img src="threedot.png" ref={toggleButtonRefsss} style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={handleToggleDivsss} className="" alt="Example Image" />

                            {showDivsss && (

                              <div
                                ref={dropdownRefsss}
                                style={{
                                  width: 200,
                                  padding: '10px',
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                  position: 'absolute',
                                  right: 0,
                                  zIndex: 1000
                                }}
                              >
                                <p style={{ color: '#707070' }}>Export as</p>
                                <hr />
                                <p
                                  style={{
                                    color: '#000',
                                    cursor: isPdfLoad ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    if (!isPdfLoad) {
                                      setIsPdfLoad(true);  // Prevent click when loading
                                      chartexportpdf()
                                    }
                                  }}
                                >
                                  PDF
                                  {isPdfLoad && <span className="loader"></span>} {/* Loader icon */}

                                </p>
                                <p
                                  style={{
                                    color: '#000',
                                    cursor: isExcelLoad ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onClick={() => {
                                    if (!isPdfLoad) {
                                      setIsExcelLoad(true);  // Prevent click when loading
                                      downloadDocketsrecExcel()
                                    }
                                  }}
                                >
                                  Excel sheet
                                  {isExcelLoad && <span className="loader"></span>} {/* Loader icon */}

                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ marginTop: 50, padding: 20 }} >


                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Left Scroll Button */}
                            <button onClick={scrollLeftfine} style={buttonStyle}>⬅</button>
                            <p className="gggjgjjg">Average waiting time</p>
                            {/* Scrollable Chart Container */}
                            <div ref={finefine} className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                              <div style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                <Bar data={datafine} options={optionshshs} id="docChart-capture" />
                              </div>
                            </div>

                            {/* Right Scroll Button */}
                            <button onClick={scrollRightfine} style={buttonStyle}>➡</button>
                          </div>


                          <div style={{ visibility: 'hidden' , position : 'absolute' }}>
                            <div ref={pdfRefred}  >

                              <p style={{ fontWeight: '700', fontSize: 25, color: '#000', wordSpacing: -5 }}>Dockets received - timeline - From {selectedOptionsfine[0]?.label}to
                                {selectedOptionsfine[0]?.label === "Minimum" ? "Maximum" : "Minimum"}</p>
                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >{(() => {

                                const filteredOptions = selectedOptions.filter(item => item.label !== "All Venue");
                                const result = filteredOptions.map(item => item.label).join(", ");


                                if (result === "" || result === undefined || result === null) {
                                  return 'All Venue'
                                } else {

                                  return result

                                }


                              })()}</p>

                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: 20, wordSpacing: -5 }} >Group name</p>
                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >For the period {(() => {
                                const datefineda = new Date(dateRange[0]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} to {(() => {
                                const datefineda = new Date(dateRange[1]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} between {onetime || "00:00"} to {twotime || "24:00"}</p>
                              <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >Compared with the period {(() => {
                                const datefineda = new Date(dateRangetwo[0]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} to {(() => {
                                const datefineda = new Date(dateRangetwo[1]);

                                const formattedDate = datefineda.toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                });

                                return (formattedDate)
                              })()} between {threetime || "00:00"} to {fourtime || "24:00"}</p>

                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20, wordSpacing: -5 }} >Table ranges contains: All</p>
                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20, wordSpacing: -5 }} >Stages contains: {(() => {

                                const result = selectedhubOptions.map(item => item.label).join(",");

                                if (result === "" || result === undefined || result === null) {
                                  return 'All'
                                } else {

                                  return result

                                }


                              })()} </p>
                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20, wordSpacing: -5 }} >Courses contains: {(() => {

                                const result = selectedCources.map(item => item.label).join(",");

                                if (result === "" || result === undefined || result === null) {
                                  return 'All'
                                } else {

                                  return result

                                }


                              })()}</p>



                              <div className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                                <div style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                  <Bar data={datafine} options={optionshshs} id="docChart-capture" />
                                </div>
                              </div>

                            </div >
                          </div>






                          {/* <div style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                    <div style={{ width: '1500px', height: '500px' }}>  
                      <Bar data={datafine} options={optionshshs} />
                    </div>
                  </div> */}

                        </div>





                      </div>
                    </div>



          }



        </div>










        <div className="d-none" style={{ visibility: 'hidden' }}>
          <div ref={pdfRef}  >

            <p style={{ fontWeight: '700', fontSize: 25, color: '#000', }}>Dockets Completion Time - From {selectedOptionsfine[0]?.label}to
              {selectedOptionsfine[0]?.label === "Minimum" ? "Maximum" : "Minimum"}</p>

            <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: 20 }} >Group name</p>
            <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20 }} >For the period {(() => {
              const datefineda = new Date(dateRange[0]);

              const formattedDate = datefineda.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              });

              return (formattedDate)
            })()} to {(() => {
              const datefineda = new Date(dateRange[1]);

              const formattedDate = datefineda.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              });

              return (formattedDate)
            })()} between {onetime || "00:00"} to {twotime || "24:00"}</p>
            <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20 }} >Compared with the period {(() => {
              const datefineda = new Date(dateRangetwo[0]);

              const formattedDate = datefineda.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              });

              return (formattedDate)
            })()} to {(() => {
              const datefineda = new Date(dateRangetwo[1]);

              const formattedDate = datefineda.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              });

              return (formattedDate)
            })()} between {threetime || "00:00"} to {fourtime || "24:00"}</p>

            <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20 }} >Table ranges contains:  {(() => {

              const result = selectedOptions.map(item => item.value).join(",");

              if (result === "" || result === undefined || result === null) {
                return 'All'
              } else {

                return result

              }


            })()}</p>
            <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20 }} >Stages contains: {(() => {

              const result = selectedhubOptions.map(item => item.label).join(",");

              if (result === "" || result === undefined || result === null) {
                return 'All'
              } else {

                return result

              }


            })()} </p>
            <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20 }} >Courses contains: {(() => {

              const result = selectedCources.map(item => item.label).join(",");

              if (result === "" || result === undefined || result === null) {
                return 'All'
              } else {

                return result

              }


            })()}</p>

            <div className="d-flex gap-5" style={{ marginTop: 20 , borderBottom: "1px solid #ccc"  }}>

              <div style={{ width: "40%" }}>
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span >{
                  editall?.stats?.averageProcessTime || 0}</span></p>
              </div>
              <div style={{ width: "40%", display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span >{editallone?.stats?.averageProcessTime || 0}</span></p>
              </div>
              <div style={{ width: "20%", display: 'flex', justifyContent: 'end', alignItems: 'end', flexDirection: 'column' }}>
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', textAlign: 'left' }}>Variance</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span >
                  {(() => {
                    let numOne = parseInt(editall?.stats?.averageProcessTime || 0);
                    let numTwo = parseInt(editallone?.stats?.averageProcessTime || 0);

                    // Calculate average
                    let average = Math.round((numOne + numTwo) / 2);

                    return <span >{average + "%"} <span style={{ color: average > 0 ? "green" : "red", fontWeight: '700' }} >{average > 0 ? <img src="up_arw.png"
                      style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={() => {

                      }} className="" alt="Example Image" /> :
                      <img src="d_arw.png"
                        style={{ width: 16, height: 16, cursor: 'pointer' }} onClick={() => {

                        }} className="" alt="Example Image" />}</span></span>


                  })()}</span></p>
              </div>

            </div>
 
            {
              editall?.orders?.map((dfgh, index) => {
                const correspondingErv = editallone?.orders?.[index]; // Get corresponding item from `two`

                return (
                  <div key={index} style={{ borderBottom: "1px solid #ccc" }}  >
                    <div className="d-flex gap-5" >
                      {/* Left Column */}
                      <div style={{ width: "40%" }}>
                        <div className="d-flex  " style={{}}>
                          <p style={{ paddingTop: 15 }}>
                            <span style={{ fontWeight: "400", color: index === 0 ? 'red' : "#000", marginBlock: "4px" , fontSize : 14 }} >{dfgh?.processtime + ". " || "N/A"} <span
                              style={{ color: '#000' }} > {dfgh?.date + " " + "[" +
                                dfgh?.table + "]" + " " + dfgh?.starttime + " " + dfgh?.staff}</span></span>
                          </p>

                        </div>

                      </div>

                      {/* Center Column */}
                      {correspondingErv ? (
                        <div style={{ width: "40%", }}>
                          <div className="d-flex  " >
                            <p style={{ paddingTop: 15 }}>
                              <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" , fontSize : 14  }} > {correspondingErv?.processtime + ". " || "N/A"} {correspondingErv?.date + " " + "[" +
                                correspondingErv?.table + "]" + " " + correspondingErv?.starttime + " " + correspondingErv?.staff} </span>
                            </p>


                          </div>

                        </div>
                      ) : (
                        <div style={{ width: "33%" }}></div>
                      )}

                      {/* Right Column (Percentage Calculation) */}
                      <div
                        style={{
                          justifyContent: "end",
                          alignItems: "center",
                          display: "flex",
                          width: "20%",
                        }}
                      >
                        <p style={{ fontWeight: "500", color: "#000", marginBlock: "7px" , fontSize : 14  }}>

                          <span>
                            {(() => {
                              const processTimeOne = parseInt(dfgh?.processtime) || 0; // Extract number from '38min'
                              const processTimeTwo = parseInt(correspondingErv?.processtime) || 0;

                              let percentageChange = 0;
                              if (processTimeTwo > 0) {
                                percentageChange = ((processTimeOne - processTimeTwo) / processTimeTwo) * 100;
                              }

                              return (
                                <span>
                                  {percentageChange.toFixed(2) + "%"}
                                  <span
                                    style={{
                                      color: percentageChange > 0 ? "green" : "red",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {percentageChange > 0 ? (
                                      <img
                                        src="up_arw.png"
                                        style={{ width: 16, height: 16, cursor: "pointer" }}
                                        alt="up arrow"
                                      />
                                    ) : (
                                      <img
                                        src="d_arw.png"
                                        style={{ width: 16, height: 16, cursor: "pointer" }}
                                        alt="down arrow"
                                      />
                                    )}
                                  </span>
                                </span>
                              );
                            })()}
                          </span>
                        </p>
                      </div>
                    </div>
 
                  </div>
                );
              })
            }
          </div >
        </div>







      </div>




      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div style={{}} >
          <div className="row" >
            <div className="col-4" style={{ overflow: 'hidden' }} >
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Date: {cval1?.date}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Time created: {(() => {
              })()} {cval1?.starttime.replace('@', '')}</p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Time served: {(() => {
                const datass = cval1?.order?.STAMP;

                if (!datass) {
                  return
                }
                // Extract the "S" event using regex
                const match = datass.match(/\b(\d{4})S\d\b/);

                if (match) {
                  const time = match[1]; // Extract the 4-digit time (e.g., "1500")
                  const formattedTime = `${time.slice(0, 2)}:${time.slice(2)}`; // Convert to HH:mm
                  return (formattedTime)
                  // console.log(formattedTime); // Output: "15:00"
                } else {
                  // console.log("No 'S' event found");
                }


              })()}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Completion time: {timeDifference(cval1?.starttime.replace('@', ''), cval1?.order?.STAMP)}</p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Docket #: {cval1?.order?.DOCKETID}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Table #: {cval1?.order?.TABLE}</p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} ># of courses: {cval1?.order?.COURSES}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} ># of meals: {cval1?.order?.ITEMS?.length}</p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Waiter Name: {cval1?.staff}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Header note: {cval1?.order?.NOTE}</p>

            </div>
            <div className="col-1"  >
              <div class="vertical-line"></div>
            </div>
            <div className="col-7 gggg" >
              <div style={{ height: 300 }}>

                {/* <p style={{ fontWeight: '600', fontSize: 15, textAlign: 'center', marginBottom: 0 }}>Course 1 : {cval1?.order?.COURSES}</p>
                <p style={{ fontWeight: '500', fontSize: 13, textAlign: 'center', color: "#707070" }}>Time: R:  . | P: . | H: .</p>

                <div style={{ marginTop: 10 }}  >
                  {
                    cval1?.order?.ITEMS.map((kai, index) => {
                      return (
                        <div style={{ marginBottom: 15 }}>
                          <p style={{ fontWeight: '600', fontSize: 13, marginBottom: 0 }}>Item {index + 1}: {kai?.ITEM}</p>
                          <p style={{ fontWeight: '400', fontSize: 13, marginBottom: 0, color: "#707070" }}>Note: {kai?.NOTE}</p>
                          <p style={{ fontWeight: '400', fontSize: 13, marginBottom: 0, color: "#707070" }}>Edited: {
                            kai?.STATUS === "2" || kai?.STATUS === "12" || kai?.STATUS === "22" || kai?.STATUS === "32" ? 'Yes' : "No"
                          } | Moved: {
                              kai?.STATUS === "3" || kai?.STATUS === "13" || kai?.STATUS === "23" || kai?.STATUS === "33" ? 'Yes' : "No"
                            } | Deleted:  {
                              kai?.STATUS === "4" || kai?.STATUS === "24" ? 'Yes' : "No"
                            }</p>
                        </div>

                      )
                    })
                  }
                </div>
 */}

                <OrderDisplay orders={cval2 || {}} />

              </div>
            </div>

          </div>
        </div>
      </Modal>


    </div>
  );
};


const buttonStyle = {
  padding: '10px',
  fontSize: '20px',
  cursor: 'pointer',
  background: '#f0f0f0',
  border: 'none',
  borderRadius: '5px',
};

export default Multi_venue;


