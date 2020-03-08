import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import Circle from "./Circle";
import { ProgressBar } from 'react-bootstrap'
import 'animate.css'
const liff = window.liff;

const defaults = {
  list: [
    {
      id: 100,
      name: "5000元京东卡",
      image: "1.png",
      rank: 1,
      percent: 3
    },
    {
      id: 101,
      name: "1000元京东卡",
      image: "2.png",
      rank: 2,
      percent: 5
    },
    {
      id: 102,
      name: "100个比特币",
      image: "3.png",
      rank: 3,
      percent: 2
    },
    {
      id: 103,
      name: "50元话费",
      image: "4.png",
      rank: 4,
      percent: 49
    },
    {
      id: 104,
      name: "100元话费",
      image: "5.png",
      rank: 5,
      percent: 30
    },
    {
      id: 105,
      name: "500个比特币",
      image: "6.png",
      rank: 6,
      percent: 1
    },
    {
      id: 106,
      name: "500元京东卡",
      image: "7.png",
      rank: 7,
      percent: 10
    }
  ],
  outerCircle: {
    color: "#df1e15"
  },
  innerCircle: {
    color: "#f4ad26"
  },
  dots: ["#fbf0a9", "#fbb936"],
  disk: [
    "#ffb933",
    "#ffe8b5",
    "#ffb933",
    "#ffd57c",
    "#ffb933",
    "#ffe8b5",
    "#ffd57c"
  ],
  title: {
    color: "#5c1e08",
    font: "19px Arial"
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myLiffId = props.liffId;
    this.state = {
      name: props.name,
      resourceLoaded: false,
      progress: 20,
      prizeList: defaults,
      prizeImages: [],
      startPressed: false
    };
  }

  async componentDidMount() {
    try {
      console.log(liff);
      await this.initializeLiff(this.myLiffId);
      let profile = await liff.getProfile();
      let displayName = profile.displayName;
      this.setState({
        name: displayName,
        progress: 100
      });
    } catch (error) {
      console.log(error);
      this.setState({
        progress: 45
      })
    }
    let loadedImage = [];
    for (const item of this.state.prizeList.list) {
      let image = await this.loadImage(item.image);
      loadedImage.push(image);
    }
    this.setState({
      progress: 100,
      prizeImages: loadedImage
    })
  }

  initializeLiff(myLiffId) {
    return liff.init({ liffId: myLiffId });
  }

  loadImage(imageSrc) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = imageSrc;
      img.onerror = reject;
      img.onload = () => {
        resolve(img);
      };
    });
  }

  render() {
    let loading = this.state.progress <= 100 ? true : false;
    let finishLoading = this.state.progress === 100 ? true : false
    let introducing = this.state.resourceLoaded;
    let started = this.state.startPressed;
    let progressFadeOutAnimation = finishLoading ? "animated fadeOut delay-1s" : "";
    let zoomIn = `animated zoomIn faster`
    return (
      <div className="App">
        <div className="App-header">
          {loading && !introducing && <ProgressBar
            className={`nes-progress ${progressFadeOutAnimation}`}
            variant="success"
            onAnimationEnd={() => { this.setState({ resourceLoaded: true }) }}
            style={{ width: `60%` }}
            animated
            now={this.state.progress}
            label={`loading user info ${this.state.progress}%`}></ProgressBar>}
          {introducing && !started && <div
            className={`nes-container is-dark with-title`}>
            <p className="title">玉山轉盤</p>
            <p>{`Hello, ${this.state.name}`}<br/>{`這是一個小遊戲的介紹`}<br/>{`我是介紹我是介紹我是介紹`}</p>
          </div>}
          {introducing && !started && <button
            type="button"
            className={`nes-btn is-success ${zoomIn}`}
            onClick={() => this.setState({ startPressed: true })}>Start</button>}
          {started && <Circle
            prizeImages={this.state.prizeImages}
            defaults={this.state.prizeList} />}
        </div>
      </div>
    );
  }
}

export default App;
