import React, { createContext, useReducer } from "react";

const initialState = { data : {} , user : {} };

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, ...action.payload };
    case "RESET_DATA":
      return initialState;
    default:
      return state;
  }
};

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
