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

  //parse meals
  let [meals, setMeals] = useState(1)


  //edit
  let [editall, setEditall] = useState([])
  let [editallone, setEditallone] = useState([])
  let [served, setServed] = useState([])
  let [servedone, setServedone] = useState([])

  //refund meals
  let [minperday, setMinperday] = useState([])
  let [maxperday, setMaxperday] = useState([])

  let [alldrop, setAlldrop] = useState([])

  useEffect(() => {

    getone()
    getonez()

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

          console.log("Events between dates:", cleanedData);


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

          console.log(optionstakeaway, 'kitchen2Datakitchen2Datakitchen2Data')
          setFulldatafull([
            {
              "value": "Appetizers",
              "label": "Appetizers"
            },
            {
              "value": "Kids",
              "label": "Kids"
            },
            {
              "value": "Entrees",
              "label": "Entrees"
            },
            {
              "value": "Mains",
              "label": "Mains"
            },
            {
              "value": "Desserts",
              "label": "Desserts"
            },
          ])
          // setFulldatafull(optionstakeaway)
          // setBasicone(optionsstwo)

        } else {
          console.log("No events found between the dates.");
        }
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
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

          setAlldrop(result)
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

  let [fulldatafull, setFulldatafull] = useState()

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

      let refundcount = processRefundedItems(one)
      let refundcounttwo = processRefundedItems(two)
      setMinperday(refundcount)
      setMaxperday(refundcounttwo)




    }
  }

  let navigate = useNavigate();



  //.select options venue

  const [venueradio, setVenueradio] = useState(false)

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
    console.log(JSON.stringify(fulldatatwo), 'selected')

    setSelectedOptions(selected || []);

    filterDataByDate(dateRange, onetime, twotime, selected, hubb, selectedCources, selectedTakeaway)

    filterDataByDateonee(dateRangetwo, threetime, fourtime, selected, hubb, selectedCources, selectedTakeaway)

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




  //.select options hub

  const [Hubradio, setHubradio] = useState(false)
  const optionshub = [
    { value: 'R', label: 'On Process' },
    { value: 'H', label: 'On Hold' },
    { value: 'P', label: 'On Pass' },
    { value: 'S', label: 'Served' },
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

    filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selected, selectedTakeaway)

    filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selected, selectedTakeaway)


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

    filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selected)

    filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selected)

  };

  //times
  let [onetime, setOnetime] = useState('')
  let [twotime, setTwotime] = useState('')
  let [threetime, setThreetime] = useState('')
  let [fourtime, setFourtime] = useState('')

  //input value
  let [inputvalue, setInputvalue] = useState()
  let [inputvaluetwo, setInputvaluetwo] = useState()






  let ggggrt = () => {
    let kkki = 0
    served?.map((reee) => {

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



  function filterDataByDate(vals, time, time2, val21, val22, cources, takeaway) {

    let alldat = basicall

    console.log(val22, 'val22')

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
        // Convert startTime and endTime (e.g. "16:23", "20:05") to comparable Date objects
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(startHours);
        startDate.setMinutes(startMinutes);
        startDate.setSeconds(0);  // Make sure seconds are zero for comparison

        const [endHours, endMinutes] = endTime.split(":").map(Number);
        const endDate = new Date();
        endDate.setHours(endHours);
        endDate.setMinutes(endMinutes);
        endDate.setSeconds(0);  // Make sure seconds are zero for comparison

        // Function to process STAMP and filter based on time range
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

                  // Convert the time to a comparable Date object
                  const hours = parseInt(timeStr.substring(0, 2), 10);
                  const minutes = parseInt(timeStr.substring(2, 4), 10);
                  const stampDate = new Date();
                  stampDate.setHours(hours);
                  stampDate.setMinutes(minutes);
                  stampDate.setSeconds(0);  // Make sure seconds are zero for comparison

                  // Check if the time is within the range
                  return stampDate >= startDate && stampDate <= endDate;
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

      console.log(alldddd, 'three')
    }

    if (val21.length != 0) {
      const filteredData = {};

      val21.forEach(filter => {
        const key = filter.value;
        if (alldat[key]) {
          filteredData[key] = alldat[key];
        }
      });

      alldat = filteredData

      console.log(filteredData, 'four')

    }

    if (val22 === undefined || val22 === "") {



    } else {
      function filterDataByDynamicKey(key) {
        // Split the key into top-level key and hub name
        const [topLevelKey, hubName] = key.split('-');

        // Initialize an empty object for the filtered result
        const filteredData = {};

        // Check if the top-level key exists in the data
        if (alldat[topLevelKey]) {
          filteredData[topLevelKey] = {};

          // Loop through each second-level key (e.g., "GreenbankServicesClubecall")
          for (const secondLevelKey in alldat[topLevelKey]) {
            if (alldat[topLevelKey].hasOwnProperty(secondLevelKey)) {
              // Check if the second-level key contains the hub name
              if (alldat[topLevelKey][secondLevelKey][hubName]) {
                // Add the filtered data for that second-level key and hub name
                filteredData[topLevelKey][secondLevelKey] = {
                  [hubName]: alldat[topLevelKey][secondLevelKey][hubName]
                };
              }
            }
          }
        }

        return filteredData;
      }

      alldat = filterDataByDynamicKey(val22)

      console.log(alldat, 'five')

    }

    if (cources.length != 0) {


      function filterByNote(filters) {
        const allowedNotes = filters.map(f => f.value); // Extract values from filter array
        const result = {};

        function filterItems(items) {
          return items.filter(item => allowedNotes.includes(item.NOTE));
        }

        function traverse(obj) {
          if (Array.isArray(obj)) {
            return obj.map(traverse).filter(entry => entry && entry.length > 0);
          } else if (typeof obj === "object" && obj !== null) {
            let newObj = {};
            for (let key in obj) {
              if (key === "ITEMS" && Array.isArray(obj[key])) {
                let filteredItems = filterItems(obj[key]);
                if (filteredItems.length > 0) {
                  newObj[key] = filteredItems;
                }
              } else {
                let value = traverse(obj[key]);
                if (value && Object.keys(value).length > 0) {
                  newObj[key] = value;
                }
              }
            }
            return Object.keys(newObj).length > 0 ? newObj : null;
          }
          return obj;
        }

        Object.keys(alldat).forEach(key => {
          let filtered = traverse(alldat[key]);
          if (filtered && Object.keys(filtered).length > 0) {
            result[key] = filtered;
          }
        });

        return result;
      }


      alldat = filterByNote(cources)

      console.log(alldat, 'six')



    }

    if (takeaway.length != 0) {

      function filterByNote(filters) {
        const allowedNotes = filters.map(f => f.value); // Extract values from filter array
        const regex = new RegExp(allowedNotes.join("|"), "i"); // Create regex pattern for filtering

        function traverse(obj) {
          if (Array.isArray(obj)) {
            return obj.map(traverse).filter(entry => entry !== null);
          } else if (typeof obj === "object" && obj !== null) {
            let newObj = {};
            let hasMatch = false;

            for (let key in obj) {
              if (key === "NOTE" && typeof obj[key] === "string" && regex.test(obj[key])) {
                hasMatch = true;
              } else {
                let value = traverse(obj[key]);
                if (value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
                  newObj[key] = value;
                  hasMatch = true;
                }
              }
            }

            return hasMatch ? newObj : null;
          }
          return obj;
        }

        let result = {};
        Object.keys(alldat).forEach(key => {
          let filtered = traverse(alldat[key]);
          if (filtered && Object.keys(filtered).length > 0) {
            result[key] = filtered;
          }
        });

        return result;
      }


      alldat = filterByNote(takeaway)

      console.log(alldat, 'seven')

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





    console.log(filteredData, 'eight')

    function isObjectEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    if (isObjectEmpty(filteredData)) {

    } else {

      callfordataone(filteredData)

    }


  }


  function filterDataByDateonee(vals, time, time2, val21, val22, cources, takeaway) {

    let alldat = basicall

    console.log(val22, 'val22')

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
        // Convert startTime and endTime (e.g. "16:23", "20:05") to comparable Date objects
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(startHours);
        startDate.setMinutes(startMinutes);
        startDate.setSeconds(0);  // Make sure seconds are zero for comparison

        const [endHours, endMinutes] = endTime.split(":").map(Number);
        const endDate = new Date();
        endDate.setHours(endHours);
        endDate.setMinutes(endMinutes);
        endDate.setSeconds(0);  // Make sure seconds are zero for comparison

        // Function to process STAMP and filter based on time range
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

                  // Convert the time to a comparable Date object
                  const hours = parseInt(timeStr.substring(0, 2), 10);
                  const minutes = parseInt(timeStr.substring(2, 4), 10);
                  const stampDate = new Date();
                  stampDate.setHours(hours);
                  stampDate.setMinutes(minutes);
                  stampDate.setSeconds(0);  // Make sure seconds are zero for comparison

                  // Check if the time is within the range
                  return stampDate >= startDate && stampDate <= endDate;
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

      console.log(alldddd, 'three')
    }

    if (val21.length != 0) {
      const filteredData = {};

      val21.forEach(filter => {
        const key = filter.value;
        if (alldat[key]) {
          filteredData[key] = alldat[key];
        }
      });

      alldat = filteredData

      console.log(filteredData, 'four')

    }

    if (val22 === undefined || val22 === "") {



    } else {
      function filterDataByDynamicKey(key) {
        // Split the key into top-level key and hub name
        const [topLevelKey, hubName] = key.split('-');

        // Initialize an empty object for the filtered result
        const filteredData = {};

        // Check if the top-level key exists in the data
        if (alldat[topLevelKey]) {
          filteredData[topLevelKey] = {};

          // Loop through each second-level key (e.g., "GreenbankServicesClubecall")
          for (const secondLevelKey in alldat[topLevelKey]) {
            if (alldat[topLevelKey].hasOwnProperty(secondLevelKey)) {
              // Check if the second-level key contains the hub name
              if (alldat[topLevelKey][secondLevelKey][hubName]) {
                // Add the filtered data for that second-level key and hub name
                filteredData[topLevelKey][secondLevelKey] = {
                  [hubName]: alldat[topLevelKey][secondLevelKey][hubName]
                };
              }
            }
          }
        }

        return filteredData;
      }

      alldat = filterDataByDynamicKey(val22)

      console.log(alldat, 'five')

    }

    if (cources.length != 0) {


      function filterByNote(filters) {
        const allowedNotes = filters.map(f => f.value); // Extract values from filter array
        const result = {};

        function filterItems(items) {
          return items.filter(item => allowedNotes.includes(item.NOTE));
        }

        function traverse(obj) {
          if (Array.isArray(obj)) {
            return obj.map(traverse).filter(entry => entry && entry.length > 0);
          } else if (typeof obj === "object" && obj !== null) {
            let newObj = {};
            for (let key in obj) {
              if (key === "ITEMS" && Array.isArray(obj[key])) {
                let filteredItems = filterItems(obj[key]);
                if (filteredItems.length > 0) {
                  newObj[key] = filteredItems;
                }
              } else {
                let value = traverse(obj[key]);
                if (value && Object.keys(value).length > 0) {
                  newObj[key] = value;
                }
              }
            }
            return Object.keys(newObj).length > 0 ? newObj : null;
          }
          return obj;
        }

        Object.keys(alldat).forEach(key => {
          let filtered = traverse(alldat[key]);
          if (filtered && Object.keys(filtered).length > 0) {
            result[key] = filtered;
          }
        });

        return result;
      }


      alldat = filterByNote(cources)

      console.log(alldat, 'six')



    }

    if (takeaway.length != 0) {

      function filterByNote(filters) {
        const allowedNotes = filters.map(f => f.value); // Extract values from filter array
        const regex = new RegExp(allowedNotes.join("|"), "i"); // Create regex pattern for filtering

        function traverse(obj) {
          if (Array.isArray(obj)) {
            return obj.map(traverse).filter(entry => entry !== null);
          } else if (typeof obj === "object" && obj !== null) {
            let newObj = {};
            let hasMatch = false;

            for (let key in obj) {
              if (key === "NOTE" && typeof obj[key] === "string" && regex.test(obj[key])) {
                hasMatch = true;
              } else {
                let value = traverse(obj[key]);
                if (value && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0)) {
                  newObj[key] = value;
                  hasMatch = true;
                }
              }
            }

            return hasMatch ? newObj : null;
          }
          return obj;
        }

        let result = {};
        Object.keys(alldat).forEach(key => {
          let filtered = traverse(alldat[key]);
          if (filtered && Object.keys(filtered).length > 0) {
            result[key] = filtered;
          }
        });

        return result;
      }


      alldat = filterByNote(takeaway)

      console.log(alldat, 'seven')

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





    console.log(filteredData, 'eight')

    function isObjectEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    if (isObjectEmpty(filteredData)) {

    } else {

      callfordataonetwo(filteredData)

    }


  }




  let callfordataone = (one) => {




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

    let editttsone = categorizeItems(one)
    // let editttstwo = categorizeItems(two)

    console.log(editttsone, 'editttsoneeditttsone')


    setEditall(editttsone)
    // setEditallone(editttstwo)

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


    let minnscount = processItems(one)
    // let maxnscount = processItems(two)
    setServed(minnscount)
    // setServedone(maxnscount)

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

    let refundcount = processRefundedItems(one)
    // let refundcounttwo = processRefundedItems(two)
    setMinperday(refundcount)
    // setMaxperday(refundcounttwo)




  }

  let callfordataonetwo = (two) => {




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

    // let editttsone = categorizeItems(one)
    let editttstwo = categorizeItems(two)

    // console.log(editttsone, 'editttsoneeditttsone')


    // setEditall(editttsone)
    setEditallone(editttstwo)

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


    // let minnscount = processItems(one)
    let maxnscount = processItems(two)
    // setServed(minnscount)
    setServedone(maxnscount)

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

    // let refundcount = processRefundedItems(one)
    let refundcounttwo = processRefundedItems(two)
    // setMinperday(refundcount)
    setMaxperday(refundcounttwo)




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


  return (
    <div>
      <Header name={"Meals"} center={"Name"} />
      <div style={{ backgroundColor: "#DADADA", height: '100vh' }} >

        <div style={{}} className="dddd"  >

          <div className="d-flex justify-content-between  pt-4" >

            <div >
              <p onClick={() => {

                checkkkk()

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
                      filterDataByDate(update, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway)



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

                      filterDataByDate(dateRange, e.target.value, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway)


                    }}
                  />
                  <input
                    className='inputttt'
                    type="time"
                    value={twotime}
                    onChange={(e) => {
                      setTwotime(e.target.value)
                      // tiemstampp(2, e.target.value)

                      filterDataByDate(dateRange, onetime, e.target.value, selectedOptions, hubb, selectedCources, selectedTakeaway)

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
                      // updates(2, update)

                      filterDataByDateonee(update, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway)


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

                      filterDataByDateonee(dateRangetwo, e.target.value, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway)


                    }}
                  />
                  <input
                    className='inputttt'
                    type="time"
                    value={fourtime}
                    onChange={(e) => {
                      setFourtime(e.target.value)
                      filterDataByDateonee(dateRangetwo, threetime, e.target.value, selectedOptions, hubb, selectedCources, selectedTakeaway)
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
                  filterDataByDate(dateRange, onetime, twotime, selectedOptions, e.target.value, selectedCources, selectedTakeaway)


                  filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, e.target.value, selectedCources, selectedTakeaway)


                  console.log(e.target.value)
                }} name="cars" id="cars" style={{ border: 'unset', color: '#707070' }} >
                  <option value="">Select</option>
                  {basicone?.map(item => (
                    <option value={item.value}>{item.label}</option>
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


          {
            meals === 1 ?
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
                    <div class="box " onClick={() => {
                      setMeals(5)
                    }} >
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
                    <div class="box" onClick={() => {
                      setMeals(2)
                    }}>
                      <div class="boxs">
                        <div className="d-flex justify-content-between" >
                          <div >
                            <p className='asdfp' style={{ marginBottom: 0 }}>Edits</p>
                            <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Total)</p>
                          </div>
                          <div >
                            <p className='asdfp' style={{ color: '#316AAF' }}>{parseInt(editall?.edited?.length)
                              + parseInt(editall?.moved?.length) + parseInt(editall?.deleted?.length) + parseInt(editall?.tableMoved?.length) || 0}</p>
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
                                <p style={{ marginBottom: 0, paddingLeft: 30, }} >{editall?.edited?.length || 0}</p>
                              </div>
                            </div>


                            <div className="d-flex" style={{ marginBottom: 0 }}  >
                              <div className=' ' style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Moved</p>
                              </div>
                              <div className=' ' style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30, }} >{editall?.moved?.length || 0}</p>
                              </div>
                            </div>

                            <div className="d-flex" style={{ marginBottom: 0 }}  >
                              <div className=' ' style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Deleted</p>
                              </div>
                              <div className=' ' style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30, }} >{editall?.deleted?.length || 0}</p>
                              </div>
                            </div>

                            <div className="d-flex" style={{ marginBottom: 0 }}  >
                              <div className=' ' style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Table moved</p>
                              </div>
                              <div className=' ' style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30, }} >{editall?.tableMoved?.length || 0}</p>
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
                    <div class="box" onClick={() => {
                      setMeals(3)
                    }} >
                      <div class="boxs">
                        <div className="d-flex justify-content-between" >
                          <div >
                            <p className='asdfp' style={{ marginBottom: 0 }}>Served meals</p>
                            <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Total)</p>
                          </div>
                          <div >
                            <p className='asdfp' style={{ color: '#316AAF' }}>{
                              served ?
                                ggggrt()
                                : 0
                            }</p>
                          </div>
                        </div>

                        <div class="end-box">
                          <img src="starr.png" className="" alt="Example Image" />
                          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }} className='' >

                            <div >




                              <div className="d-flex" style={{ marginBottom: 0 }}  >
                                <div className=' ' style={{ width: 200 }}>
                                  <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Most: <span style={{ fontWeight: '600' }} >{served[0]?.name || 0}</span></p>
                                </div>
                                <div className=' ' style={{ fontWeight: '600' }}>
                                  <p style={{ marginBottom: 0, paddingLeft: 30, }} >{served[0]?.count || 0}</p>
                                </div>
                              </div>


                              <div className="d-flex" style={{ marginBottom: 0 }}  >
                                <div className=' ' style={{ width: 200 }}>
                                  <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Less: <span style={{ fontWeight: '600' }} >{served[served.length - 1]?.name || ''}</span></p>
                                </div>
                                <div className=' ' style={{ fontWeight: '600' }}>
                                  <p style={{ marginBottom: 0, paddingLeft: 30, }} >{served[served.length - 1]?.count || 0}</p>
                                </div>
                              </div>
                            </div>
                          </div>






                        </div>
                      </div>
                    </div>
                  </div>


                  <div className='col-6' >
                    <div class="box"  onClick={() => {
                      setMeals(4)
                    }}>
                      <div class="boxs">
                        <div className="d-flex justify-content-between" >
                          <div >
                            <p className='asdfp' style={{ marginBottom: 0 }}>Refunded meals</p>
                            <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Total)</p>
                          </div>
                          <div >
                            <p className='asdfp' style={{ color: '#316AAF' }}>0</p>
                          </div>
                        </div>

                        <div class="end-box">
                          <img src="refundd.png" className="" alt="Example Image" />
                          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }} className='' >

                            <div >
                              <div className="d-flex" style={{ marginBottom: 0 }}  >
                                <div className=' ' style={{ width: 200 }}>
                                  <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Minimum per day</p>
                                </div>
                                <div className=' ' style={{ fontWeight: '600' }}>
                                  <p style={{ marginBottom: 0, paddingLeft: 30, }} >{minperday[minperday.length - 1]?.count || 0}</p>
                                </div>
                              </div>


                              <div className="d-flex" style={{ marginBottom: 0 }}  >
                                <div className=' ' style={{ width: 200 }}>
                                  <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Maximum per day</p>
                                </div>
                                <div className=' ' style={{ fontWeight: '600' }}>
                                  <p style={{ marginBottom: 0, paddingLeft: 30, }} >{minperday[0]?.count || 0}</p>
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


              : meals === 2 ?

                <div className="" style={{ marginTop: 100 }} >
                  <div className="" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                    <div className="d-flex justify-content-between" >
                      <div style={{}} className="d-flex " >
                        <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                          setMeals(1)
                        }} className="" alt="Example Image" />
                        <p style={{ fontWeight: '500', fontSize: 20, marginTop: -6, marginLeft: 10 }}>Edits</p>
                      </div>

                      <div >
                        <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={() => {

                        }} className="" alt="Example Image" />
                      </div>
                    </div>

                    <div style={{ marginTop: 50, padding: 20 }} >
                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >{
                            editall?.edited?.length
                            + editall?.deleted?.length
                            + editall?.moved?.length}</span></p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >{

                            editallone?.edited?.length
                            + editallone?.deleted?.length
                            + editallone?.moved?.length
                          }</span></p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                            {(() => {
                              let datd = editallone?.edited?.length
                                + editallone?.deleted?.length
                                + editallone?.moved?.length

                              let datdtwo = editall?.edited?.length
                                + editall?.deleted?.length
                                + editall?.moved?.length

                              let tot = ((datdtwo - datd) / datd) * 100

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

                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Edited</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.moved?.length}</p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Edited</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.moved?.length}  </p>
                        </div>
                        <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                            {(() => {
                              let datd = editallone?.moved?.length

                              let datdtwo = editall?.moved?.length

                              let tot = ((datdtwo - datd) / datd) * 100

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

                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Moved</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.edited?.length}</p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Moved</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.edited?.length}  </p>
                        </div>
                        <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                            {(() => {
                              let datd = editallone?.edited?.length

                              let datdtwo = editall?.edited?.length

                              let tot = ((datdtwo - datd) / datd) * 100

                              return <span >{tot.toFixed(2)+ "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{tot > 0 ? <img src="up_arw.png"
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

                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Deleted</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.deleted?.length}</p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Deleted</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.deleted?.length}  </p>
                        </div>
                        <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                            {(() => {
                              let datd = editallone?.deleted?.length

                              let datdtwo = editall?.deleted?.length

                              let tot = ((datdtwo - datd) / datd) * 100

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


                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Table moved</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.tableMoved?.length}</p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Table moved</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.tableMoved?.length}  </p>
                        </div>
                        <div style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                            {(() => {
                              let datd = editallone?.tableMoved?.length

                              let datdtwo = editall?.tableMoved?.length

                              let tot = ((datdtwo - datd) / datd) * 100

                              console.log(tot, 'nan')

                              return <span >{isNaN(tot) ? 0.00 : tot.toFixed(2) + "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{tot > 0 ? <img src="up_arw.png"
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


                    </div>





                  </div>
                </div>

                : meals === 3 ?
                <div className="" style={{ marginTop: 100 }} >
                  <div className="" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                    <div className="d-flex justify-content-between" >
                      <div style={{}} className="d-flex " >
                        <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                          setMeals(1)
                        }} className="" alt="Example Image" />
                        <p style={{ fontWeight: '500', fontSize: 20, marginTop: -6, marginLeft: 10 }}>Served meals</p>
                      </div>

                      <div >
                        <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={() => {

                        }} className="" alt="Example Image" />
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

                              let datdtwo =  ggggrts()

                              let tot = ((datd - datdtwo) / datdtwo) * 100

                              return <span >{tot.toFixed(2)+ "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{tot > 0 ? <img src="up_arw.png"
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

                      <div className="scroll" id="scrrrrol" style={{ height : 300 , overflowY : 'auto'  }} >

                     

                      {
                      served?.map((dfgh, index) => {
                        const correspondingErv = servedone?.[index]; // Get the corresponding item in the `ervedone` array

                        return (
                          <>
                            <div className="d-flex  ">

                              <div style={{ width : '33%' }}>
                                <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{dfgh?.name}</p>
                                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{dfgh?.count}</p>
                              </div>

                              {correspondingErv ? (
                                <div style={{ width : '33%' , textAlign : 'center' }}>
                                  <div >

                                  <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{correspondingErv?.name}</p>
                                  <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{correspondingErv?.count}</p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                <div style={{ width : '33%' }} >
                                  </div></>
                              )}

                              <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex' , width : '33%' ,    }}>
                                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                                  ( Total )
                                  <span>
                                    {(() => {
                                      const datd = dfgh?.count || 0; // Fallback to 0 if no data
                                      const datdtwo = correspondingErv?.count || 0; // Fallback to 0 if no data
 

                                      const tot = ((datd - datdtwo) / datdtwo) * 100;

                                      return (
                                        <span>
                                          {tot.toFixed(2)+ "%"}
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


                <div className="" style={{ marginTop: 100 }} >
                  <div className="" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                    <div className="d-flex justify-content-between" >
                      <div style={{}} className="d-flex " >
                        <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                          setMeals(1)
                        }} className="" alt="Example Image" />
                        <p style={{ fontWeight: '500', fontSize: 20, marginTop: -6, marginLeft: 10 }}>Refunded meals</p>
                      </div>

                      <div >
                        <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={() => {

                        }} className="" alt="Example Image" />
                      </div>
                    </div>

                    <div style={{ marginTop: 50, padding: 20 }} >
                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >{
                            ggggrtsg()}</span></p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >{

                              ggggrtsgg()
                          }</span></p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) <span >
                            {(() => {
                              let datd = ggggrtsg()

                              let datdtwo = ggggrtsgg()

                              let tot = ((datd - datdtwo) / datdtwo) * 100

                              return <span >{ isNaN(tot) ? 0 :  tot.toFixed(2)+"%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{ isNaN(tot)  ? 
                                '%' :   tot > 0 ? <img src="up_arw.png"
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

                      <div className="scroll" id="scrrrrol" style={{ height : 300 , overflowY : 'auto'  }} >

                     

                      {
                      minperday?.map((dfgh, index) => {
                        const correspondingErv = maxperday?.[index]; // Get the corresponding item in the `ervedone` array

                        return (
                          <>
                            <div className="d-flex  ">

                              <div style={{ width : '33%' }}>
                                <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{dfgh?.name}</p>
                                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{dfgh?.count}</p>
                              </div>

                              {correspondingErv ? (
                                <div style={{ width : '33%' , textAlign : 'center' }}>
                                  <div >

                                  <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{correspondingErv?.name}</p>
                                  <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{correspondingErv?.count}</p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                <div style={{ width : '33%' }} >
                                  </div></>
                              )}

                              <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex' , width : '33%' ,    }}>
                                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                                  ( Total )
                                  <span>
                                    {(() => {
                                      const datd = dfgh?.count || 0; // Fallback to 0 if no data
                                      const datdtwo = correspondingErv?.count || 0; // Fallback to 0 if no data
 

                                      const tot = ((datd - datdtwo) / datdtwo) * 100;

                                      return (
                                        <span>
                                          {tot.toFixed(2)+"%"}
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

                :

                <div className="" style={{ marginTop: 100 }} >
                <div className="" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                  <div className="d-flex justify-content-between" >
                    <div style={{}} className="d-flex " >
                      <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                        setMeals(1)
                      }} className="" alt="Example Image" />
                      <p style={{ fontWeight: '500', fontSize: 20, marginTop: -6, marginLeft: 10 }}>Meals received - timeline</p>
                    </div>

                    <div >
                      <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={() => {

                      }} className="" alt="Example Image" />
                    </div>
                  </div>

                  <div style={{ marginTop: 50, padding: 20 }} >
                   
  
                  </div>





                </div>
              </div>



          }



        </div>

      </div>
    </div>
  );
};

export default Meals;


