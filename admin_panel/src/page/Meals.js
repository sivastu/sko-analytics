import React, { useEffect, useState, useRef } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCaretDown } from "react-icons/fa6";
import TimePicker from 'react-time-picker';
import Swal from 'sweetalert2'
import Select, { components } from 'react-select';
import { FaCheck } from 'react-icons/fa';

import app from "./firebase";
import {
  getDatabase, ref, set, push, get, query,
  startAt, endAt, orderByChild, equalTo,
  orderByKey
} from "firebase/database";


let Meals = () => {
  let [data, setData] = useState();
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [startDate, endDate] = dateRange;


  let [basicall, setBasicall] = useState()
  let [basic, setBasic] = useState()
  let [basicone, setBasicone] = useState()

  let [hubb, setHubb] = useState()
  let [hubbswitch, setHubbswitch] = useState(false)



  //edit
  let [ edit , setEdit ] = useState()
  let [ moved , setMoved ] = useState()
  let [ deleted , setDeleted ] = useState()
  let [ tablemoved , setTablemoved ] = useState()


  //served meals
  let [ mostserved , setMostserved ] = useState()
  let [ lessserved , setLessserved ] = useState()

  //refund meals
  let [ minperday , setMinperday ] = useState()
  let [ maxperday , setMaxperday ] = useState()

  useEffect(() => {

    getone()

  }, [])


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

          console.log("Events between dates:", JSON.stringify(cleanedData));


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



          const optionsone = [];
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

          console.log("options:", optionsone);
          // console.log("optionss:", optionsstwo);

          setBasic(optionsone)

          const kitchen2Data = cleanedData["ZushiGroup"]["ZushiBarangaroo"].Kitchen["2025-01-20"];
          const optionstakeaway = [
            ...new Set(kitchen2Data.map(item => item.NOTE)) // Extract unique values from the NOTE field
          ].map(value => ({ value, label: value }));

        console.log(optionstakeaway , 'kitchen2Datakitchen2Datakitchen2Data')
        setFulldatafull(optionstakeaway)
                // setBasicone(optionsstwo)

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
  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };
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

  let [fulldatafull, setFulldatafull] = useState()
  let [fulldatatwofull, setFulldatatwofull] = useState()

  let updates = (num, val) => {

    console.log(dateRange, 'startDatetwo, endDatetwostartDatetwo, endDatetwo')
    console.log(dateRangetwo, 'startDate, endDate startDate, endDate startDate, endDate')



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

      console.log(basicall, 'basicallbasicallbasicallbasicall')


      Object.entries(basicall).forEach(([groupKey, groupData]) => {
        Object.entries(groupData).forEach(([areas, areaDatas]) => {
          Object.entries(areaDatas).forEach(([area, areaData]) => {
            Object.entries(areaData).forEach(([dates, records]) => {
              // Check if the date is within the range


              console.log(dates, formattedDate, formattedDatetwo)
              if (dates >= formattedDate && dates <= formattedDatetwo) {
                // Create the dynamic key based on the index and date
                const index = `${Object.keys(filteredData).length + 1}`;
                filteredData[`${index}) ${dates}`] = records;
              }




            });
          });
        });
      });

      console.log(filteredData, 'filteredDatafilteredDatafilteredData');

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

        console.log(basicall, 'basicallbasicallbasicallbasicall')


        Object.entries(basicall).forEach(([groupKey, groupData]) => {
          Object.entries(groupData).forEach(([areas, areaDatas]) => {
            Object.entries(areaDatas).forEach(([area, areaData]) => {
              Object.entries(areaData).forEach(([datess, recordss]) => {
                // Check if the date is within the range


                console.log(datess, formattedDates, formattedDatetwos)
                if (datess >= formattedDates && datess <= formattedDatetwos) {
                  // Create the dynamic key based on the index and date
                  const indexs = `${Object.keys(filteredDatas).length + 1}`;
                  filteredDatas[`${indexs}) ${datess}`] = recordss;
                }




              });
            });
          });
        });

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

      console.log(basicall, 'basicallbasicallbasicallbasicall')


      Object.entries(basicall).forEach(([groupKey, groupData]) => {
        Object.entries(groupData).forEach(([areas, areaDatas]) => {
          Object.entries(areaDatas).forEach(([area, areaData]) => {
            Object.entries(areaData).forEach(([dates, records]) => {
              // Check if the date is within the range


              console.log(dates, formattedDate, formattedDatetwo)
              if (dates >= formattedDate && dates <= formattedDatetwo) {
                // Create the dynamic key based on the index and date
                const index = `${Object.keys(filteredData).length + 1}`;
                filteredData[`${index}) ${dates}`] = records;
              }




            });
          });
        });
      });

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

        console.log(basicall, 'basicallbasicallbasicallbasicall')


        Object.entries(basicall).forEach(([groupKey, groupData]) => {
          Object.entries(groupData).forEach(([areas, areaDatas]) => {
            Object.entries(areaDatas).forEach(([area, areaData]) => {
              Object.entries(areaData).forEach(([datess, recordss]) => {
                // Check if the date is within the range


                console.log(datess, formattedDates, formattedDatetwos)
                if (datess >= formattedDates && datess <= formattedDatetwos) {
                  // Create the dynamic key based on the index and date
                  const indexs = `${Object.keys(filteredDatas).length + 1}`;
                  filteredDatas[`${indexs}) ${datess}`] = recordss;
                }




              });
            });
          });
        });

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


  let callfordata = () =>{
    

    if(fulldatatwo === undefined || fulldatatwo === null || fulldatatwo === '' || 
      fulldata === undefined || fulldata === null || fulldata === ""
    ){

    }else{
      //

      const categorizeItems = (data) => {
        const edited = ["2", "12", "22", "32"];
        const moved = ["3", "13", "23", "33"];
        const deleted = ["4", "24"];
      
        const result = {
          edited: [],
          moved: [],
          deleted: [],
          served: [],
          tableMoved : []
        };
      
        for (const [date, entries] of Object.entries(data)) {

         

          entries.forEach(entry => {

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

      let editttsone = categorizeItems(fulldatatwo)
      let editttstwo = categorizeItems(fulldata)


      const processItems = (data) => {
        const dishCounts = {};
      
        // Iterate through the data to collect and process dishes
        for (const [date, entries] of Object.entries(data)) {
          entries.forEach(entry => {
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


        let minnscount = processItems(fulldatatwo)
        let maxnscount = processItems(fulldata)


        const processRefundedItems = (data) => {
          const results = [];
        
          // Iterate through each date's data
          for (const [date, entries] of Object.entries(data)) {
            let refundedItems = [];
        
            entries.forEach(entry => {
              entry.ITEMS.forEach(item => {
                // Check if "Refunded" exists in the ITEM field
                if (item.ITEM.includes("Refunded")) {
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
                name: refundedItems[0].ITEM, // Assuming all refunded items share the same name
                data: refundedItems,
              });
            }
          }
        
          return results;
        };

        let refundcount = processRefundedItems(fulldatatwo)
        let refundcounttwo = processRefundedItems(fulldata)


      console.log(refundcount , 'fulldata')
      console.log(refundcounttwo , 'fulldatatwo')


    }
  }




  let checkkkk = () =>{

    console.log(fulldatatwo , 'fulldatatwo')
    console.log( JSON.stringify( fulldata) , 'fulldata')

  }
  let navigate = useNavigate();



  //.select options venue

  const [venueradio, setVenueradio] = useState(false)
  const options = [
    { value: 'all', label: 'All venues' },
    { value: 'volvo', label: 'Volvo' },
    { value: 'saab', label: 'Saab' },
    { value: 'mercedes', label: 'Mercedes' },
    { value: 'audi', label: 'Audi' },
  ];
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
        <span style={{ flexGrow: 1 }}>{data.label}</span>
        {isSelected && <FaCheck style={{ fontSize: '12px', color: '#0073e6' }} />}
      </div>
    );
  };
  const CustomMultiValue = () => null;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleChange = (selected) => {
    console.log(selected, 'selected')
    setSelectedOptions(selected || []);
  };




  //.select options hub

  const [Hubradio, setHubradio] = useState(false)
  const optionshub = [
    { value: 'all', label: 'All stages' },
    { value: 'Process', label: 'On Process' },
    { value: 'Hold', label: 'On Hold' },
    { value: 'Pass', label: 'On Pass' }, 
  ];

  const [selectedhubOptions, setSelectedhubOptions] = useState([]);
  const handleChangehub = (selected) => {
    setSelectedhubOptions(selected || []);

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
    setSelectedCources(selected || []);
  };


  //select takeaway
  const [takeaway, setTakeaway] = useState(false)
  const optionstakeaway = [
    { value: 'all', label: 'All takeaways' },
    { value: 'Takeaways', label: 'Takeaways' },
    { value: 'Deliveries', label: 'Deliveries' },
    { value: 'Pick-ups', label: 'Pick-ups' }, 
  ];
  const [selectedTakeaway, setSelectedTakeaway] = useState([]);
  const handleChangeTakeaway = (selected) => {
    setSelectedTakeaway(selected || []);
  };

  //times
  let [onetime, setOnetime] = useState('24:00')
  let [twotime, setTwotime] = useState('24:00')
  let [threetime, setThreetime] = useState('24:00')
  let [fourtime, setFourtime] = useState('24:00')

  //input value
  let [inputvalue, setInputvalue] = useState()
  let [inputvaluetwo, setInputvaluetwo] = useState()


  //timestamp
  let tiemstampp = async (dat, val) => {
    if (dat === 1) {
      let time = val.replace(":", "");

      let twotwotime = twotime.replace(":", "");




      function filterByRange(data, one, two) {
        const result = {};
        Object.keys(data).forEach(date => {
          const filteredArray = data[date].filter(item => {
            const match = item.STAMP.match(/(\d{4})R0/); // Extract the number before "R0"
            if (match) {
              const number = parseInt(match[1], 10); // Convert to integer
              return number >= one && number <= two; // Check if within range
            }
            return false;
          });

          if (filteredArray.length > 0) {
            result[date] = filteredArray;
          }
        });
        return result;
      }



      const filteredData = filterByRange(fulldata, time, twotwotime);


      console.log(filteredData)
    }
  }



  let venueradios = () => {

  }

  return (
    <div>
      <Header name={"Meals"} center={"Name"} />
      <div style={{ backgroundColor: "#DADADA", height: '100vh' }} >

        <div style={{}} className="dddd"  >

          <div className="d-flex justify-content-between  pt-4" >

            <div >
              <p onClick={() => {

                callfordata()

              }} style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen range:<span style={{ fontWeight: '400' }}> Custom</span></p>

              <div  >
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update)

                    if (update[1] === null || update[1] === "null") {

                    } else {
                      updates(1, update)
                    }
                  }} // Update both startDate and EndDate 
                  placeholderText="Select a date range"
                  className="custom-input"
                  calendarClassName="custom-calendar"
                  dateFormat="d MMM yyyy"
                  customInput={
                    <div className="custom-display-input">
                      {startDate || endDate ? formatRange(startDate, endDate) : "Select a date range"}
                      <FaCaretDown className="calendar-icon" />
                    </div>
                  }
                />
              </div>
              <div className="mt-3" >
                <div className="custom-inputone d-flex justify-content-between">
                  <input
                    className='inputttt'
                    type="time"
                    value={onetime}
                    onChange={(e) => {
                      console.log(e.target.value, 'eeee')
                      setOnetime(e.target.value)

                      tiemstampp(1, e.target.value)


                    }}
                  />
                  <input
                    className='inputttt'
                    type="time"
                    value={twotime}
                    onChange={(e) => {
                      setTwotime(e.target.value)
                    }}
                  />
                </div>
              </div>



            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Compare with:<span style={{ fontWeight: '400' }}> Custom</span></p>
              <div  >
                <DatePicker
                  selectsRange
                  startDate={startDatetwo}
                  endDate={endDatetwo}
                  onChange={(update) => {
                    setDateRangetwo(update)

                    if (update[1] === null || update[1] === "null") {

                    } else {
                      updates(2, update)
                    }


                  }} // Update both startDate and EndDate 
                  placeholderText="Select a date range"
                  className="custom-input"
                  calendarClassName="custom-calendar"
                  dateFormat="d MMM yyyy"
                  customInput={
                    <div className="custom-display-input">
                      {startDatetwo || endDatetwo ? formatRange(startDatetwo, endDatetwo) : "Select a date range"}
                      <FaCaretDown className="calendar-icon" />
                    </div>
                  }
                />
              </div>
              <div className="mt-3" >
                <div className="custom-inputone d-flex justify-content-between">
                  <input
                    className='inputttt'
                    type="time"
                    value={threetime}
                    onChange={(e) => {
                      setThreetime(e.target.value)
                    }}
                  />
                  <input
                    className='inputttt'
                    type="time"
                    value={fourtime}
                    onChange={(e) => {
                      setFourtime(e.target.value)
                    }}
                  />
                </div>
              </div>



            </div>


            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen venue & hub</p>
              <div className="custom-inputoness d-flex justify-content-between" style={{
                width: 260, height: 45
              }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" checked={venueradio} onChange={(e) => {
                    setVenueradio(e.target.checked)
                    if (e.target.checked === false) {
                      setSelectedOptions([])
                    } else {
                      venueradios(e.target.checked)
                    }

                    console.log(e.target.checked, 'ggggggggggggggg')
                  }} />
                  <label class="switch-label" for="switch1"></label>
                </div>
                <Select
                  isDisabled={!venueradio}
                  isMulti
                  className="newoneonee"
                  options={basic}
                  value={selectedOptions}
                  onChange={handleChange}
                  placeholder="Select options..."
                  components={{
                    Option: CustomOption, // Custom tick option
                    MultiValue: CustomMultiValue, // Hides selected values in input
                  }}
                  closeMenuOnSelect={false} // Keep dropdown open for further selection
                  hideSelectedOptions={false} // Show all options even if selected
                  styles={{
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />
              </div>

              <div className="custom-inputoness d-flex justify-content-between mt-3" style={{
                width: 260,
                height: 45
              }}>

                <div class="switch-container">
                  <input checked={hubbswitch} onChange={(e) => {
                    setHubbswitch(e.target.checked)
                    if (e.target.checked === false) {
                    }
                  }} type="checkbox" id="switch3" />
                  <label class="switch-label" for="switch3"></label>
                </div>

                <select disabled={!hubbswitch} className="newoneonee" onChange={(e) => {
                  setHubb(e.target.value)
                  console.log(e.target.value)
                }} name="cars" id="cars" style={{ border: 'unset', color: '#707070' }} >
                  <option value="">Select</option>
                  {basicone?.map(item => (
                    <option value={item.label}>{item.label}</option>
                  ))}
                </select>

              </div>
            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by stages/courses</p>
              <div className="custom-inputoness d-flex justify-content-between" style={{
                width: 260,
                height: 45
              }}>

                <div class="switch-container">
                  <input type="checkbox" checked={Hubradio} onChange={(e) => {
                    setHubradio(e.target.checked)
                    if (e.target.checked === false) {
                      setSelectedhubOptions([])
                    }
                  }} id="switch2" />
                  <label class="switch-label" for="switch2"></label>
                </div>

                <Select
                  isDisabled={!Hubradio}
                  isMulti
                  className="newoneonee"
                  options={optionshub}
                  value={selectedhubOptions}
                  onChange={handleChangehub}
                  placeholder="Select options..."
                  components={{
                    Option: CustomOption, // Custom tick option
                    MultiValue: CustomMultiValue, // Hides selected values in input
                  }}
                  closeMenuOnSelect={false} // Keep dropdown open for further selection
                  hideSelectedOptions={false} // Show all options even if selected
                  styles={{
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />
              </div>


              <div className="custom-inputoness d-flex justify-content-between mt-3" style={{
                width: 260,
                height: 45
              }}>
                <div class="switch-container">
                  <input type="checkbox" checked={Cources} onChange={(e) => {
                    setCources(e.target.checked)
                    if (e.target.checked === false) {
                      setSelectedCources([])
                    }
                  }} id="switch4" />
                  <label class="switch-label" for="switch4"></label>
                </div>

                <Select
                  isDisabled={!Cources}
                  isMulti
                  className="newoneonee"
                  options={fulldatafull}
                  value={selectedCources}
                  onChange={handleChangeCources}
                  placeholder="Select options..."
                  components={{
                    Option: CustomOption, // Custom tick option
                    MultiValue: CustomMultiValue, // Hides selected values in input
                  }}
                  closeMenuOnSelect={false} // Keep dropdown open for further selection
                  hideSelectedOptions={false} // Show all options even if selected
                  styles={{
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />
              </div>


            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by tables/takeaways</p>

              <div className="custom-inputoness d-flex justify-content-between gap-1" style={{ width: 260 }}>
                {/* <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div> */}

                {/* <select name="cars" id="cars" style={{ border: 'unset', color: '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> */}
                <input onChange={(e) => {
                  setInputvalue(e.target.value)
                }} value={inputvalue} placeholder="0" style={{ width: '50%', border: 'unset' }} type="number" />
                <p style={{ fontSize: 19, display: 'contents' }} >|</p>
                <input onChange={(e) => {
                  setInputvaluetwo(e.target.value)
                }} value={inputvaluetwo} placeholder="999" style={{ width: '50%', border: 'unset' }} type="number" />
              </div>

              <div className="custom-inputoness d-flex justify-content-between mt-3" style={{
                width: 260,
                height: 45
              }}>





                {/* <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars" style={{ border: 'unset', color: '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> */}

                <div class="switch-container">
                  <input type="checkbox" checked={takeaway} onChange={(e) => {
                    setTakeaway(e.target.checked)
                    if (e.target.checked === false) {
                      setSelectedTakeaway([])
                    }
                  }} id="switch5" />
                  <label class="switch-label" for="switch5"></label>
                </div>

                <Select
                  isDisabled={!takeaway}
                  isMulti
                  className="newoneonee"
                  options={optionstakeaway}
                  value={selectedTakeaway}
                  onChange={handleChangeTakeaway}
                  placeholder="Select options..."
                  components={{
                    Option: CustomOption, // Custom tick option
                    MultiValue: CustomMultiValue, // Hides selected values in input
                  }}
                  closeMenuOnSelect={false} // Keep dropdown open for further selection
                  hideSelectedOptions={false} // Show all options even if selected
                  styles={{
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />



              </div>
            </div>

          </div>


          <div className="" style={{ marginTop: 100 }} >
            {/* <div className='row ddd' >
                <div className='col-6' >
                  <div className='asdf'  >
                    <p className='asdfp'>Meals received - timeline</p>

                    <div className='' >

                    <div className='d-flex justify-content-between ' >
                      <img src="rts.png" className="" alt="Example Image" />
                      <p className="">(# of meals sent between
                        specific time slots) </p>
                    </div>
                    
                    </div>

                 
                  </div>
                </div>

                <div className='col-6' >
                  <div className='asdf'  >
                    <div className='d-flex justify-content-between' > 
                      <div >

                      <p className="asdfps">Edits</p>
                      <p className="">(Total)</p>
                      </div>

                        <p className="asdfps" style={{ textAlign : 'end' , color : "#316AAF"}}>22</p>
                    </div> 

                    <div className='d-flex justify-content-between mt-5' >
                      <img src="rts.png" alt="Example Image" />
                      <p className="asdfps">(# of meals sent between
                        specific time slots) </p>
                    </div>
                  </div>
                </div>

            </div> */}

            <div className='row ' >

              <div className='col-6' >
                <div class="box">
                  <div class="boxs">
                    <p className='asdfp'>Meals received - timeline</p>
                    <div class="end-box">
                      <img src="rts.png" className="" alt="Example Image" />
                      <p className="asdfps">(# of meals sent between specific time slots) </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className='col-6' >
                <div class="box">
                  <div class="boxs">
                    <div className="d-flex justify-content-between" >
                      <div >
                        <p className='asdfp' style={{ marginBottom: 0 }}>Meals received - timeline</p>
                        <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Total)</p>
                      </div>
                      <div >
                        <p className='asdfp' style={{ color: '#316AAF' }}>22</p>
                      </div>
                    </div>

                    <div class="end-box">
                      <img src="ert.png" className="" alt="Example Image" />
                      <div className='' >


                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Edited</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>


                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Moved</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>

                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Deleted</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>

                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Table moved</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>

                      </div>






                    </div>
                  </div>
                </div>
              </div>


            </div>

            <div className='row mt-5' >

              <div className='col-6' >
                <div class="box">
                  <div class="boxs">
                    <p className='asdfp'>Meals received - timeline</p>
                    <div class="end-box">
                      <img src="rts.png" className="" alt="Example Image" />
                      <p className="asdfps">(# of meals sent between specific time slots) </p>
                    </div>
                  </div>
                </div>
              </div>


              <div className='col-6' >
                <div class="box">
                  <div class="boxs">
                    <div className="d-flex justify-content-between" >
                      <div >
                        <p className='asdfp' style={{ marginBottom: 0 }}>Meals received - timeline</p>
                        <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Total)</p>
                      </div>
                      <div >
                        <p className='asdfp' style={{ color: '#316AAF' }}>22</p>
                      </div>
                    </div>

                    <div class="end-box">
                      <img src="ert.png" className="" alt="Example Image" />
                      <div className='' >


                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Edited</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>


                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Moved</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>

                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Deleted</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>

                        <div className="d-flex" style={{ marginBottom: 0 }}  >
                          <div className=' ' style={{ width: 200 }}>
                            <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Table moved</p>
                          </div>
                          <div className=' ' style={{ fontWeight: '600' }}>
                            <p style={{ marginBottom: 0, paddingLeft: 30, }} >5</p>
                          </div>
                        </div>

                      </div>






                    </div>
                  </div>
                </div>
              </div>


            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Meals;


