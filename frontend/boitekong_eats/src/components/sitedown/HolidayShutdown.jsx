import React from "react";
import { FaTree, FaSnowflake, FaSmile } from "react-icons/fa";
import "./HolidayShutdown.css";

const HolidayShutdown = () => {
  return (
    <div className="holiday-shutdown">
      <div className="holiday-header">
        <FaTree className="icon tree" />
        <h1>We're Closed for the Holidays</h1>
        <FaTree className="icon tree" />
      </div>
      <p className="holiday-message">
        Thank you for your support this year! We're taking a break to celebrate
        the holidays and will be back next year, ready to serve you. 🎉
      </p>
      <p className="see-you">See you in the new year! 🎄</p>
      <FaSnowflake className="icon snowflake" />
      <FaSmile className="icon smile" />
    </div>
  );
};

export default HolidayShutdown;
