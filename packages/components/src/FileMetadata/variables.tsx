import React, { createContext, useContext } from "react";
import "./variables.css";

export const PageNumber = () => {
  return <span className="--docify-page-number-current" />;
};

export const TotalPages = () => {
  return <span className="--docify-page-number-total" />;
};
