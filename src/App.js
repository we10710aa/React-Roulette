import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import Circle from "./Circle";
import { animated, useTransition } from 'react-spring';
const liff = window.liff;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myLiffId = props.liffId;
    this.state = {
      name: props.name
    };
  }

  async componentDidMount() {
    try {
      console.log(liff);
      await this.initializeLiff(this.myLiffId);
      let profile = await liff.getProfile();
      let displayName = profile.displayName;
      this.setState({
        name: displayName
      });
    } catch (error) {
      console.log(error);
    }
  }

  initializeLiff(myLiffId) {
    return liff.init({ liffId: myLiffId });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Circle text="Raylmond" />
          <div className="nes-container is-rounded is-centered">
            <p>Welcome, {this.state.name}!</p>
          </div>
          <button className="nes-btn is-primary" variant="primary">Esun Lucky Wheelz</button>
          <button type="button" className="nes-btn is-warning">Warning</button>
        </header>
      </div>
    );
  }
}

export default App;
