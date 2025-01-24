import React, { useEffect, useState , useRef } from "react";
import Header from "../component/Header";
import axios from "axios";
import { Base_url } from "../config";
import { useNavigate } from "react-router-dom";

import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import bigInt from "big-integer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCaretDown  } from "react-icons/fa6";
import TimePicker from 'react-time-picker';

import app from "./firebase";
import { getDatabase, ref, set, push , get ,    query, 
  startAt, endAt,  orderByChild, equalTo ,
  orderByKey } from "firebase/database";


let Meals = () => {
  let [data, setData] = useState();
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [startDate, endDate] = dateRange; 
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


  let updates  = ( num , val ) => {

    if( num === 1 ) {

      let onee = val[0]
      let date = new Date(onee);
      let formattedDate = date.toISOString().split('T')[0];

      let two = val[1]
      const datetwo = new Date(two);
      const formattedDatetwo = datetwo.toISOString().split('T')[0];


      console.log(formattedDate , 'formattedDate')
      console.log(formattedDatetwo , 'formattedDatetwo')

      const db = getDatabase(app);

      const eventsRef = ref(db, "Data/BFG-Barefoot-Kitchen-2024");

      // Create a query for events between the two dates
      const dateQuery = query(
        eventsRef,
        orderByKey(),
        startAt(formattedDate),
        endAt(formattedDatetwo)
      );

      // Fetch the results
      get(dateQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const events = snapshot.val();
            console.log("Events between dates:", events);
          } else {
            console.log("No events found between the dates.");
          }
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });



      console.log( num , val , ' console.log( num , val )' )
    }
   
  }
  let navigate = useNavigate();
  return (
    <div>
      <Header name={"Meals"} center={"Name"} />
      <div style={{ backgroundColor: "#DADADA", height: '100vh' }} >

        <div style={{  }} className="dddd" style={{}} >

 


         
          <div className="d-flex justify-content-between  pt-4" >

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen range:<span style={{ fontWeight: '400' }}> Custom</span></p>
 
              <div  >
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => { 
                    setDateRange(update)

                    if(update[1] === null || update[1] === "null" ){
                     
                    }else{
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
                <div  className="custom-inputone d-flex justify-content-between">
                  <input 
                    className='inputttt'
                    type="time" 
                    value={time} 
                    onChange={handleTimeChange} 
                  />
                  <input 
                    className='inputttt'
                    type="time" 
                    value={time} 
                    onChange={handleTimeChange} 
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

                    if(update[1] === null || update[1] === "null" ){
                     
                    }else{
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
                <div  className="custom-inputone d-flex justify-content-between">
                  <input 
                    className='inputttt'
                    type="time" 
                    value={time} 
                    onChange={handleTimeChange} 
                  />
                  <input 
                    className='inputttt'
                    type="time" 
                    value={time} 
                    onChange={handleTimeChange} 
                  />
                </div> 
              </div>


              
            </div>


            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Chosen venue & hub</p>
              <div  className="custom-inputone d-flex justify-content-between" style={{ width : 260 }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars"  style={{ border : 'unset' , color : '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> 
              </div> 

              <div  className="custom-inputone d-flex justify-content-between mt-3" style={{ width : 260 }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars"  style={{ border : 'unset' , color : '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> 
              </div> 
            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by stages/courses</p>
              <div  className="custom-inputone d-flex justify-content-between" style={{ width : 260 }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars"  style={{ border : 'unset' , color : '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> 
              </div>


              <div  className="custom-inputone d-flex justify-content-between mt-3" style={{ width : 260 }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars"  style={{ border : 'unset' , color : '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> 
              </div> 


            </div>

            <div >
              <p style={{ color: '#707070', fontWeight: '700', fontSize: 15 }}>Filter by tables/takeaways</p>

              <div  className="custom-inputone d-flex justify-content-between" style={{ width : 260 }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars"  style={{ border : 'unset' , color : '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> 
              </div> 

              <div  className="custom-inputone d-flex justify-content-between mt-3" style={{ width : 260 }}>
                <div class="switch-container">
                  <input type="checkbox" id="switch1" />
                  <label class="switch-label" for="switch1"></label>
                </div>

                <select name="cars" id="cars"  style={{ border : 'unset' , color : '#707070' }} >
                  <option value="volvo">Volvo</option>
                  <option value="saab">Saab</option>
                  <option value="mercedes">Mercedes</option>
                  <option value="audi">Audi</option>
                </select> 
              </div> 
            </div>

          </div>


          <div className="" style={{ marginTop : 100 }} >
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
                        <img   src="rts.png" className="" alt="Example Image" />
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
                          <p className='asdfp' style={{ marginBottom : 0 }}>Meals received - timeline</p>
                          <p className='asdfp' style={{ color : "#707070" , fontSize : 16 , fontWeight : '400' }} >(Total)</p>
                        </div>
                        <div > 
                        <p className='asdfp' style={{ color : '#316AAF' }}>22</p>
                        </div>
                      </div>
                      
                      <div  class="end-box">
                        <img src="ert.png" className="" alt="Example Image" />
                        <div className='' >


                          <div className="d-flex" style={{ marginBottom : 0 }}  >
                            <div className=' ' style={{  width :  200  }}>
                              <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Edited</p>
                            </div>
                            <div className=' ' style={{ fontWeight : '600' }}>
                              <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
                            </div>
                          </div> 


                          <div className="d-flex" style={{ marginBottom : 0 }}  >
                            <div className=' ' style={{  width :  200  }}>
                              <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Moved</p>
                            </div>
                            <div className=' ' style={{ fontWeight : '600' }}>
                              <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
                            </div>
                          </div> 

                          <div className="d-flex" style={{ marginBottom : 0 }}  >
                            <div className=' ' style={{  width :  200  }}>
                              <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Deleted</p>
                            </div>
                            <div className=' ' style={{ fontWeight : '600' }}>
                              <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
                            </div>
                          </div>  

                          <div className="d-flex" style={{ marginBottom : 0 }}  >
                            <div className=' ' style={{  width :  200  }}>
                              <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Table moved</p>
                            </div>
                            <div className=' ' style={{ fontWeight : '600' }}>
                              <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
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
                          <img   src="rts.png" className="" alt="Example Image" />
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
                            <p className='asdfp' style={{ marginBottom : 0 }}>Meals received - timeline</p>
                            <p className='asdfp' style={{ color : "#707070" , fontSize : 16 , fontWeight : '400' }} >(Total)</p>
                          </div>
                          <div > 
                          <p className='asdfp' style={{ color : '#316AAF' }}>22</p>
                          </div>
                        </div>
                        
                        <div  class="end-box">
                          <img src="ert.png" className="" alt="Example Image" />
                          <div className='' >


                            <div className="d-flex" style={{ marginBottom : 0 }}  >
                              <div className=' ' style={{  width :  200  }}>
                                <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Edited</p>
                              </div>
                              <div className=' ' style={{ fontWeight : '600' }}>
                                <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
                              </div>
                            </div> 


                            <div className="d-flex" style={{ marginBottom : 0 }}  >
                              <div className=' ' style={{  width :  200  }}>
                                <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Moved</p>
                              </div>
                              <div className=' ' style={{ fontWeight : '600' }}>
                                <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
                              </div>
                            </div> 

                            <div className="d-flex" style={{ marginBottom : 0 }}  >
                              <div className=' ' style={{  width :  200  }}>
                                <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Deleted</p>
                              </div>
                              <div className=' ' style={{ fontWeight : '600' }}>
                                <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
                              </div>
                            </div>  

                            <div className="d-flex" style={{ marginBottom : 0 }}  >
                              <div className=' ' style={{  width :  200  }}>
                                <p style={{ marginBottom : 0 , width :  200 , textAlign : 'right' }} >Table moved</p>
                              </div>
                              <div className=' ' style={{ fontWeight : '600' }}>
                                <p style={{ marginBottom : 0 , paddingLeft : 30 , }} >5</p>
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


 