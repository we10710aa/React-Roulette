import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import Circle from "./Circle";
import { ProgressBar } from 'react-bootstrap'
import 'animate.css'
import { Redirect } from 'react-router-dom'
const liff = window.liff;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myLiffId = props.liffId;
    this.state = {
      name: props.name,
      resourceLoaded: false,
      progress: 20,
      prizeList: {},
      prizeImages: [],
      startPressed: false
    };
  }

  async componentDidMount() {
    try {
      console.log(liff);
      await this.initializeLiff(this.myLiffId);
      let profile = await liff.getProfile();
      await liff.sendMessages([{
        type: 'text',
        text: 'Hello!'
      }])
      let displayName = profile.displayName;
      this.setState({
        name: displayName,
        progress: 30
      });
    } catch (error) {
      console.log(error);
      this.setState({
        needLogin: true,
      })
    }

    let prizeList = await this.loadPrizeList();
    this.setState({
      progress: 45,
      prizeList: prizeList
    })

    let loadedImage = [];
    for (const item of this.state.prizeList.list) {
      let image = await this.loadImage(item.image);
      loadedImage.push(image);
      this.setState((oldState) => { return { progress: oldState.progress + 5 } })
    }
    this.setState({
      progress: 100,
      prizeImages: loadedImage
    })
  }

  initializeLiff(myLiffId) {
    return liff.init({ liffId: myLiffId });
  }

  async loadPrizeList() {
    const response = await fetch('https://www.raymondplayground.xyz/roulette/prizes');
    const result = await response.json();
    return result;
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
    if (this.state.needLogin) {
      const clientID = '1653860398';
      const redirectUri = 'https://www.raymondplayground.xyz/rouletteApp'
      const redirect = encodeURI(`https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}&scope=profile%20openid%20email&state=1234`);
      console.log(redirect)
      return <Redirect to={'/liff'}></Redirect>
    }
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
            label={`努力加載中 ${this.state.progress}%`}></ProgressBar>}
          {introducing && !started && <div
            className={`nes-container is-dark with-title`}>
            <p className="title">玉山轉盤</p>
            <p>{`Hello, ${this.state.name}`}<br />{`這是一個小遊戲的介紹`}<br />{`我是介紹我是介紹我是介紹`}</p>
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
