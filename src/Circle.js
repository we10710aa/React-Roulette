import React from "react";
import BezierEasing from "bezier-easing";
import styled from 'styled-components'
import { Modal, Button } from 'react-bootstrap'
import 'animate.css'

const Wrapper = styled.div`
  position: relative;
  display: inline-blick;
`;

const StartButton = styled.img`
  position: absolute;
  top: 50%;
  left:50%;
  width:20%;
  height:calc(20%*1.07);
  margin-left: -10%;
  margin-top: -10%;
`;

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.rotationDegree = 0;
    this.defaults = this.props.defaults;
    this.prizeImages = this.props.prizeImages;
    this.state = {
      rotationDegree: 0,
      leaving: false,
      showDialog: false
    };
  }

  drawCanvas(rotationDegree) {
    rotationDegree = rotationDegree || 0;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    let oneDegreeInRad = (2 * Math.PI) / 360;
    let angel = oneDegreeInRad * (360 / this.defaults.list.length);
    let startAngel = oneDegreeInRad * -90;
    let endAngel = oneDegreeInRad * -90 + angel;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotationDegree * oneDegreeInRad);

    ctx.beginPath();
    ctx.lineWidth = 25;
    ctx.strokeStyle = this.defaults.outerCircle.color;
    ctx.arc(0, 0, 243, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 23;
    ctx.strokeStyle = this.defaults.innerCircle.color;
    ctx.arc(0, 0, 218, 0, 2 * Math.PI);
    ctx.stroke();

    let dotColors = this.defaults.dots;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      let radius = 230;
      let xr = radius * Math.cos(startAngel);
      let yr = radius * Math.sin(startAngel);
      ctx.fillStyle = dotColors[i % dotColors.length];
      ctx.arc(xr, yr, 11, 0, 2 * Math.PI);
      ctx.fill();
      startAngel += ((2 * Math.PI) / 360) * (360 / 12);
    }

    let colors = this.defaults.disk;
    for (let i = 0; i < this.defaults.list.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = 208;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.arc(0, 0, 104, startAngel, endAngel);
      ctx.stroke();
      startAngel = endAngel;
      endAngel += angel;
    }
    startAngel = angel / 2;
    for (let i = 0; i < this.defaults.list.length; i++) {
      ctx.save();
      ctx.rotate(startAngel);
      ctx.drawImage(this.prizeImages[i], -48, -48 - 130);
      ctx.fillStyle = this.defaults.title.color;
      ctx.font = this.defaults.title.font;
      ctx.textAlign = "center";
      ctx.fillText(this.defaults.list[i].name, 0, -170);
      startAngel += angel;
      ctx.restore();
    }
    ctx.restore();
  }

  async componentDidMount() {
    this.drawCanvas(this.state.rotationDegree);
  }

  componentDidUpdate(props) {
    this.drawCanvas(this.state.rotationDegree);
  }

  handleClick() {
    const finalDegree = 15;
    const atLeastDegree = 2520;
    const rotation = finalDegree + atLeastDegree;
    let frames = 0;
    let angle = this.rotationDegree;
    const easeFunction = BezierEasing(0.07, -0.12, 0, 0.98);
    const update = () => {
      frames = frames + 1;
      if (frames > 600) {
        this.rotationDegree = (angle + rotation) % 360;
        this.setState({ showDialog: true })
        return;
      }
      let roDegree = easeFunction(frames / 600) * rotation;
      this.setState({
        rotationDegree: (angle + roDegree) % 360
      })
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  }

  getPrize() {
    
  }

  render() {
    let wrapperClass = 'animated zoomIn faster';
    if (this.state.leaving) {
      wrapperClass = 'animated bounceOutLeft'
    }
    this.defaults = this.props.defaults;
    this.prizeImages = this.props.prizeImages;
    return (
      <div>
        <h1>祝您中獎</h1>
        <Modal show={this.state.showDialog} onHide={() => this.setState({ showDialog: false })}>
          <Modal.Header closeButton>
            <Modal.Title><font color="black">Congrulation</font></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: "black", textAlign: "left" }}>您獲得了: 5000元東京卡</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ showDialog: false })}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Wrapper className={`${wrapperClass}`}>
          <canvas
            className="turntable-canvas"
            ref={this.canvasRef}
            width={600}
            height={600}
          />
          <StartButton
            className="nes-pointer"
            alt="start"
            src="start.png"
            onClick={() => this.handleClick()}>
          </StartButton>
        </Wrapper>
      </div>
    );
  }
}

export default Circle;
