const frames = 24;
const refreshRate = 1000 / frames;
const speed = 7;

const minSize = 10;
const maxSize = 40;

const floaterCount = 42;
const floaterContainer = document.getElementById("floaterContainer");

// handle attractor movement
let attractor = {
  x: 0,
  y: 0,
};
function updateAttractor() {
  attractor.x = Math.random() * window.innerWidth;
  attractor.y = Math.random() * window.innerHeight;
}
updateAttractor();

// the floater class
class Floater {
  constructor() {
    this.obj = document.createElement("div");
    this.obj.classList.add("floater");
    document.body.appendChild(this.obj);
    this.pos = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };
    this.target = {
      x: window.innerWidth / 2,
      y: window.innerWidth / 2,
    };
    this.size = 20;
  }

  draw() {
    // set the size
    this.obj.style.width = `${this.size}px`;
    this.obj.style.height = `${this.size}px`;
    // set the pos
    this.obj.style.left = `${this.pos.x - this.size / 2}px`;
    this.obj.style.top = `${this.pos.y - this.size / 2}px`;
  }

  update() {
    // let the attractor coords influence the target.
    let attractorWeight =
      Math.hypot(this.pos.x - attractor.x, this.pos.y - attractor.y) / 10;
    let normalWeight = 1000;
    this.target.x =
      (attractorWeight * attractor.x + normalWeight * this.target.x) /
      (attractorWeight + normalWeight);
    this.target.y =
      (attractorWeight * attractor.y + normalWeight * this.target.y) /
      (attractorWeight + normalWeight);

    let dx = this.target.x - this.pos.x;
    let dy = this.target.y - this.pos.y;

    dx *= speed / 100;
    dy *= speed / 100;

    let velo = Math.hypot(dy, dx);

    this.pos.x += Math.round(dx);
    this.pos.y += Math.round(dy);

    this.size = Math.max(minSize, Math.min(maxSize, velo * 3));

    this.obj.style.opacity = Math.max(velo / 50, 0.4);

    this.draw();

    let turbMultiplier = velo != 0 ? speed / velo : 0; // more speed = less disruption

    this.target.x += Math.cbrt(Math.random() - 0.5) * turbMultiplier;
    this.target.y += Math.cbrt(Math.random() - 0.5) * turbMultiplier;
  }

  erase() {
    this.obj.remove();
  }
}

let floaters = [];
for (let i = 0; i < floaterCount; i++) {
  floaters.push(new Floater());
}

function updateAll() {
  floaters.forEach((floater) => floater.update());
}

setInterval(updateAll, refreshRate);

// remove a floater
function popFloater() {
  if (floaters.length == 0) return;
  let floater = floaters.shift();
  floater.erase();
}

function addFloater() {
  floaters.push(new Floater());
}

setInterval(popFloater, 10000);
setInterval(addFloater, 10000);
setInterval(updateAttractor, 20000);

document.addEventListener("keydown", (event) => {
  if (event.key == " ") {
    updateAttractor();
  }
});
