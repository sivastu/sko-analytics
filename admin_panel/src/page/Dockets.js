import React, { useEffect, useState, useRef } from "react";
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


import app from "./firebase";
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
    transform: 'translate(-50%, -50%)',
    border: '3px solid #ababab',
    borderRadius: '10px',
    width: '70%'
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');



let Dockets = () => {
  let [data, setData] = useState();
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [startDate, endDate] = dateRange;


  let [basicall, setBasicall] = useState()
  let [basic, setBasic] = useState()
  let [basicone, setBasicone] = useState([])

  let [hubb, setHubb] = useState([])
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

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  let [cval1, setcval1] = useState()
  let [cval2, setcval2] = useState()
  function openModal(finebyme, finebyme2) {
    console.log(finebyme, 'finebymefinebyme', finebyme2)
    setIsOpen(true);
    setcval1(finebyme)
    setcval2(finebyme2)
  }



  function afterOpenModal() {
    // references are now sync'd and can be accessed. 
  }

  function closeModal() {
    setIsOpen(false);
  }


  useEffect(() => {

    getone()
    getonez()

  }, [])

  let [onebar, setOneBar] = useState([])
  let [twobar, setTwobar] = useState([])
  let [optionbar, setOption] = useState([])





  const optionshshs = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'X-Axis Scrollable Bar Chart' },
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


  let [fulldatafull, setFulldatafull] = useState()

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


          function extractUniqueNotes(datad) {
            let uniqueNotes = new Set();

            for (let group in datad) {
              for (let location in datad[group]) {
                for (let section in datad[group][location]) {
                  for (let date in datad[group][location][section]) {
                    datad[group][location][section][date].forEach(order => {
                      order.ITEMS.forEach(item => {
                        if (item.NOTE) {
                          uniqueNotes.add(item.NOTE);
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

          let uuuk = extractUniqueNotes(cleanedData)
          setFulldatafull(uuuk)



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
          // setFulldatafull([
          //   {
          //     "value": "Appetizers",
          //     "label": "Appetizers"
          //   },
          //   {
          //     "value": "Kids",
          //     "label": "Kids"
          //   },
          //   {
          //     "value": "Entrees",
          //     "label": "Entrees"
          //   },
          //   {
          //     "value": "Mains",
          //     "label": "Mains"
          //   },
          //   {
          //     "value": "Desserts",
          //     "label": "Desserts"
          //   },
          // ])
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
        {<div class="switch-containers" style={{ marginRight: 4 }}>
          <input checked={isSelected}
            type="checkbox" id="switch3" />
          <label class="switch-label" for="switch3"></label>
        </div>}
        <span style={{ flexGrow: 1 }}>{data.label}</span>

      </div>
    );
  };
  const CustomMultiValue = () => null;


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

  const [selectedOptions, setSelectedOptions] = useState([]);


  const handleChange = (selected) => {
    console.log(JSON.stringify(fulldatatwo), 'selected')

    setSelectedOptions(selected || []);

    filterDataByDate(dateRange, onetime, twotime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    filterDataByDateonee(dateRangetwo, threetime, fourtime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

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

  const [Hubradio, setHubradio] = useState(true)
  const optionshub = [
    { value: 'R', label: 'On Process' },
    { value: 'H', label: 'On Hold' },
    { value: 'P', label: 'On Pass' },
    { value: 'S', label: 'Served' },
  ];

  const [selectedhubOptions, setSelectedhubOptions] = useState([]);


  const handleChangehub = (selected) => {
    setSelectedhubOptions(selected || []);

    filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)
    filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)

    // selectedhubOptions


  };


  const handleChangehubone = (selectedss) => {

    console.log(selectedss, 'selectedssselectedssselectedss')

    setHubb(selectedss)


    filterDataByDate(dateRange, onetime, twotime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


    filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)



  };


  //select cources hub
  const [Cources, setCources] = useState(true)
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

    filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


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

    filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)

    filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)

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



  function filterDataByDate(vals, time, time2, val21, val22, cources, takeaway, inone, intwo, alltype) {

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
        if (alldat[key]) {
          filteredData[key] = alldat[key];
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

      function filterDataByDynamicKeys(keysArray) {
        const filteredData = {};

        keysArray.forEach(({ value }) => {
          const [topLevelKey, hubName, secondTopLevelKey] = value.split('-');

          if (alldat[topLevelKey] && alldat[topLevelKey][secondTopLevelKey]) {
            const secondLevelData = alldat[topLevelKey][secondTopLevelKey];

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
      alldat = filterDataByDynamicKeys(val22)
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
                  let filteredItems = order.ITEMS.filter(item => validNotes.includes(item.NOTE));

                  if (filteredItems.length > 0) {
                    return { ...order, ITEMS: filteredItems };
                  }
                  return null;
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

    callfordataone(filteredData)
    let ghi = processTimeData(alldat)
    let kidshort = ghi.sort((a, b) => a.time.localeCompare(b.time));
    // Extract values into separate arrays
    let timeLabels = kidshort.map(entry => entry.time);
    let timeCounts = kidshort.map(entry => entry.count);

    setOption(timeLabels)
    setOneBar(timeCounts)

    console.log(JSON.stringify(ghi), 'thousand')



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

    // Convert to final array format
    return Object.keys(timeCounts)
      .sort((a, b) => a.localeCompare(b)) // Sort times in ascending order
      .map(time => ({ time, count: timeCounts[time] }));
  }


  function filterDataByDateonee(vals, time, time2, val21, val22, cources, takeaway, inone, intwo, alltype) {


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
        if (alldat[key]) {
          filteredData[key] = alldat[key];
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

      function filterDataByDynamicKeys(keysArray) {
        const filteredData = {};

        keysArray.forEach(({ value }) => {
          const [topLevelKey, hubName, secondTopLevelKey] = value.split('-');

          if (alldat[topLevelKey] && alldat[topLevelKey][secondTopLevelKey]) {
            const secondLevelData = alldat[topLevelKey][secondTopLevelKey];

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
      alldat = filterDataByDynamicKeys(val22)
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
                  let filteredItems = order.ITEMS.filter(item => validNotes.includes(item.NOTE));

                  if (filteredItems.length > 0) {
                    return { ...order, ITEMS: filteredItems };
                  }
                  return null;
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





    console.log(filteredData, 'eight')

    function isObjectEmpty(obj) {
      return Object.keys(obj).length === 0;
    }

    if (isObjectEmpty(filteredData)) {

    } else {

      callfordataonetwo(filteredData)

    }

    let ghi = processTimeData(alldat)

    let kidshort = ghi.sort((a, b) => a.time.localeCompare(b.time));

    // Extract values into separate arrays
    let timeLabels = kidshort.map(entry => entry.time);
    let timeCounts = kidshort.map(entry => entry.count);

    setTwobar(timeCounts)




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

            let fixedss = parseInt(startTimeFormatted.replace(":", ""), 10)

            if (fixedss > 2) {
              const start = new Date(`2000-01-01T${startTimeFormatted}:00`);
              const end = new Date(`2000-01-01T${endTimeFormatted}:00`);
              const processTime = Math.round((end - start) / 60000); // Convert milliseconds to minutes

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

              console.log(processTime , 'processTime  processTime ')

              // if( )

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



  const chartContainerRef = useRef(null);

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

  const [showDiv, setShowDiv] = useState(false);

  // Toggle the visibility of the div
  const handleToggleDiv = () => {
    setShowDiv(!showDiv);
  };

  const [showDivs, setShowDivs] = useState(false);

  // Toggle the visibility of the div
  const fsgdgfdfgdf = () => {
    console.log('gggggggggggggggggggggg')
    setShowDivs(!showDivs);
  };


  const [showDivss, setShowDivss] = useState(false);

  // Toggle the visibility of the div
  const handleToggleDivss = () => {
    setShowDivss(!showDivss);
  };


  const [showDivsss, setShowDivsss] = useState(false);

  // Toggle the visibility of the div
  const handleToggleDivsss = () => {
    setShowDivsss(!showDivsss);
  };

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
    doc.text("Test", 10, 10); // Add static text
  
    await doc.html(input, {
      callback: function (doc) {
        doc.save("output.pdf"); // Save after rendering
      },
      x: 10,
      y: 20,
      width: 190, // Fit content within page
      windowWidth: 1000, // Ensure full width capture
      autoPaging: "text",
      html2canvas: {  
        useCORS: true, // Handle cross-origin images
      },
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

    console.log('gggggggggggggggggggg')

  }

  let chartexportpdf = () => {

    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text('Hello, this is a sample PDF created with jsPDF!', 10, 10);

    // Optionally, you can add other content like images, tables, etc.
    // doc.addImage(imageData, 'JPEG', 10, 20, 180, 160);
    // doc.autoTable({ html: '#my-table' });

    // Save the PDF with a filename
    doc.save('sample.pdf');

    console.log('gggggggggggggggggggg')

  }

  let refundexportpdf = () => {

    const doc = new jsPDF();

    // Add some text to the PDF
    doc.text('Hello, this is a sample PDF created with jsPDF!', 10, 10);

    // Optionally, you can add other content like images, tables, etc.
    // doc.addImage(imageData, 'JPEG', 10, 20, 180, 160);
    // doc.autoTable({ html: '#my-table' });

    // Save the PDF with a filename
    doc.save('sample.pdf');

    console.log('gggggggggggggggggggg')

  }



  return (
    <div>
      <Header name={"Dockets"} center={"Name"} />
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
                      filterDataByDate(update, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)



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

                      filterDataByDate(dateRange, e.target.value, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


                    }}
                  />
                  <input
                    className='inputttt'
                    type="time"
                    value={twotime}
                    onChange={(e) => {
                      setTwotime(e.target.value)
                      // tiemstampp(2, e.target.value)

                      filterDataByDate(dateRange, onetime, e.target.value, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

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

                      filterDataByDateonee(update, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


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

                      filterDataByDateonee(dateRangetwo, e.target.value, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


                    }}
                  />
                  <input
                    className='inputttt'
                    type="time"
                    value={fourtime}
                    onChange={(e) => {
                      setFourtime(e.target.value)
                      filterDataByDateonee(dateRangetwo, threetime, e.target.value, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
                    }}
                  />
                </div>
              </div>



            </div>


            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen venue & hub</p>
              <div className="custom-inputoness d-flex justify-content-between" style={{
                width: 350, height: 45
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
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />
              </div>

              <div className="custom-inputoness d-flex justify-content-between mt-3" style={{
                width: 350,
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



                <Select
                  isDisabled={!hubbswitch}
                  isMulti
                  className="newoneonee"
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
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />






                {/* <select disabled={!hubbswitch} className="newoneonee" onChange={(e) => {
                  setHubb(e.target.value)
                  filterDataByDate(dateRange, onetime, twotime, selectedOptions, e.target.value, selectedCources, selectedTakeaway)


                  filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, e.target.value, selectedCources, selectedTakeaway)


                  console.log(e.target.value)
                }} name="cars" id="cars" style={{ border: 'unset', color: '#707070' }} >
                  <option value="">Select</option>
                  {basicone?.map(item => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select> */}

              </div>
            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by stages/courses</p>
              <div className="custom-inputoness d-flex justify-content-between" style={{
                width: 350,
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
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />
              </div>


              <div className="custom-inputoness d-flex justify-content-between mt-3" style={{
                width: 350,
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
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />
              </div>


            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by tables/takeaways</p>

              <div className="custom-inputoness d-flex justify-content-between gap-1" style={{ width: 350 }}>
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

                  filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, e.target.value, inputvaluetwo, selectedhubOptions)

                  filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, e.target.value, inputvaluetwo, selectedhubOptions)

                }} value={inputvalue} placeholder="0-100" style={{ width: '50%', border: 'unset' }} type="text" />


                <p style={{ fontSize: 19, display: 'contents' }} >|</p>


                <input onChange={(e) => {
                  setInputvaluetwo(e.target.value)
                  filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, e.target.value, selectedhubOptions)

                  filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, e.target.value, selectedhubOptions)
                }} value={inputvaluetwo} placeholder="200-399" style={{ width: '50%', border: 'unset' }} type="text" />
              </div>

              <div className="custom-inputoness d-flex justify-content-between mt-3" style={{
                width: 350,
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
                    control: (base) => ({ ...base, border: 'unset', color: '#707070' }),
                  }}
                />



              </div>



            </div>

          </div>


          {
            meals === 1 ?
              <div className="" style={{ marginTop: 100 }} >

                <div className='row '  >

                  {/* <div className='col-6' >
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
                  </div> */}


                  <div className='col-6' style={{ margin: 'auto' }} >
                    <div class="box" onClick={() => {
                      setMeals(2)
                    }}>
                      <div class="boxs">
                        <div className="d-flex justify-content-between" >
                          <div >
                            <p className='asdfp' style={{ marginBottom: 0 }}>Dockets completion time</p>
                            <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Average)</p>
                          </div>
                          <div >
                            <p className='asdfp' style={{ color: '#316AAF' }}>{editall?.stats?.averageProcessTime || 0}</p>
                          </div>
                        </div>

                        <div class="end-box">
                          <img src="time.png" style={{ width: 90, height: 106 }} className="" alt="Example Image" />
                          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }} className='' >

                            <div >
                              <div className="d-flex" style={{ marginBottom: 0 }}  >
                                <div className=' ' style={{ width: 200 }}>
                                  <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Minimum</p>
                                </div>
                                <div className=' ' style={{ fontWeight: '600' }}>
                                  <p style={{ marginBottom: 0, paddingLeft: 30, }} >{editall?.stats?.minProcessTime || 0}</p>
                                </div>
                              </div>


                              <div className="d-flex" style={{ marginBottom: 0 }}  >
                                <div className=' ' style={{ width: 200 }}>
                                  <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }} >Maximum</p>
                                </div>
                                <div className=' ' style={{ fontWeight: '600' }}>
                                  <p style={{ marginBottom: 0, paddingLeft: 30, }} >{editall?.stats?.maxProcessTime || 0}</p>
                                </div>
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
                    <div class="box " onClick={() => {
                      setMeals(5)
                    }} >
                      <div class="boxs">
                        <p className='asdfp'>Dockets received - timeline</p>
                        <div class="end-box">
                          <img src="rts.png" className="" alt="Example Image" />
                          <p className="asdfps">(# of dockets received
                            between specific time slots)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className='col-6' >
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
                  </div> */}


                  <div className='col-6' >
                    <div class="box" onClick={() => {
                      setMeals(4)
                    }}>
                      <div class="boxs">
                        <div className="d-flex justify-content-between" >
                          <div >
                            <p className='asdfp' style={{ marginBottom: 0 }}>Average completion - timeline</p>
                            <p className='asdfp' style={{ color: "#707070", fontSize: 16, fontWeight: '400' }} >(Total)</p>
                          </div>
                          <div >
                            {/* <p className='asdfp' style={{ color: '#316AAF' }}>{
                              minperday ?
                                ggggrtz()
                                : 0
                            }</p> */}
                          </div>
                        </div>

                        <div class="end-box">
                          <img src="bluee.png" className="" alt="Example Image" />
                          <p className="asdfps">(Average waiting time
                            between specific time slots)</p>


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
                        <p style={{ fontWeight: '500', fontSize: 20, marginTop: -6, marginLeft: 10 }}>Dockets completion time</p>
                      </div>

                      <div >
                        <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={handleToggleDiv} className="" alt="Example Image" />

                        {showDiv && (
                          <div
                            style={{
                              width: 200,
                              marginTop: '0px',
                              padding: '10px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                              position: 'absolute',
                              right: '3%'
                            }}
                          >
                            <p style={{ color: '#707070' }}>Export as</p>
                            <hr />
                            <p style={{ color: '#000', cursor: 'pointer' }} onClick={() => {
                              editexportpdf()
                            }}>PDFs</p>
                          </div>
                        )}


                      </div>
                    </div>

                    <div style={{ marginTop: 50, padding: 20 }} >
                      <div className="d-flex justify-content-between" >

                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span >{
                            editall?.stats?.averageProcessTime || 0}</span></p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>(Average) <span >{editallone?.stats?.averageProcessTime || 0}</span></p>
                        </div>
                        <div >
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
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

                      <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />










                      <div  className="scroll pdf-content" id="scrrrrol pdf-content" style={{ height: 300, overflowY: 'auto' }} >

                        <div  >

                        {
                          editall?.orders?.map((dfgh, index) => {
                            const correspondingErv = editallone?.orders?.[index]; // Get corresponding item from `two`

                            return (
                              <div key={index}>
                                <div className="d-flex gap-5">
                                  {/* Left Column */}
                                  <div style={{ width: "40%" }}>
                                    <div className="d-flex  " style={{}}>
                                      <p style={{ fontWeight: "700", color: "#000",   width: "60%" }}>
                                        {dfgh?.processtime + ". " || "N/A"} <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" }} >{dfgh?.date + " " + "[" +
                                          dfgh?.table + "]" + " " + dfgh?.starttime + " " + dfgh?.staff}</span>
                                      </p>

                                      <img
                                        onClick={() => { openModal(dfgh, correspondingErv) }}
                                        src="arrows.png"
                                        style={{ width: 10, height: 14, cursor: "pointer", marginRight: 10, marginTop: 13 }}
                                        alt="up arrow"
                                      />
                                    </div>

                                  </div>

                                  {/* Center Column */}
                                  {correspondingErv ? (
                                    <div style={{ width: "40%", }}>
                                      <div className="d-flex  " >
                                        <p style={{ fontWeight: "700", color: "#000",   width: "60%" }}>
                                          {correspondingErv?.processtime + ". " || "N/A"} <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" }} >{correspondingErv?.date + " " + "[" +
                                            correspondingErv?.table + "]" + " " + correspondingErv?.starttime + " " + correspondingErv?.staff} </span>
                                        </p>


                                        <img
                                          onClick={() => { openModal(dfgh, correspondingErv) }}
                                          src="arrows.png"
                                          style={{ width: 10, height: 14, cursor: "pointer", marginRight: 10, marginTop: 13 }}
                                          alt="up arrow"
                                        />
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
                                      width: "10%",
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

                                <hr style={{ margin: "0px 0px", backgroundColor: "black", height: 3 }} />
                              </div>
                            );
                          })
                        }
                        </div >





                      </div>




                    </div>





                  </div>

<div style={{ visibility : 'hidden' }}>
                  <div ref={pdfRef}  >

                        {
                          editall?.orders?.map((dfgh, index) => {
                            const correspondingErv = editallone?.orders?.[index]; // Get corresponding item from `two`

                            return (
                              <div key={index}>
                                <div className="d-flex gap-5">
                                  {/* Left Column */}
                                  <div style={{ width: "40%" }}>
                                    <div className="d-flex  " style={{}}>
                                      <p style={{ fontWeight: "700", color: "#000",   }}>
                                        {dfgh?.processtime + ". " || "N/A"} <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" }} >{dfgh?.date + " " + "[" +
                                          dfgh?.table + "]" + " " + dfgh?.starttime + " " + dfgh?.staff}</span>
                                      </p>
 
                                    </div>

                                  </div>

                                  {/* Center Column */}
                                  {correspondingErv ? (
                                    <div style={{ width: "40%", }}>
                                      <div className="d-flex  " >
                                        <p style={{ fontWeight: "700", color: "#000",  }}>
                                          {correspondingErv?.processtime + ". " || "N/A"} <span style={{ fontWeight: "400", color: "#000", marginBlock: "4px" }} >{correspondingErv?.date + " " + "[" +
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
                                      width: "10%",
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

                                <hr style={{ margin: "0px 0px", backgroundColor: "black", height: 3 }} />
                              </div>
                            );
                          })
                        }
                        </div >
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
                          <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={fsgdgfdfgdf} className="" alt="Example Image" />

                          {showDivs && (
                            <div
                              style={{
                                width: 200,
                                marginTop: '3px',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                position: 'absolute',
                                right: '3%'
                              }}
                            >
                              <p style={{ color: '#707070' }}>Export as</p>
                              <hr />
                              <p style={{ color: '#000', cursor: 'pointer' }} onClick={() => {
                                mealexportpdf()
                              }}>PDF</p>
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
                            <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={handleToggleDivss} className="" alt="Example Image" />

                            {showDivss && (
                              <div
                                style={{
                                  width: 200,
                                  marginTop: '0px',
                                  padding: '10px',
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                  position: 'absolute',
                                  right: '3%'
                                }}
                              >
                                <p style={{ color: '#707070' }}>Export as</p>
                                <hr />
                                <p style={{ color: '#000', cursor: 'pointer' }} onClick={() => {
                                  refundexportpdf()
                                }}>PDF</p>
                              </div>
                            )}
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

                                  return <span >{isNaN(tot) ? 0 : tot.toFixed(2) + "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{isNaN(tot) ?
                                    '%' : tot > 0 ? <img src="up_arw.png"
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
                              minperday?.map((dfgh, index) => {
                                const correspondingErv = maxperday?.[index]; // Get the corresponding item in the `ervedone` array

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
                            <img src="threedot.png" style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={handleToggleDivsss} className="" alt="Example Image" />

                            {showDivsss && (
                              <div
                                style={{
                                  width: 200,
                                  marginTop: '0px',
                                  padding: '10px',
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                  position: 'absolute',
                                  right: '3%'
                                }}
                              >
                                <p style={{ color: '#707070' }}>Export as</p>
                                <hr />
                                <p style={{ color: '#000', cursor: 'pointer' }} onClick={() => {
                                  chartexportpdf()
                                }}>PDF</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ marginTop: 50, padding: 20 }} >


                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Left Scroll Button */}
                            <button onClick={scrollLeft} style={buttonStyle}>⬅</button>

                            {/* Scrollable Chart Container */}
                            <div ref={chartContainerRef} className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                              <div style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                <Bar data={datafine} options={optionshshs} />
                              </div>
                            </div>

                            {/* Right Scroll Button */}
                            <button onClick={scrollRight} style={buttonStyle}>➡</button>
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
            <div className="col-5" style={{ overflow: 'hidden' }} >
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
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Completion time: </p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Docket #: {cval1?.order?.DOCKETID}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Table #: {cval1?.order?.TABLE}</p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} ># of courses: {cval1?.order?.COURSES}</p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} ># of meals: {cval1?.order?.ITEMS?.length}</p>

              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Waiter time: </p>
              <p style={{ fontWeight: '600', fontSize: 15, marginBottom: 30 }} >Header note: {cval1?.order?.NOTE}</p>

            </div>
            <div className="col-1"  >
              <div class="vertical-line"></div>
            </div>
            <div className="col-6 gggg" >
              <div style={{ height: 300 }}>

                <p style={{ fontWeight: '600', fontSize: 15, textAlign: 'center', marginBottom: 0 }}>Course 1 : {cval1?.order?.COURSES}</p>
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


                <p style={{ fontWeight: '600', fontSize: 15, textAlign: 'center', marginBottom: 0, marginTop: 30 }}>Course 2 : {cval2?.order?.COURSES}</p>
                <p style={{ fontWeight: '500', fontSize: 13, textAlign: 'center', color: "#707070" }}>Time: R: . | P: . | H: .</p>
                <div style={{ marginTop: 10 }}  >
                  {
                    cval2?.order?.ITEMS.map((kai, index) => {
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

export default Dockets;


