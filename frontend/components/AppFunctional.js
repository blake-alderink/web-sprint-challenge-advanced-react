import React, { useState, useEffect } from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const coordinates = { x: 2, y: 2 };

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [index, setIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);
  const [steps, setSteps] = useState(initialSteps);
  const [input, setInput] = useState(initialEmail);
  const [xyMessage, setXYMessage] = useState("Coordinates (2,2)");

  useEffect(() => {
    coordinates.x = 2;
    coordinates.y = 2;
    reset();
  }, []);

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.

    return `(${coordinates.x}, ${coordinates.y})`;
  }

  // function getXYMessage() {
  //   return `Coordinates (${coordinates.x}, ${coordinates.y})`;

  //   // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
  //   // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
  //   // returns the fully constructed string.
  // }

  function reset() {
    setMessage(initialMessage);
    setInput(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
    setXYMessage("Coordinates (2,2)");
    coordinates.x = 2;
    coordinates.y = 2;

    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    if (direction === "right" && (index === 2 || index === 5 || index === 8)) {
      setMessage("You can't go right");
      console.log(message);
      return index;
    }

    if (direction === "left" && (index === 0 || index === 3 || index === 6)) {
      setMessage("You can't go left");
      console.log(message);
      return index;
    }

    if (direction === "up" && (index === 0 || index === 1 || index === 2)) {
      setMessage(`You can't go up`);
      console.log(message);
      return index;
    }

    if (direction === "down" && (index === 6 || index === 7 || index === 8)) {
      setMessage("You can't go down");
      console.log(message);
      return index;
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.

    if (direction === "down") {
      setMessage("");
      setSteps(steps + 1);
      console.log(coordinates);
      coordinates.y += 1;
      setXYMessage(`Coordinates (${coordinates.x}, ${coordinates.y})`);
      console.log(message);
      return index + 3;
    }
    if (direction === "up") {
      setSteps(steps + 1);
      setMessage("");
      console.log(coordinates);
      coordinates.y -= 1;
      setXYMessage(`Coordinates (${coordinates.x}, ${coordinates.y})`);
      console.log(message);
      return index - 3;
    }

    if (direction === "left") {
      setSteps(steps + 1);
      setMessage("");
      console.log(coordinates);
      coordinates.x -= 1;
      setXYMessage(`Coordinates (${coordinates.x}, ${coordinates.y})`);
      console.log(message);
      return index - 1;
    }
    if (direction === "right") {
      setSteps(steps + 1);
      setMessage("");
      console.log(coordinates);
      coordinates.x += 1;
      setXYMessage(`Coordinates (${coordinates.x}, ${coordinates.y})`);
      console.log(message);
      return index + 1;
    }
    if (direction === "reset") {
      setInput(initialEmail);
      setSteps(initialSteps);
      setMessage("");
      console.log(coordinates);
      coordinates.x = 2;
      coordinates.y = 2;
      setXYMessage(`Coordinates (${coordinates.x}, ${coordinates.y})`);
      console.log(message);
      return 4;
    }
  }

  function move(evt) {
    setIndex(getNextIndex(evt));
    getXY();

    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    setInput(evt.target.value);

    // You will need this to update the value of the input.
  }

  function onSubmit(evt) {
    evt.preventDefault();

    axios
      .post("http://localhost:9000/api/result", {
        x: coordinates.x,
        y: coordinates.y,
        steps: steps,
        email: input,
      })
      .then((res) => setMessage(res.data.message))
      .catch((err) =>
        err.message === "Request failed with status code 403"
          ? setMessage(err.response.data.message)
          : setMessage(
              input === ""
                ? "Ouch: email is required"
                : "Ouch: email must be a valid email"
            )
      );

    setInput("");

    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{xyMessage}</h3>
        <h3 id="steps">
          You moved {steps} {steps === 1 ? "time" : "times"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move("left")}>
          LEFT
        </button>
        <button id="up" onClick={() => move("up")}>
          UP
        </button>
        <button id="right" onClick={() => move("right")}>
          RIGHT
        </button>
        <button id="down" onClick={() => move("down")}>
          DOWN
        </button>
        <button id="reset" onClick={() => move("reset")}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={input}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
