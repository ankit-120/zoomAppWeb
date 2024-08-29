import React, { useEffect, useState } from "react";
import styles from "./CreateMeeting.module.css";
import axios from "axios";

const CreateMeeting = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [responseMsg, setResponseMsg] = useState();

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        "http://localhost:8000/api/zoom/createZoomMeeting",
        { date, time },
        { withCredentials: true }
      );
      setResponseMsg(`Meeting created! Join URL: ${resp.data.link}`);
    } catch (error) {
      setResponseMsg("Failed to create meeting. Please try again.");
      console.error("Error creating meeting:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/zoom/checkAuth",
          { withCredentials: true }
        );
        if (!response.data.isAuthenticated) {
          window.location.href = "http://localhost:8000/api/zoom/auth";
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.label}>
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={handleDateChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="time" className={styles.label}>
            Time:
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={handleTimeChange}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
      {responseMsg && <p>{responseMsg}</p>}
    </div>
  );
};

export default CreateMeeting;
