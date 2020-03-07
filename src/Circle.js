import React from "react";
import BezierEasing from "bezier-easing";

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

class Circle extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.rotationDegree = 0;
    this.state = {};
  }

  drawCanvas(rotationDegree) {
    rotationDegree = rotationDegree || 0;
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    let oneDegreeInRad = (2 * Math.PI) / 360;
    let angel = oneDegreeInRad * (360 / defaults.list.length);
    let startAngel = oneDegreeInRad * -90;
    let endAngel = oneDegreeInRad * -90 + angel;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotationDegree * oneDegreeInRad);

    ctx.beginPath();
    ctx.lineWidth = 25;
    ctx.strokeStyle = defaults.outerCircle.color;
    ctx.arc(0, 0, 243, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 23;
    ctx.strokeStyle = defaults.innerCircle.color;
    ctx.arc(0, 0, 218, 0, 2 * Math.PI);
    ctx.stroke();

    let dotColors = defaults.dots;
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

    let colors = defaults.disk;
    for (let i = 0; i < defaults.list.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = 208;
      ctx.strokeStyle = colors[i % colors.length];
      ctx.arc(0, 0, 104, startAngel, endAngel);
      ctx.stroke();
      startAngel = endAngel;
      endAngel += angel;
    }
    startAngel = angel / 2;
    for (let i = 0; i < defaults.list.length; i++) {
      ctx.save();
      ctx.rotate(startAngel);
      ctx.drawImage(defaults.list[i].img, -48, -48 - 130);
      ctx.fillStyle = defaults.title.color;
      ctx.font = defaults.title.font;
      ctx.textAlign = "center";
      ctx.fillText(defaults.list[i].name, 0, -170);
      startAngel += angel;
      ctx.restore();
    }
    ctx.restore();
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

  async componentDidMount() {
    for (const item of defaults.list) {
      item.img = await this.loadImage(item.image);
    }
    this.drawCanvas(this.rotationDegree);
  }

  componentDidUpdate() {
    this.drawCanvas(this.rotationDegree);
  }

  handleClick() {
    const finalDegree = 15;
    const atLeastDegree = 2520;
    const rotation = finalDegree + atLeastDegree;
    /*
    //每秒60格，每16.6毫秒一格
    //easeIn flatDuration easeOut 單位毫秒
    //minSpeed maxSpeed 單位度/秒
    const easeInMs = 500;
    const flatMs = 2000;
    const minSpeed = 0 * 0.016;
    const maxSpeed = 600 * 0.016;
    const easeInFrames = easeInMs * 0.06;
    const flatFrames = flatMs * 0.06;
    const easeOutFrames = (rotation - (maxSpeed * easeInFrames/3) - (maxSpeed * flatFrames)) * 1.5 / maxSpeed;
    const easeFunction = this.genEaseFunction(
      minSpeed,
      maxSpeed,
      easeInFrames,
      flatFrames,
      easeOutFrames
    );
    */
    let frames = 0;
    let angle = this.rotationDegree;
    const easeFunction = BezierEasing(0.07, -0.12, 0, 0.98);
    const update = () => {
      /*
      frames += 1;
      if (frames > easeInFrames + easeOutFrames + flatFrames) {
        console.log(angle);
        return;
      }
      */
      frames = frames + 1;
      if (frames > 600) {
        this.rotationDegree = (angle + rotation) % 360;
        console.log(this.rotationDegree);
        return;
      }
      let roDegree = easeFunction(frames / 600) * rotation;
      this.drawCanvas((angle + roDegree) % 360);
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  }

  genEaseFunction(min, max, easeInDuration, flatDuration, easeOutDuration) {
    let startEaseOut = easeInDuration + flatDuration;
    let end = easeInDuration + flatDuration + easeOutDuration;
    let height = max - min;
    return x => {
      if (x <= easeInDuration) {
        return (height * (x * x)) / (easeInDuration * easeInDuration) + min;
      } else if (x > easeInDuration && x <= startEaseOut) {
        return max;
      } else if (x > startEaseOut && x <= end) {
        return (
          max -
          (height * (x - startEaseOut) * (x - startEaseOut)) /
            (easeOutDuration * easeOutDuration)
        );
      } else {
        return min;
      }
    };
  }

  render() {
    return (
      <div className="lottery">
        <canvas
          className="turntable-canvas"
          ref={this.canvasRef}
          width={600}
          height={600}
        />
        <img
          alt="start lottery"
          src="start.png"
          onClick={() => this.handleClick()}
        ></img>
      </div>
    );
  }
}

export default Circle;
