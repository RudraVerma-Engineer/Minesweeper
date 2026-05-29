import React, { useRef, useState } from "react";

function User() {
  const intervalId = useRef(null);
  // console.log(int);
  const [count, setCount] = useState(0);
  async function  handleStart() {
    if (intervalId.current !== null) return;
    intervalId.current = setInterval(function () {
      setCount(function (prev) {
        return (prev += 1);
      });
    }, 1000);
    
  }
  function handleStop() {
    // console.log(intervalId.current);
    clearInterval(intervalId.current);
    intervalId.current = null;
  }

  function handleRestart() {
    clearInterval(intervalId.current);
    intervalId.current = null;
    setCount(0);
  }
  function formTime() {
    const mins = Math.floor(count/60);
    const sec = count % 60;

    return `${mins.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <h1>{formTime()}</h1>

      <button onClick={handleStart}>start</button>
      <button onClick={handleStop}>stop</button>
      <button onClick={handleRestart}>clear</button>
    </div>
  );
}

export default User;
