import React from "react";
import axios from "axios";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const coordinates = { x: 2, y: 2 };

export default class AppClass extends React.Component {
  constructor() {
    super();
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    };
  }

  componentDidMount() {
    this.reset();
  }
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    return `(${coordinates.x}, ${coordinates.y})`;
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  };

  getXYMessage = () => {
    return `Coordinates ${this.getXY()}`;
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });

    coordinates.x = 2;
    coordinates.y = 2;

    // Use this helper to reset all states to their initial values.
  };

  getNextIndex = (direction) => {
    if (
      direction === "right" &&
      (this.state.index === 2 ||
        this.state.index === 5 ||
        this.state.index === 8)
    ) {
      const newMessage = "You can't go right";
      this.setState({ message: newMessage });
      return this.state.index;
    }

    if (
      direction === "left" &&
      (this.state.index === 0 ||
        this.state.index === 3 ||
        this.state.index === 6)
    ) {
      this.setState({ message: `You can't go left` });
      return this.state.index;
    }

    if (
      direction === "up" &&
      (this.state.index === 0 ||
        this.state.index === 1 ||
        this.state.index === 2)
    ) {
      this.setState({ message: "You can't go up" });
      return this.state.index;
    }

    if (
      direction === "down" &&
      (this.state.index === 6 ||
        this.state.index === 7 ||
        this.state.index === 8)
    ) {
      this.setState({ message: "You can't go down" });
      return this.state.index;
    }

    if (direction === "down") {
      this.setState({ message: "" });
      this.setState({ steps: this.state.steps + 1 });

      coordinates.y += 1;
      return this.state.index + 3;
    }
    if (direction === "up") {
      this.setState({ steps: this.state.steps + 1 });
      this.setState({ message: "" });

      coordinates.y -= 1;
      return this.state.index - 3;
    }

    if (direction === "left") {
      this.setState({ steps: this.state.steps + 1 });
      this.setState({ message: "" });

      coordinates.x -= 1;
      return this.state.index - 1;
    }
    if (direction === "right") {
      this.setState({ steps: this.state.steps + 1 });
      this.setState({ message: "" });

      coordinates.x += 1;
      return this.state.index + 1;
    }
    if (direction === "reset") {
      this.setState({ email: initialEmail });
      this.setState({ steps: initialSteps });
      this.setState({ message: "" });

      coordinates.x = 2;
      coordinates.y = 2;
      return 4;
    }

    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  };

  move = (evt) => {
    this.setState({ index: this.getNextIndex(evt) });

    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
    // You will need this to update the value of the input.
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post("http://localhost:9000/api/result", {
        x: coordinates.x,
        y: coordinates.y,
        steps: this.state.steps,
        email: this.state.email,
      })
      .then((res) => this.setState({ message: res.data.message }))
      .catch((err) =>
        err.message === "Request failed with status code 403"
          ? this.setState({ message: err.response.data.message })
          : this.state.email === ""
          ? this.setState({ message: "Ouch: email is required" })
          : this.setState({ message: "Ouch: email must be a valid email" })
      )
      .finally(() => {
        this.setState({ email: initialEmail });
      });

    // Use a POST request to send a payload to the server.
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move("left")}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move("up")}>
            UP
          </button>
          <button id="right" onClick={() => this.move("right")}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move("down")}>
            DOWN
          </button>
          <button id="reset" onClick={() => this.move("reset")}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
