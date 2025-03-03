import React, { useEffect, useState, useRef , useContext } from "react";
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
import * as CryptoJS from 'crypto-js'
import XLSX from 'xlsx-js-style';
import { Chart, registerables } from "chart.js";
import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { DataContext } from "../component/DataProvider";

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

Chart.register(...registerables);
let Meals = () => {
  let [data, setData] = useState();
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [startDate, endDate] = dateRange;

  const pdfRef = useRef();
  const pdfRefss = useRef();
  const pdfRefsss = useRef();
  let [basicall, setBasicall] = useState()
  let [basic, setBasic] = useState()
  let [basicone, setBasicone] = useState([])

  let [hubb, setHubb] = useState([])
  let [hubbswitch, setHubbswitch] = useState(true)
  let [filterdataone, setFilterdataone] = useState({})
  let [filterdatatwo, setFilterdatatwo] = useState({})
  //parse meals
  let [meals, setMeals] = useState(1)
  let [optionbarone, setOptionone] = useState([])
  let [onebarone, setOneBarone] = useState([])

  const pdfRefred = useRef();
  //edit
  let [editall, setEditall] = useState([])
  let [editallone, setEditallone] = useState([])

  let [editallclone, setEditallclone] = useState([])
  let [editalloneclone, setEditalloneclone] = useState([])


  let [served, setServed] = useState([]) 
  let [servedone, setServedone] = useState([])

  //refund meals
  let [minperday, setMinperday] = useState([])
  let [maxperday, setMaxperday] = useState([])

  let [alldrop, setAlldrop] = useState([])

  ///old
  let [oldven, setOldven] = useState([])
  let [oldhub, setOldhub] = useState([])
  let [oldpro, setOldpro] = useState([])
  let [oldcou, setOldcou] = useState([])
  let [oldtak, setOldtak] = useState([])

  const { state } = useContext(DataContext);

  let [basicfine, setBasicfine] = useState([
    {
      "value": "Minimum",
      "label": "Minimum"
    },{
    "value": "Maximum",
    "label": "Maximum"
  },
  ,])

  let[isPdfLoad,setIsPdfLoad]=useState(false);
  let[isExcelLoad,setIsExcelLoad]=useState(false);

  const [selectedOptionsfine, setSelectedOptionsfine] = useState([basicfine[0]]);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [menuIsOpenone, setMenuIsOpenone] = useState(false);
  const [menuIsOpentwo, setMenuIsOpentwo] = useState(false);
  const [menuIsOpenthree, setMenuIsOpenthree] = useState(false);
  const [menuIsOpenfour, setMenuIsOpenfour] = useState(false);


  const selectRef = useRef(null);

  const selectRefone = useRef(null);
  const selectReftwo = useRef(null);
  const selectRefthree = useRef(null);
  const selectReffour = useRef(null);

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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
  let callfordataonesearch = (one, bitedata) => {


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


            if (processTime === parseInt(bitedata)) {

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


            if (processTime === parseInt(bitedata)) {
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
  let searchvalue = (e) => {
    console.log(editallclone, 'searchvaluesearchvaluesearchvalue')
 
    if (e === undefined || e === '' || e === null) {
      setServed(editallclone)
      setServedone(editalloneclone)
    } else {
      const regex = new RegExp(e, "i"); // Create regex dynamically (case-insensitive)


      // Filter items where ITEM matches regex
      const filteredData = editallclone.filter(obj => regex.test(obj.name));
      const filteredDatatwo = editalloneclone.filter(obj => regex.test(obj.name));

      setServed(filteredData)
      setServedone(filteredDatatwo)

      
    }

  }

  useEffect(() => {
    loginCheck(state?.user)
    getone(state?.data)
    // getonez()

  }, [])

  const getFormattedDate = (daysBefore) => {
    const date = new Date();
    date.setDate(date.getDate() - daysBefore);

    // Ensure time is set to match the expected format
    date.setUTCHours(18, 30, 0, 0);

    return date; // Return a Date object instead of a string
  };

  let [onebar, setOneBar] = useState([])
  let [twobar, setTwobar] = useState([])
  let [optionbar, setOption] = useState([])
  let [mydata, setMydata] = useState()


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
        setMydata(foundUser)
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


  const decrypt = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, 'secretKey')
    const plainText = bytes.toString(CryptoJS.enc.Utf8)
    return plainText

  }

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

  let [fulldatafull, setFulldatafull] = useState()

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
          let realven = []

          if (hasAllValue === true) {
            realven.push(...optionsone);
            setBasic(optionsone)


            let uuuk = extractUniqueNotes(cleanedData, optionsone)
            uuuk.unshift({ label: "All Courses", value: "All" });

            setFulldatafull(uuuk)

          } else {
            realven.push(parsedatajson.venue)
            setBasic(parsedatajson.venue)


            let uuuk = extractUniqueNotes(cleanedData, parsedatajson.venue)
            uuuk.unshift({ label: "All Courses", value: "All" });

            setFulldatafull(uuuk)
          }





          const kitchen2Data = cleanedData["ZushiGroup"]["ZushiBarangaroo"].Kitchen["2025-01-20"];
          const optionstakeaway = [
            ...new Set(kitchen2Data.map(item => item.NOTE)) // Extract unique values from the NOTE field
          ].map(value => ({ value, label: value }));


          console.log(optionstakeaway, 'kitchen2Datakitchen2Datakitchen2Data')





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
          setSelectedOptions(realven)
          // alldat = filteredDataonee
          const yesterday = [getFormattedDate(1), getFormattedDate(1)];
          const eightDaysBefore = [getFormattedDate(8), getFormattedDate(8)];
          setDateRangetwo(eightDaysBefore)
          setDateRange(yesterday)
          filterDataByDate(yesterday, onetime, twotime, realven, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

          filterDataByDateonee(eightDaysBefore, threetime, fourtime, realven, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

        
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
      setEditallclone(minnscount)
      setServedone(maxnscount)
      setEditalloneclone(maxnscount)

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
              name: refundedItems[0].ITEM, // Assuming all refunded items share the same name
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

      let finepa = refundcount.sort((a, b) => b.count - a.count)
      let finepaone = refundcounttwo.sort((a, b) => b.count - a.count)

      setMinperday(finepa)
      setMaxperday(finepaone)




    }
  }

  let navigate = useNavigate();



  //.select options venue

  const [venueradio, setVenueradio] = useState(true)

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
      const displayText = allLabels.slice(0, 18) + "..."

      return <span title={allLabels}>{displayText}</span>;
    }
    return null;
  };

  const [selectedOptions, setSelectedOptions] = useState([]);


  const handleChange = (selected) => {
    setMenuIsOpen(true)
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

      filterDataByDateonee(dateRangetwo, threetime, fourtime, [], hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

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

      filterDataByDateonee(dateRangetwo, threetime, fourtime, basic, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

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

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selected, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

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




  //.select options hub

  const [Hubradio, setHubradio] = useState(true)
  const optionshub = [{
    "label": "All Stages",
    "value": "All"
  },
  { value: 'R', label: 'On Process' },
  { value: 'H', label: 'On Hold' },
  { value: 'P', label: 'On Pass' },
  { value: 'S', label: 'Served' },
  ];

  const [selectedhubOptions, setSelectedhubOptions] = useState([]);
  const handleChangehub = (selected) => {
    setMenuIsOpentwo(true)
    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldpro.some(item => item.value === "All");

    setOldpro(selected)

    if (hasAllValue === false && hasAllValueold === true) {


      setSelectedhubOptions([]);
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, [])
      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, [])
      return

    }


    if (hasAllValue === true) {
      setSelectedhubOptions(optionshub);
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, optionshub)
      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, optionshub)

    } else {
      setSelectedhubOptions(selected || []);
      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)
      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selected)

    }


    // selectedhubOptions


  };


  const handleChangehubone = (selectedss) => {
    setMenuIsOpenone(true)

    const hasAllValue = selectedss.some(item => item.value === "All");
    const hasAllValueold = oldhub.some(item => item.value === "All");

    setOldhub(selectedss)

    if (hasAllValue === false && hasAllValueold === true) {

      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubb([])

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, [], selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      return
    }

    if (hasAllValue === true) {
      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubb(basicone)


      filterDataByDate(dateRange, onetime, twotime, selectedOptions, basicone, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, basicone, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    } else {
      console.log(selectedss, 'selectedssselectedssselectedss')

      setHubb(selectedss)


      filterDataByDate(dateRange, onetime, twotime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, selectedss, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

    }

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
    setMenuIsOpenthree(true)

    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldcou.some(item => item.value === "All");

    setOldcou(selected)

    if (hasAllValue === false && hasAllValueold === true) {

      setSelectedCources([]);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, [], selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, [], selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      return
    }

    if (hasAllValue === true) {

      setSelectedCources(fulldatafull);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, fulldatafull, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, fulldatafull, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)


    } else {
      setSelectedCources(selected || []);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selected, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
    }




  };


  //select takeaway
  const [takeaway, setTakeaway] = useState(true)
  const optionstakeaway = [
    { value: 'All', label: 'All takeaways' },
    { value: 'Takeaways', label: 'Takeaways' },
    { value: 'Deliveries', label: 'Deliveries' },
    { value: 'Pick-ups', label: 'Pick-ups' },
  ];
  const [selectedTakeaway, setSelectedTakeaway] = useState([]);
  const handleChangeTakeaway = (selected) => {
    setMenuIsOpenfour(true)
    const hasAllValue = selected.some(item => item.value === "All");
    const hasAllValueold = oldtak.some(item => item.value === "All");

    setOldtak(selected)

    if (hasAllValue === false && hasAllValueold === true) {

      setSelectedTakeaway([]);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, [], inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, [], inputvalue, inputvaluetwo, selectedhubOptions)

      return

    }

    if (hasAllValue === true) {
      setSelectedTakeaway(optionstakeaway);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, optionstakeaway, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, optionstakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
    } else {
      setSelectedTakeaway(selected || []);

      filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)

      filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selected, inputvalue, inputvaluetwo, selectedhubOptions)
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

  const handleChangefine = (selected) => {
    console.log(served, 'selected')

 

    if (served.length === 0) {

    } else {
      setServed((prevState) => [...prevState].reverse());

    }

    if (servedone.length === 0) {

    } else {
      setServedone((prevState) => [...prevState].reverse());


    }


    setSelectedOptionsfine(selected || []);


  };

  const handleChangefinedd = (selected) => { 

    if (minperday.length === 0) {

    } else {
      setMinperday((prevState) => [...prevState].reverse());
    }

    if (maxperday.length === 0) {

    } else {
      setMaxperday((prevState) => [...prevState].reverse());

    }


    setSelectedOptionsfine(selected || []);


  };


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
        for (const mainKey in alldat) {
          if (alldat[mainKey][key]) {
            if (!filteredData[mainKey]) {
              filteredData[mainKey] = {}; // Initialize if not exists
            }
            filteredData[mainKey][key] = alldat[mainKey][key];
          }
        }
      });

      // val21.forEach(filter => {
      //   const key = filter.value;
      //   if (alldat[key]) {
      //     filteredData[key] = alldat[key];
      //   }
      // });

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

      console.log(JSON.stringify(val22, 'val22val22'))
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


    console.log(alldat, 'elevenn elevennelevenn')
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

    console.log(ghi, 'ghighighi')

    let kidshort = ghi.sort((a, b) => a.time.localeCompare(b.time));

    // Extract values into separate arrays
    let timeLabels = kidshort.map(entry => entry.time);
    let timeCounts = kidshort.map(entry => entry.count);

    setOption(timeLabels)
    setOneBar(timeCounts)

    console.log(JSON.stringify(ghi), 'thousand')

    // console.log(filteredData, 'eight')

    // function isObjectEmpty(obj) {
    //   return Object.keys(obj).length === 0;
    // }

    // if (isObjectEmpty(filteredData)) {

    // } else {

    //   callfordataone(filteredData)

    // }


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
                  timeCounts[interval] = (timeCounts[interval] || 0) + order.ITEMS.length;
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
      .map(time => ({ time, count: timeCounts[time] })).slice(1);
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
    setEditallclone(minnscount)
    // setServedone(maxnscount)

    const processRefundedItems = (data) => {
      const results = [];

      // Iterate through each date's data
      for (const [date, entries] of Object.entries(data)) {
        let refundedItems = [];



        entries.forEach(entry => {
          entry.ITEMS.forEach(item => {
            // Check if "Refunded" exists in the ITEM field
            if (item?.NOTE?.includes("Refunded")) {
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
    let finepaone = refundcount.sort((a, b) => b.count - a.count)
    // let refundcounttwo = processRefundedItems(two)
    setMinperday(finepaone)
    console.log(refundcount, 'refundcountrefundcountrefundcount')
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
    setEditalloneclone(maxnscount)

    const processRefundedItems = (data) => {
      const results = [];

      // Iterate through each date's data
      for (const [date, entries] of Object.entries(data)) {
        let refundedItems = [];



        entries.forEach(entry => {
          entry.ITEMS.forEach(item => {
            // Ensure item.NOTE is defined before using includes()
            if (item.NOTE && item.NOTE.includes("Refunded")) {
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

    let finepaone = refundcounttwo.sort((a, b) => b.count - a.count)
    setMaxperday(finepaone)




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

    const yesterday = [getFormattedDate(1), getFormattedDate(1)];
    const eightDaysBefore = [getFormattedDate(8), getFormattedDate(8)];


    //one
    console.log(yesterday, '1')
    console.log(eightDaysBefore, '2')

    console.log(JSON.stringify(yesterday), '3')
    console.log(JSON.stringify(eightDaysBefore), '4')

    console.log(dateRange, '5')
    console.log(JSON.stringify(dateRange), '6')
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
        doc.save("output.pdf"); 
        setIsPdfLoad(false);// Save after rendering
      },
      x: 10,
      y: 20,
      width: 190, // Fit content within page
      windowWidth: 1000, // Ensure full width capture
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

  let mealexportpdf = async () => {
    const input = pdfRefss.current;



    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    await doc.html(input, {
      callback: function (doc) {
        doc.save("output.pdf"); 
        setIsPdfLoad(false)// Save after rendering
      },
      y: 10,
      width: 190, // Fit content within page
      windowWidth: 1000, // Ensure full width capture  
      margin: 10,


      autoPaging: "text",
      html2canvas: {
        useCORS: true, // Handle cross-origin images
      },
    })


  }
  let chartexportpdf = async () => {

    const input = pdfRefred.current;



    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    await doc.html(input, {
      callback: function (doc) {
        doc.save("output.pdf");
        setIsPdfLoad(false) // Save after rendering
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

  let refundexportpdf = async () => {


    const input = pdfRefsss.current;



    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    await doc.html(input, {
      callback: function (doc) {
        doc.save("output.pdf");
        setIsPdfLoad(false); // Save after rendering
      },
      x: 10,
      y: 20,
      width: 190, // Fit content within page
      windowWidth: 1000, // Ensure full width capture
      autoPaging: "text",
      html2canvas: {
        useCORS: true, // Handle cross-origin images
      },
    }).catch(() => {
      setIsPdfLoad(false);
  });

  }


  const downloadMealsExcel = async () => {
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
      
    // Define styles (enhanced styling)
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
    const chartElement = document.getElementById("chart-capture");
    
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
    saveAs(blob, "Meals_Received_Timeline.xlsx");
    setIsExcelLoad(false)
  };
  

  return (
    <div style={{overflowX:"hidden"}}>
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
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: -3 }} >MEALS</p>
            </div>
            <div style={{ padding: 13 }} className="d-flex text-center justify-content-center col" >
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", paddingLeft: 0, marginTop: -3 }} >
                {usedname}
              </p>
            </div>

            <div style={{ padding: 13 }} className="d-flex  justify-content-end col" >
              <img src="Menu_Logo.png" style={{ width: 56, height: 28 }} alt="Example Image" />
              <p style={{ fontSize: 20, fontWeight: '700', color: "#fff", marginLeft: 10, marginTop: 0 }} >analytics</p>
            </div>

          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#DADADA", height: '100vh', }} className="finefinrr hide-scrollbar">

        <div style={{}} className="dddd hide-scrollbar"  >
        <div className="container-fluid px-0">
  <div className="d-flex flex-wrap justify-content-around pt-4 gap-4">
    {/* Date Range 1 */}
    <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
      <p onClick={() => {checkkkk()}} style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
        Chosen range:<span style={{ fontWeight: '400' }}> Custom</span>
      </p>
      <div style={{ width: '100%' }}>
      <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  style={{ fontSize: 15 }}
                  onChange={(update) => {

                    console.log(update, 'update')
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
            style={{ fontSize: 15, color: '#1A1A1B' }}
            value={onetime}
            onChange={(e) => {
              setOnetime(e.target.value)
              if (dateRange.length === 0 || dateRange === undefined || dateRange === null || dateRange[0] === null || dateRange[1] === null) {
                return
              }
              filterDataByDate(dateRange, e.target.value, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
            }}
          />
          <input
            className='inputttt'
            type="time"
            value={twotime}
            style={{ fontSize: 15, color: '#1A1A1B' }}
            onChange={(e) => {
              setTwotime(e.target.value)
              if (dateRange.length === 0 || dateRange === undefined || dateRange === null || dateRange[0] === null || dateRange[1] === null) {
                return
              }
              filterDataByDate(dateRange, onetime, e.target.value, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
            }}
          />
        </div>
      </div>
    </div>

    {/* Date Range 2 - Comparison */}
    <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
      <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>
        Compare with:<span style={{ fontWeight: '400' }}> Custom</span>
      </p>
      <div style={{ width: '100%' }}>
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
                    <div className="custom-display-input" style={{ fontSize: 15, color: '#1A1A1B' }}>
                      {startDatetwo || endDatetwo ? formatRange(startDatetwo, endDatetwo) : "Select a date range"}
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
            style={{ fontSize: 15, color: '#1A1A1B' }}
            value={threetime}
            onChange={(e) => {
              setThreetime(e.target.value)
              if (dateRangetwo.length === 0 || dateRangetwo === undefined || dateRangetwo === null || dateRangetwo[0] === null || dateRangetwo[1] === null) {
                return
              }
              filterDataByDateonee(dateRangetwo, e.target.value, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
            }}
          />
          <input
            className='inputttt'
            type="time"
            style={{ fontSize: 15, color: '#1A1A1B' }}
            value={fourtime}
            onChange={(e) => {
              setFourtime(e.target.value)
              if (dateRangetwo.length === 0 || dateRangetwo === undefined || dateRangetwo === null || dateRangetwo[0] === null || dateRangetwo[1] === null) {
                return
              }
              filterDataByDateonee(dateRangetwo, threetime, e.target.value, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, inputvaluetwo, selectedhubOptions)
            }}
          />
        </div>
      </div>
    </div>

    {/* Venue & Hub Filters */}
    <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
      <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>Chosen venue & hub</p>
      <div ref={selectRef} className="custom-inputoness d-flex justify-content-between" style={{ width: '100%', height: 45,  borderRadius: menuIsOpen ? ' 8px 8px 0 0' : '8px',    border:menuIsOpen?'2px solid #707070':'none',borderBottom:'none'  }}>
        <div className="switch-container">
          <input 
            type="checkbox" 
            id="switch1" 
            style={{ fontSize: 15 }} 
            checked={venueradio} 
            onChange={(e) => {
              setVenueradio(e.target.checked)
              if (e.target.checked === false) {
                setSelectedOptions([])
              }
              
              
              else{



                handleChange([...selectedOptions , ...[{
                  "label": "All Venue",
                  "value": "All"
              }]])
                console.log(selectedOptions , 'selectedOptions')
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
          className="newoneonee"
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
              outline: 'none', 
              boxShadow: state.isFocused ? 'none' : 'none',
              border:'none'
            }),
            menu: (base) => ({
              ...base,
              minWidth:'calc(100% + 72px)',
             marginLeft:'-60px',
          border:menuIsOpen?'black':'none',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              border:menuIsOpen?'2px solid #707070':'none',
              borderTop:'none'
            }),
          }}
        />
      </div>

      <div ref={selectRefone} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45 ,  borderRadius: menuIsOpenone ? ' 8px 8px 0 0' : '8px',    border:menuIsOpenone?'2px solid #707070':'none',borderBottom:'none' }}>
        <div className="switch-container">
          <input 
            checked={hubbswitch} 
            onChange={(e) => {
              setHubbswitch(e.target.checked)

              if (e.target.checked === false) {
                setHubb([])
              }else{
                handleChangehubone([...hubb , ...[{
                  "label": "All Hub",
                  "value": "All"
              }]]) 
              }


            }} 
            type="checkbox" 
            id="switch3" 
          />
          <label className="switch-label" htmlFor="switch3"></label>
        </div>
        <Select
          menuIsOpen={menuIsOpenone}
          onMenuOpen={() => setMenuIsOpenone(true)}
          onMenuClose={() => setMenuIsOpenone(false)}
          onFocus={() => setMenuIsOpenone(true)}
          isDisabled={!hubbswitch}
          isMulti
          className="newoneonee"
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
              outline: 'none', 
              boxShadow: state.isFocused ? 'none' : 'none',
              border:'none'
            }),
            menu: (base) => ({
              ...base,
              minWidth:'calc(100% + 72px)',
             marginLeft:'-60px',
          border:menuIsOpenone?'black':'none',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              border:menuIsOpenone?'2px solid #707070':'none',
              borderTop:'none'
            }),
          }}
        />
      </div>
    </div>

    {/* Stages/Courses Filters */}
    <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
      <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>Filter by stages/courses</p>
      <div ref={selectReftwo} className="custom-inputoness d-flex justify-content-between" style={{ width: '100%', height: 45,  borderRadius: menuIsOpentwo ? ' 8px 8px 0 0' : '8px',    border:menuIsOpentwo?'2px solid #707070':'none',borderBottom:'none'  }}>
        <div className="switch-container">
          <input 
            type="checkbox" 
            checked={Hubradio} 
            onChange={(e) => {
              setHubradio(e.target.checked)
              if (e.target.checked === false) {
                setSelectedhubOptions([])
              }else{
                handleChangehub([...selectedhubOptions , ...[{
                  "label": "All Stages",
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
          className="newoneonee"
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
              outline: 'none', 
              boxShadow: state.isFocused ? 'none' : 'none',
              border:'none'
            }),
            menu: (base) => ({
              ...base,
              minWidth:'calc(100% + 72px)',
             marginLeft:'-60px',
          border:menuIsOpentwo?'black':'none',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              border:menuIsOpentwo?'2px solid #707070':'none',
              borderTop:'none'
            }),
          }}
        />
      </div>

      <div ref={selectRefthree} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45,  borderRadius: menuIsOpenthree ? ' 8px 8px 0 0' : '8px',    border:menuIsOpenthree?'2px solid #707070':'none',borderBottom:'none'  }}>
        <div className="switch-container">
          <input 
            type="checkbox" 
            checked={Cources} 
            onChange={(e) => {
              setCources(e.target.checked)
              if (e.target.checked === false) {
                setSelectedCources([])
              }else{
                handleChangeCources([...selectedCources , ...[ { label: "All Courses", value: "All" } ]])
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
          className="newoneonee"
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
              outline: 'none', 
              boxShadow: state.isFocused ? 'none' : 'none',
              border:'none'
            }),
            menu: (base) => ({
              ...base,
              minWidth:'calc(100% + 72px)',
             marginLeft:'-60px',
          border:menuIsOpenthree?'black':'none',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              border:menuIsOpenthree?'2px solid #707070':'none',
              borderTop:'none'
            }),
          }}
        />
      </div>
    </div>

    {/* Tables/Takeaways Filters */}
    <div className="filter-container" style={{ width: 'calc(20% - 20px)', minWidth: '240px' }}>
      <p style={{ color: '#707070', fontWeight: '700', fontSize: 15, marginBottom: 2 }}>Filter by tables/takeaways</p>
      <div className="custom-inputoness d-flex justify-content-between gap-1" style={{ width: '100%' }}>
        <input
          onChange={(e) => {
            setInputvalue(e.target.value)
            filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, e.target.value, inputvaluetwo, selectedhubOptions)
            filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, e.target.value, inputvaluetwo, selectedhubOptions)
          }} 
          value={inputvalue} 
          placeholder="0-9999" 
          style={{ width: '50%', border: 'unset', fontSize: 15, color: '#1A1A1B', textAlign: 'center' }} 
          type="text" 
        />
        <p style={{ fontSize: 19, display: 'contents' }}>|</p>
        <input 
          onChange={(e) => {
            setInputvaluetwo(e.target.value)
            filterDataByDate(dateRange, onetime, twotime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, e.target.value, selectedhubOptions)
            filterDataByDateonee(dateRangetwo, threetime, fourtime, selectedOptions, hubb, selectedCources, selectedTakeaway, inputvalue, e.target.value, selectedhubOptions)
          }} 
          value={inputvaluetwo} 
          placeholder="9999-9999" 
          style={{ width: '50%', border: 'unset', fontSize: 15, color: '#1A1A1B', textAlign: 'center' }} 
          type="text" 
        />
      </div>

      <div ref={selectReffour} className="custom-inputoness d-flex justify-content-between mt-3" style={{ width: '100%', height: 45,  borderRadius: menuIsOpenfour ? ' 8px 8px 0 0' : '8px',    border:menuIsOpenfour?'2px solid #707070':'none',borderBottom:'none'  }}>
        <div className="switch-container">
          <input 
            type="checkbox" 
            checked={takeaway} 
            onChange={(e) => {
              setTakeaway(e.target.checked)
              if (e.target.checked === false) {
                setSelectedTakeaway([])
              }else{
                handleChangeTakeaway([...selectedTakeaway , ...[{ value: 'All', label: 'All takeaways' }]])
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
          className="newoneonee"
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
              outline: 'none', 
              boxShadow: state.isFocused ? 'none' : 'none',
              border:'none'
            }),
            menu: (base) => ({
              ...base,
              minWidth:'calc(100% + 72px)',
             marginLeft:'-60px',
          border:menuIsOpenfour?'black':'none',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              border:menuIsOpenfour?'2px solid #707070':'none',
              borderTop:'none'
            }),
          }}
        />
      </div>
    </div>
  </div>
</div>


          {
            meals === 1 ?
            <div className="changeone  hide-scrollbar" style={{ marginTop: 100, overflow:'hidden' }}>
            <div className="changetwos" style={{overflowX:'hidden'}}>
              {/* First row */}
              <div className="row">
                {/* Meals received - timeline */}
                <div className="col-lg-6 col-md-12 mb-4 d-flex justify-content-center">
                  <div className="box mx-auto" style={{ maxWidth: "600px" }} onClick={() => {
                    setMeals(5)
                  }}>
                    <div className="boxs" style={{ cursor: 'pointer' }}>
                      <p className="asdfp" style={{ fontWeight: 600, color: '#1A1A1B' }}>Meals received - timeline</p>
                      <div className="end-box">
                        <img src="rts.png" className="" alt="Example Image" />
                        <p className="asdfps">(# of meals sent between specific time slots)</p>
                      </div>
                    </div>
                  </div>
                </div>
          
                {/* Edits */}
                <div className="col-lg-6 col-md-12 mb-4 d-flex justify-content-center">
                  <div className="box mx-auto" style={{ maxWidth: "600px" }} onClick={() => {
                    setMeals(2)
                  }}>
                    <div className="boxs" style={{ cursor: 'pointer' }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="asdfp" style={{ marginBottom: 0, fontWeight: 600, color: '#1A1A1B' }}>Edits</p>
                          <p className="asdfp" style={{ color: "#707070", fontSize: 16, fontWeight: '400' }}>(Total)</p>
                        </div>
                        <div>
                          <p className="asdfp" style={{ color: '#316AAF' }}>
                            {parseInt(editall?.edited?.length) + 
                            parseInt(editall?.moved?.length) + 
                            parseInt(editall?.deleted?.length) + 
                            parseInt(editall?.tableMoved?.length) || 0}
                          </p>
                        </div>
                      </div>
          
                      <div className="end-box">
                        <img src="ert.png" className="" alt="Example Image" />
                        <div>
                          <div className="d-flex" style={{ marginBottom: 0 }}>
                            <div style={{ width: 200 }}>
                              <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Edited</p>
                            </div>
                            <div style={{ fontWeight: '600' }}>
                              <p style={{ marginBottom: 0, paddingLeft: 30 }}>{editall?.edited?.length || 0}</p>
                            </div>
                          </div>
          
                          <div className="d-flex" style={{ marginBottom: 0 }}>
                            <div style={{ width: 200 }}>
                              <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Moved</p>
                            </div>
                            <div style={{ fontWeight: '600' }}>
                              <p style={{ marginBottom: 0, paddingLeft: 30 }}>{editall?.moved?.length || 0}</p>
                            </div>
                          </div>
          
                          <div className="d-flex" style={{ marginBottom: 0 }}>
                            <div style={{ width: 200 }}>
                              <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Deleted</p>
                            </div>
                            <div style={{ fontWeight: '600' }}>
                              <p style={{ marginBottom: 0, paddingLeft: 30 }}>{editall?.deleted?.length || 0}</p>
                            </div>
                          </div>
          
                          <div className="d-flex" style={{ marginBottom: 0 }}>
                            <div style={{ width: 200 }}>
                              <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Table moved</p>
                            </div>
                            <div style={{ fontWeight: '600' }}>
                              <p style={{ marginBottom: 0, paddingLeft: 30 }}>{editall?.tableMoved?.length || 0}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          
              {/* Second row */}
              <div className="row">
                {/* Served meals */}
                <div className="col-lg-6 col-md-12 mb-4 d-flex justify-content-center">
                  <div className="box mx-auto" style={{ maxWidth: "600px" }} onClick={() => {
                    setMeals(3)
                  }}>
                    <div className="boxs" style={{ cursor: 'pointer' }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="asdfp" style={{ marginBottom: 0, fontWeight: 600, color: '#1A1A1B' }}>Served meals</p>
                          <p className="asdfp" style={{ color: "#707070", fontSize: 16, fontWeight: '400' }}>(Total)</p>
                        </div>
                        <div>
                          <p className="asdfp" style={{ color: '#316AAF' }}>
                            {served ? ggggrt() : 0}
                          </p>
                        </div>
                      </div>
          
                      <div className="end-box">
                        <img src="starr.png" className="" alt="Example Image" />
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
                          <div>
                            <div className="d-flex" style={{ marginBottom: 0 }}>
                              <div style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>
                                  Most: <span style={{ fontWeight: '600' }}>{served[0]?.name || 0}</span>
                                </p>
                              </div>
                              <div style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30 }}>{served[0]?.count || 0}</p>
                              </div>
                            </div>
          
                            <div className="d-flex" style={{ marginBottom: 0 }}>
                              <div style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>
                                  Less: <span style={{ fontWeight: '600' }}>{served[served.length - 1]?.name || ''}</span>
                                </p>
                              </div>
                              <div style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30 }}>{served[served.length - 1]?.count || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
          
                {/* Refunded meals */}
                <div className="col-lg-6 col-md-12 mb-4 d-flex justify-content-center">
                  <div className="box mx-auto" style={{ maxWidth: "600px" }} onClick={() => {
                    setMeals(4)
                  }}>
                    <div className="boxs" style={{ cursor: 'pointer' }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="asdfp" style={{ marginBottom: 0, fontWeight: 600, color: '#1A1A1B' }}>Refunded meals</p>
                          <p className="asdfp" style={{ color: "#707070", fontSize: 16, fontWeight: '400' }}>(Total)</p>
                        </div>
                        <div>
                          <p className="asdfp" style={{ color: '#316AAF' }}>
                            {minperday ? ggggrtz() : 0}
                          </p>
                        </div>
                      </div>
          
                      <div className="end-box">
                        <img src="refundd.png" className="" alt="Example Image" />
                        <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
                          <div>
                            <div className="d-flex" style={{ marginBottom: 0 }}>
                              <div style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Minimum per day</p>
                              </div>
                              <div style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30 }}>{minperday[minperday.length - 1]?.count || 0}</p>
                              </div>
                            </div>
          
                            <div className="d-flex" style={{ marginBottom: 0 }}>
                              <div style={{ width: 200 }}>
                                <p style={{ marginBottom: 0, width: 200, textAlign: 'right' }}>Maximum per day</p>
                              </div>
                              <div style={{ fontWeight: '600' }}>
                                <p style={{ marginBottom: 0, paddingLeft: 30 }}>{minperday[0]?.count || 0}</p>
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


              : meals === 2 ?

              <div className="changeone" style={{ marginTop: 100 }}>
              <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex">
                    <img 
                      src="black_arrow.png" 
                      style={{ width: 20, height: 20, cursor: 'pointer' }} 
                      onClick={() => { setMeals(1) }} 
                      className="" 
                      alt="Example Image" 
                    />
                    <p style={{ fontWeight: 600, color: '#1A1A1B', fontSize: 20, marginLeft: 10, marginTop: -6 }}>Edits</p>
                  </div>
            
                  <div className="position-relative">
                    <img 
                      src="threedot.png" 
                      ref={toggleButtonRef} 
                      style={{ width: 5, height: 20, cursor: 'pointer' }} 
                      onClick={handleToggleDiv} 
                      className="" 
                      alt="Example Image" 
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
                      </div>
                    )}
                  </div>
                </div>
            
                <div style={{ marginTop: 50, padding: 20 }}>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                      <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>{editall?.edited?.length + editall?.deleted?.length + editall?.moved?.length}</span>
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                      <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>{editallone?.edited?.length + editallone?.deleted?.length + editallone?.moved?.length}</span>
                      </p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 mb-3">
                      <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>
                          {(() => {
                            let datd = editallone?.edited?.length + editallone?.deleted?.length + editallone?.moved?.length
                            let datdtwo = editall?.edited?.length + editall?.deleted?.length + editall?.moved?.length
                            let tot = ((datdtwo - datd) / datd) * 100
                            return (
                              <span>{tot.toFixed(2) + "%"} 
                                <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                  {tot > 0 ? 
                                    <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Up arrow" /> :
                                    <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Down arrow" />
                                  }
                                </span>
                              </span>
                            )
                          })()}
                        </span>
                      </p>
                    </div>
                  </div>
            
                  <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
            
                  {/* Edited section */}
                  <div className="row py-2">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Edited</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.moved?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Edited</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.moved?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center">
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>
                          {(() => {
                            let datd = editallone?.moved?.length
                            let datdtwo = editall?.moved?.length
                            let tot = ((datdtwo - datd) / datd) * 100
                            return (
                              <span>{tot.toFixed(2) + "%"} 
                                <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                  {tot > 0 ? 
                                    <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Up arrow" /> :
                                    <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Down arrow" />
                                  }
                                </span>
                              </span>
                            )
                          })()}
                        </span>
                      </p>
                    </div>
                  </div>
            
                  <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
            
                  {/* Moved section */}
                  <div className="row py-2">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Moved</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.edited?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Moved</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.edited?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center">
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>
                          {(() => {
                            let datd = editallone?.edited?.length
                            let datdtwo = editall?.edited?.length
                            let tot = ((datdtwo - datd) / datd) * 100
                            return (
                              <span>{tot.toFixed(2) + "%"} 
                                <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                  {tot > 0 ? 
                                    <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Up arrow" /> :
                                    <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Down arrow" />
                                  }
                                </span>
                              </span>
                            )
                          })()}
                        </span>
                      </p>
                    </div>
                  </div>
            
                  <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
            
                  {/* Deleted section */}
                  <div className="row py-2">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Deleted</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.deleted?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Deleted</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.deleted?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center">
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>
                          {(() => {
                            let datd = editallone?.deleted?.length
                            let datdtwo = editall?.deleted?.length
                            let tot = ((datdtwo - datd) / datd) * 100
                            return (
                              <span>{tot.toFixed(2) + "%"} 
                                <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                  {tot > 0 ? 
                                    <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Up arrow" /> :
                                    <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Down arrow" />
                                  }
                                </span>
                              </span>
                            )
                          })()}
                        </span>
                      </p>
                    </div>
                  </div>
            
                  <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
            
                  {/* Table moved section */}
                  <div className="row py-2">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Table moved</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editall?.tableMoved?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>Table moved</p>
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{editallone?.tableMoved?.length}</p>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12 d-flex align-items-center">
                      <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                        ( Total ) <span>
                          {(() => {
                            let datd = editallone?.tableMoved?.length
                            let datdtwo = editall?.tableMoved?.length
                            let tot = ((datdtwo - datd) / datd) * 100
                            return (
                              <span>{isNaN(tot) ? "+000.00%" : tot.toFixed(2) + "%"} 
                                <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                  {tot > 0 ? 
                                    <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Up arrow" /> :
                                    <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} className="" alt="Down arrow" />
                                  }
                                </span>
                              </span>
                            )
                          })()}
                        </span>
                      </p>
                    </div>
                  </div>
            
                  <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
                </div>
              </div>
            </div>

                : meals === 3 ?
                <div className="changeone" style={{ marginTop: 80 }}>
                <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }}>
                  
                  <div style={{ marginTop: -10 }} className="d-flex justify-content-between align-items-center">
                    {/* Left section with title and dropdown */}
                    <div className="d-flex align-items-center">
                      <div className="d-flex align-items-center">
                        <img 
                          src="black_arrow.png" 
                          style={{ width: 20, height: 20, cursor: 'pointer' }} 
                          onClick={() => { setMeals(1) }} 
                          alt="Back Arrow" 
                        />
                        <p style={{ fontWeight: 600, color: '#1A1A1B', fontSize: 20, marginLeft: 10,marginRight:5, marginBottom: 0 }}>Served meals</p>
                      </div>
                      <div className="custom-inputonessfine pt-2 mx-2 ml-2 ml-md-3" style={{ width: 'auto', maxWidth: '200px' }}>
                        <Select
                          className="newoneonee"
                          options={basicfine}
                          onChange={handleChangefine}
                          placeholder="Select options..."
                          components={{
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
                          hideSelectedOptions={false}
                          styles={{
                            control: (base) => ({ 
                              ...base, 
                              border: 'unset', 
                              color: '#707070',
                              minHeight: '38px',
                              // Responsive width
                              width: '100%',
                              maxWidth: '190px',
                            
                            }),
                            menu: (base) => ({
                              ...base,
                              width: 'auto',
                              minWidth: '120px'
                            })
                          }}
                        />
                      </div>
                    </div>
              
                    {/* Right section with search and menu */}
                    <div className="d-flex align-items-center">
                      <div className="custom-inputoness d-flex justify-content-between mx-2" style={{
                        width: '250px',
                        height: 45,
                        border: '1px solid rgb(203 203 203)',
                        '@media (max-width: 992px)': {
                          width: '180px',
                        },
                        '@media (max-width: 768px)': {
                          width: '150px',
                        }
                      }}>
                        <div className="input-group">
                          <input
                            onChange={(e) => { searchvalue(e.target.value) }}
                            type="text"
                            className="form-control"
                            placeholder="Meals Search..."
                            style={{
                              border: "none",
                              boxShadow: "none",
                              marginRight: "45px",
                              fontSize: window.innerWidth < 768 ? '12px' : '14px'
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
                      
                      {/* Three dot menu with better positioning */}
                      <div className="position-relative">
                        <img 
                          src="threedot.png" 
                          ref={toggleButtonRefs} 
                          style={{ width: 5, height: 20, cursor: 'pointer' }} 
                          onClick={fsgdgfdfgdf} 
                          alt="Menu" 
                        />
              
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
                              top: '40px',
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
                  </div>
              
                  {/* Stats section */}
                  <div style={{ marginTop: 20, padding: 20 }}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>Chosen range</p>
                        <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>( Total ) <span>{ggggrt()}</span></p>
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>Comparing range</p>
                        <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>( Total ) <span>{ggggrts()}</span></p>
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>Variance</p>
                        <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: window.innerWidth < 768 ? '13px' : '14px' }}>( Total ) <span>
                          {(() => {
                            let datd = ggggrt()
                            let datdtwo = ggggrts()
                            let tot = ((datd - datdtwo) / datdtwo) * 100
                            return <span>{tot.toFixed(2) + "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                              {tot > 0 ? 
                                <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} alt="Up Arrow" /> :
                                <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} alt="Down Arrow" />
                              }
                            </span></span>
                          })()}
                        </span></p>
                      </div>
                    </div>
              
                    <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
              
                    {/* Table section */}
                    <div className="scroll" id="scrrrrol" style={{ height: 400, overflowY: 'auto' }}>
                      {served?.map((dfgh, index) => {
                        const correspondingErv = servedone?.[index];
                        
                        return (
                          <React.Fragment key={index}>
                            <div className="d-flex">
                              <div style={{ width: '33%' }}>
                                <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{dfgh?.name}</p>
                                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{dfgh?.count}</p>
                              </div>
              
                              {correspondingErv ? (
                                <div style={{ width: '33%', textAlign: 'center' }}>
                                  <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{correspondingErv?.name}</p>
                                  <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>{correspondingErv?.count}</p>
                                </div>
                              ) : (
                                <div style={{ width: '33%' }}></div>
                              )}
              
                              <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex', width: '33%' }}>
                                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
                                  ( Total )
                                  <span>
                                    {(() => {
                                      const datd = dfgh?.count || 0;
                                      const datdtwo = correspondingErv?.count || 0;
                                      const tot = datdtwo === 0 ? 0 : ((datd - datdtwo) / datdtwo) * 100;
              
                                      return (
                                        <span>
                                          {tot.toFixed(2) + "%"}
                                          <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                            {tot > 0 ? (
                                              <img src="up_arw.png" style={{ width: 16, height: 16 }} alt="Up Arrow" />
                                            ) : (
                                              <img src="d_arw.png" style={{ width: 16, height: 16 }} alt="Down Arrow" />
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
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
                  : meals === 4 ?


                  <div className="changeone" style={{ marginTop: 80 }}>
                  <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, padding: 20 }}>
                
                    <div style={{ marginTop: -20 }} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex justify-content-center align-items-center gap-2 gap-md-3 gap-lg-5">
                        <div className="d-flex pt-4 align-items-center">
                          <img 
                            src="black_arrow.png" 
                            style={{ width: 20, height: 20, cursor: 'pointer' }} 
                            onClick={() => { setMeals(1) }} 
                            alt="Back Arrow" 
                          />
                          <p style={{ fontWeight: 600, color: '#1A1A1B', fontSize: 20, marginLeft: 10, marginBottom: 0 }}  onClick={()=>{
                            console.log(  minperday , 'minperday minperday')
                          }}>Refunded meals</p>
                        </div>
                        <div className="custom-inputonessfine d-flex align-items-center pt-1">
                          <Select
                            className="newoneonee"
                            options={basicfine}
                            onChange={handleChangefinedd}
                            placeholder="Select options..."
                            components={{
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
                              }),
                              menu: (base) => ({
                                ...base,
                                width: 'auto',
                                minWidth: '120px'
                              })
                            }}
                          />
                        </div>
                      </div>
                
                      {/* Three dots menu with proper positioning */}
                      <div className="position-relative">
                        <img 
                          src="threedot.png" 
                          ref={toggleButtonRefss} 
                          style={{ width: 5, height: 20, cursor: 'pointer' }} 
                          onClick={handleToggleDivss} 
                          alt="Menu Options" 
                        />
                
                        {showDivss && (
                          <div
                            ref={dropdownRefss}
                            style={{
                              zIndex: 100,
                              width: 200,
                              padding: '10px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                              position: 'absolute',
                              top: '30px',
                              right: 0
                            }}
                          >
                            <p style={{ color: '#707070', margin: '0 0 8px 0' }}>Export as</p>
                            <hr style={{ margin: '8px 0' }} />
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

                          </div>
                        )}
                      </div>
                    </div>
                
                    <div style={{ marginTop: 10, padding: '10px 20px' }}>
                      <div className="d-flex justify-content-between flex-wrap">
                        <div className="mb-2 mb-md-0" style={{ minWidth: '120px' }}>
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>Chosen range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                            ( Total ) <span>{ggggrtsg()}</span>
                          </p>
                        </div>
                        <div className="mb-2 mb-md-0" style={{ minWidth: '120px' }}>
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>Comparing range</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                            ( Total ) <span>{ggggrtsgg()}</span>
                          </p>
                        </div>
                        <div style={{ minWidth: '120px' }}>
                          <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>Variance</p>
                          <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                            ( Total ) <span>
                              {(() => {
                                let datd = ggggrtsg();
                                let datdtwo = ggggrtsgg();
                                let tot = ((datd - datdtwo) / datdtwo) * 100;
                
                                return (
                                  <span>
                                    {isNaN(tot) ? 0 : tot.toFixed(2) + "%"} 
                                    <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                      {isNaN(tot) ? '%' : tot > 0 ? 
                                        <img src="up_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} alt="Up Arrow" /> :
                                        <img src="d_arw.png" style={{ width: 16, height: 16, cursor: 'pointer' }} alt="Down Arrow" />
                                      }
                                    </span>
                                  </span>
                                );
                              })()}
                            </span>
                          </p>
                        </div>
                      </div>
                
                      <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />
                
                      <div className="scroll" id="scrrrrol" style={{ height: 420, overflowY: 'auto' }}>
                        {minperday?.map((dfgh, index) => {
                          const correspondingErv = maxperday?.[index];
                
                          return (
                            <React.Fragment key={index} >
                              <div className="d-flex">
                                <div style={{ width: '33%' }}>
                                  <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>{dfgh?.name}</p>
                                  <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>{dfgh?.count}</p>
                                </div>
                
                                {correspondingErv ? (
                                  <div style={{ width: '33%', textAlign: 'center' }}>
                                    <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>{correspondingErv?.name}</p>
                                    <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>{correspondingErv?.count}</p>
                                  </div>
                                ) : (
                                  <div style={{ width: '33%' }}></div>
                                )}
                
                                <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex', width: '33%' }}>
                                  <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                                    ( Total )
                                    <span>
                                      {(() => {
                                        const datd = dfgh?.count || 0;
                                        const datdtwo = correspondingErv?.count || 0;
                                        const tot = datdtwo === 0 ? 0 : ((datd - datdtwo) / datdtwo) * 100;
                
                                        return (
                                          <span>
                                            {isNaN(tot) ? "0%" : tot.toFixed(2) + "%"}
                                            <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }}>
                                              {isNaN(tot) ? '' : tot > 0 ? (
                                                <img src="up_arw.png" style={{ width: 16, height: 16 }} alt="Up Arrow" />
                                              ) : (
                                                <img src="d_arw.png" style={{ width: 16, height: 16 }} alt="Down Arrow" />
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
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                    :

                    <div className="changeone" style={{ marginTop: 100 }} >
                      <div className="changetwo" style={{ width: '100%', backgroundColor: '#fff', borderRadius: 7, height: 'auto', padding: 20 }} >

                        <div className="d-flex justify-content-between " >
                          <div style={{}} className="d-flex " >
                            <img src="black_arrow.png" style={{ width: 20, height: 20, cursor: 'pointer' }} onClick={() => {
                              setMeals(1)
                            }} className="" alt="Example Image" />
                            <p style={{ fontWeight: 600, color: '#1A1A1B', fontSize: 20, marginTop: 0, marginLeft: 10, marginTop: -6 }}>Meals received - timeline</p>
                          </div>

                          <div >
                            <img src="threedot.png" ref={toggleButtonRefsss} style={{ width: 5, height: 20, cursor: 'pointer' }} onClick={handleToggleDivsss} className="" alt="Example Image" />

                            {showDivsss && (
                              <div
                                ref={dropdownRefsss}
                                style={{
                                  width: 200,
                                  margin: '0px',
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
      setIsExcelLoad(true)
      downloadMealsExcel()
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

                        <div style={{ marginTop: 50, padding: 20, height: '500px' }} >


                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Left Scroll Button */}
                            <button onClick={scrollLeft} style={buttonStyle}>⬅</button>

                            <p className="gggjgjjg"># of new dockets</p>

                            {/* Scrollable Chart Container */}
                            <div ref={chartContainerRef} className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                              <div style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                <Bar data={datafine} options={optionshshs} id="chart-capture" />
                              </div>
                            </div>

                            {/* Right Scroll Button */}
                            <button onClick={scrollRight} style={buttonStyle}>➡</button>
                          </div>


                          <div style={{ visibility: 'hidden' }}>
                            <div ref={pdfRefred}  >

                              <p style={{ fontWeight: '700', fontSize: 25, color: '#000', }}>Meals received - timeline
                              </p>

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

                              <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20 }} >Table ranges contains: All</p>
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



                              <div className="kiy" style={{ width: '100%', overflowX: 'auto', border: '1px solid #ccc', padding: '10px', whiteSpace: 'nowrap' }}>
                                <div id="chart-capture"  style={{ width: '1500px', height: '350px' }}> {/* Chart width exceeds container */}
                                  <Bar data={datafine} options={optionshshs}  />
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

      </div>


      <div style={{ visibility: 'hidden' }}>
        <div ref={pdfRef}  >

          <p style={{ fontWeight: '700', fontSize: 25, color: '#000', }}>Edits</p>
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



          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20 }} >Table ranges contains: All</p>
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


          <div style={{ marginTop: 20, padding: 10 }} >
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

            <hr style={{ margin: '0px 0px', backgroundColor: 'black' }} />

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

            <hr style={{ margin: '0px 0px', backgroundColor: 'black', }} />

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

            <hr style={{ margin: '0px 0px', backgroundColor: 'black', }} />

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

            <hr style={{ margin: '0px 0px', backgroundColor: 'black', }} />


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

                    return <span >{isNaN(tot) ? "+000.00" : tot.toFixed(2) + "%"} <span style={{ color: tot > 0 ? "green" : "red", fontWeight: '700' }} >{tot > 0 ? <img src="up_arw.png"
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
        </div >
      </div>

      <div style={{ visibility: 'hidden' }}>
        <div ref={pdfRefss}  >

          <p style={{ fontWeight: '700', fontSize: 25, color: '#000', }}>Served meals</p>
          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >{(() => {

const filteredOptions = selectedOptions.filter(item => item.label !== "All Venue");
const result = filteredOptions.map(item => item.label).join(", ");


if (result === "" || result === undefined || result === null) {
  return 'All Venue'
} else {

  return result

}


})()}</p>

          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: 20 ,wordSpacing: -5 }} >Group name</p>
          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20 ,wordSpacing: -5 }} >For the period {(() => {
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
          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20 ,wordSpacing: -5 }} >Compared with the period {(() => {
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

          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20 }} >Table ranges contains: All</p>
          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20 ,wordSpacing: -5}} >Stages contains: {(() => {

            const result = selectedhubOptions.map(item => item.label).join(",");

            if (result === "" || result === undefined || result === null) {
              return 'All'
            } else {

              return result

            }


          })()} </p>
          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20 ,wordSpacing: -5}} >Courses contains: {(() => {

            const result = selectedCources.map(item => item.label).join(",");

            if (result === "" || result === undefined || result === null) {
              return 'All'
            } else {

              return result

            }


          })()}</p>


          <div style={{ marginTop: 20, padding: 10 }} >

            <div className="d-flex justify-content-between" >

              <div >
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total )  {
                  ggggrt()} </p>
              </div>
              <div >
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total )  {

                  ggggrts()
                } </p>
              </div>
              <div >
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', display: 'inline-flex', alignItems: 'center' }}>
                  ( Total ){" "}
                  {(() => {
                    let datd = ggggrt();
                    let datdtwo = ggggrts();
                    let tot = ((datd - datdtwo) / datdtwo) * 100;

                    return (
                      <>
                        {tot.toFixed(2) + "%"}{" "}
                        <img
                          src={tot > 0 ? "up_arw.png" : "d_arw.png"}
                          style={{ width: 16, height: 16, cursor: "pointer", marginLeft: 4 }}
                          alt={tot > 0 ? "Up Arrow" : "Down Arrow"}
                        />
                      </>
                    );
                  })()}
                </p>


              </div>

            </div>
            <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 2 }} />

            {
              served?.map((dfgh, index) => {
                const correspondingErv = servedone?.[index]; // Get the corresponding item in the `ervedone` array

                return (
                  <>
                    <div className="d-flex  mt-3">

                      <div style={{ width: '33%' }}>
                        <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{dfgh?.name}</p>
                        <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', marginTop: -4 }}>{dfgh?.count}</p>
                      </div>

                      {correspondingErv ? (
                        <div style={{ width: '33%', textAlign: 'center' }}>
                          <div >

                            <p style={{ fontWeight: '700', color: '#000', marginBlock: '4px' }}>{correspondingErv?.name}</p>
                            <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', marginTop: -4 }}>{correspondingErv?.count}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ width: '33%' }} >
                          </div></>
                      )}

                      <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex', width: '33%', }}>
                        <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px', display: 'inline-flex', alignItems: 'center' }}>
                          ( Total ){" "}
                          {(() => {
                            const datd = dfgh?.count || 0; // Fallback to 0 if no data
                            const datdtwo = correspondingErv?.count || 0; // Fallback to 0 if no data

                            const tot = datdtwo !== 0 ? ((datd - datdtwo) / datdtwo) * 100 : 0; // Prevent division by zero

                            return (
                              <>
                                {tot.toFixed(2) + "%"}{" "}
                                <img
                                  src={tot > 0 ? "up_arw.png" : "d_arw.png"}
                                  style={{ width: 16, height: 16, cursor: "pointer", marginLeft: 4 }}
                                  alt={tot > 0 ? "Up Arrow" : "Down Arrow"}
                                />
                              </>
                            );
                          })()}
                        </p>

                      </div>

                    </div>

                    <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 2 }} />
                  </>
                );
              })
            }


          </div>
        </div >
      </div>


      <div style={{ visibility: 'hidden' }}>
        <div ref={pdfRefsss}  >

          <p style={{ fontWeight: '700', fontSize: 25, color: '#000', wordSpacing: -5  }}>Refunded meals</p>

          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20, wordSpacing: -5 }} >{(() => {

const filteredOptions = selectedOptions.filter(item => item.label !== "All Venue");
const result = filteredOptions.map(item => item.label).join(", ");


if (result === "" || result === undefined || result === null) {
  return 'All Venue'
} else {

  return result

}


})()}</p>

          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: 20 , wordSpacing: -5  }} >Group name</p>
          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20 , wordSpacing: -5  }} >For the period {(() => {
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
          <p style={{ fontWeight: '700', fontSize: 17, color: '#000', marginTop: -20 , wordSpacing: -5  }} >Compared with the period {(() => {
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

          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: 20 , wordSpacing: -5  }} >Table ranges contains: All</p>
          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20 , wordSpacing: -5  }} >Stages contains: {(() => {

            const result = selectedhubOptions.map(item => item.label).join(",");

            if (result === "" || result === undefined || result === null) {
              return 'All'
            } else {

              return result

            }


          })()} </p>
          <p style={{ fontWeight: '400', fontSize: 15, color: '#000', marginTop: -20 , wordSpacing: -5  }} >Courses contains: {(() => {

            const result = selectedCources.map(item => item.label).join(",");

            if (result === "" || result === undefined || result === null) {
              return 'All'
            } else {

              return result

            }


          })()}</p>


          <div style={{ marginTop: 20, padding: 10 }} >

            <div className="d-flex justify-content-between" >

              <div >
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Chosen range</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total )  {
                  ggggrtsg()} </p>
              </div>
              <div >
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Comparing range</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>( Total ) {

                  ggggrtsgg()
                } </p>
              </div>
              <div >
                <p style={{ fontWeight: '700', color: '#707070', marginBlock: '4px' }}>Variance</p>
                <p style={{ fontWeight: '400', color: '#000', marginBlock: '7px' }}>
  ( Total )  
  {(() => {
    let datd = ggggrtsg();
    let datdtwo = ggggrtsgg();
    let tot = ((datd - datdtwo) / datdtwo) * 100;

    console.log(datd, datdtwo, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvv', tot);

    return (
      <>
        {isNaN(tot) ? 0 : tot.toFixed(2) + "%"}  
      </>
    );
  })()} 
</p>

              </div>

            </div>

            <hr style={{ margin: '0px 0px', backgroundColor: 'black', height: 3 }} />

            <div className="scroll" id="scrrrrol"  >



              {
                minperday?.map((dfgh, index) => {

                  const correspondingErv = maxperday?.[index]; // Get the corresponding item in the `ervedone` array

                  return (
                    <>
                    <div className="d-flex" >
                      {/* Left Section */}
                      <div style={{ width: '33%' }}>
                        <p style={{ fontWeight: 700, color: '#000', marginBlock: '4px' }}>{dfgh?.name}</p>
                        <p style={{ fontWeight: 400, color: '#000', marginBlock: '7px' }}>{dfgh?.count}</p>
                      </div>
                  
                      {/* Middle Section */}
                      <div style={{ width: '33%', textAlign: 'center' }}>
                        {correspondingErv ? (
                          <>
                            <p style={{ fontWeight: 700, color: '#000', marginBlock: '4px' }}>{correspondingErv?.name}</p>
                            <p style={{ fontWeight: 400, color: '#000', marginBlock: '7px' }}>{correspondingErv?.count}</p>
                          </>
                        ) : null}
                      </div>
                  
                      {/* Right Section */}
                      <div style={{ width: '33%', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        <p style={{ fontWeight: 400, color: '#000', marginBlock: '7px', display: 'flex', alignItems: 'center' }}>
                          ( Total )
                          {(() => {
                            const datd = dfgh?.count || 0;
                            const datdtwo = correspondingErv?.count || 0;
                            const tot = datdtwo !== 0 ? ((datd - datdtwo) / datdtwo) * 100 : 0;
                            return (
                              <>
                                {tot.toFixed(2)}%
                                <img
                                  src={tot > 0 ? "up_arw.png" : "d_arw.png"}
                                  style={{ width: 16, height: 16, cursor: 'pointer', marginLeft: 5, verticalAlign: 'middle' }}
                                  alt={tot > 0 ? "up arrow" : "down arrow"}
                                />
                              </>
                            );
                          })()}
                        </p>
                      </div>
                    </div>
                    <hr style={{ margin: 0, backgroundColor: 'black', height: 2 }} />
                  </>
                  
                  
                  );
                })
              }


            </div>




          </div>
        </div >
      </div>

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

export default Meals;


