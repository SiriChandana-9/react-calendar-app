import React, { useState, useEffect } from "react";
import "./App.css";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

const getFirstDay = (month, year) =>
  new Date(year, month, 1).getDay();

function App() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [note, setNote] = useState("");
  const [dark, setDark] = useState(false);

  const totalDays = getDaysInMonth(month, year);
  const firstDay = getFirstDay(month, year);

  // Load notes per month
  useEffect(() => {
    const saved = localStorage.getItem(`${month}-${year}`);
    if (saved) setNote(saved);
    else setNote("");
  }, [month, year]);

  // Save notes
  useEffect(() => {
    localStorage.setItem(`${month}-${year}`, note);
  }, [note, month, year]);

  const handleClick = (day) => {
    if (!start) setStart(day);
    else if (!end) setEnd(day);
    else {
      setStart(day);
      setEnd(null);
    }
  };

  const isSelected = (day) => {
    if (start && end) return day >= start && day <= end;
    return day === start;
  };

  const isToday = (day) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const changeMonth = (dir) => {
    setStart(null);
    setEnd(null);
    if (dir === "prev") {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else setMonth(month - 1);
    } else {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else setMonth(month + 1);
    }
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="card">

        {/* HERO IMAGE */}
        <div className="hero">
          <img
            src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe"
            alt="calendar"
          />
          <div className="overlay">
            <h1>
              {new Date(year, month).toLocaleString("default", {
                month: "long",
              })}
            </h1>
            <p>{year}</p>
          </div>
        </div>

        {/* MONTH CONTROLS */}
        <div className="header">
          <button onClick={() => changeMonth("prev")}>⬅️</button>
          <button onClick={() => changeMonth("next")}>➡️</button>
        </div>

        {/* DARK MODE */}
        <button className="toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* WEEK DAYS */}
        <div className="week">
          {weekDays.map((day, i) => (
            <div key={i} className="week-day">
              {day}
            </div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid">
          {[...Array(firstDay)].map((_, i) => (
            <div key={"empty" + i}></div>
          ))}

          {[...Array(totalDays)].map((_, i) => {
            const day = i + 1;
            return (
              <div
                key={i}
                className={`day 
                ${isSelected(day) ? "selected" : ""}
                ${isToday(day) ? "today" : ""}`}
                onClick={() => handleClick(day)}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* NOTES */}
        <textarea
          placeholder="Write notes for this month..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

      </div>
    </div>
  );
}

export default App;