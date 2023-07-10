const BASE_URL = "https://11tibi.github.io/solar-system/";

let planets = [];
let sun;
let ship;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  jupiter = loadImage(`${BASE_URL}assets/jupiter.jpg`);
  venus = loadImage(`${BASE_URL}assets/venus.jpg`);
  earth = loadImage(`${BASE_URL}assets/earth.jpg`);
  mars = loadImage(`${BASE_URL}assets/mars.jpg`);
  mercury = loadImage(`${BASE_URL}assets/mercury.jpg`);
  neptune = loadImage(`${BASE_URL}assets/neptune.jpg`);
  saturn = loadImage(`${BASE_URL}assets/saturn.jpg`);
  saturnRing = loadImage(`${BASE_URL}assets/saturn_ring.jpg`);
  uranus = loadImage(`${BASE_URL}assets/uranus.jpg`);
  stars = loadImage(`${BASE_URL}assets/stars.jpg`);
  sunImg = loadImage(`${BASE_URL}assets/sun.jpg`);
  shipTexture = loadImage(`${BASE_URL}assets/ShipOrange.png`);
  shipModel = loadModel(`${BASE_URL}assets/Ship.obj`, true);

  planets.push(new Planet(0.0015, 1250, 60, neptune));
  planets.push(new Planet(0.002, 1100, 65, uranus));
  planets.push(new PlanetWithRing(0.003, 900, 75, saturn, saturnRing));
  planets.push(new Planet(0.003, 680, 85, jupiter));
  planets.push(new Planet(0.008, 550, 35, mars));
  planets.push(new Planet(0.01, 400, 55, earth));
  planets.push(new Planet(0.005, 250, 40, venus));
  planets.push(new Planet(0.01, 150, 20, mercury));
  sun = new Sun(70, sunImg);
  ship = new Ship(shipModel, shipTexture);

  camera(0, 600, 400);
}

function draw() {
  background(0);
  orbitControl();
  planets.forEach(planet => {
    planet.draw();
  });
  sun.draw();
  ship.move();
  ship.draw();
}

class Planet {
  constructor(rotationSpeed, distanceFromSun, planetRadius, planetImg) {
    this.angle = random(TWO_PI);
    this.rotationSpeed = rotationSpeed;
    this.distanceFromSun = distanceFromSun;
    this.planetRadius = planetRadius;
    this.planetImg = planetImg;
  }

  drawPlanet() {
    this.angle += this.rotationSpeed;
    const x = this.distanceFromSun * cos(this.angle);
    const y = this.distanceFromSun * sin(this.angle);
    push();
    translate(x, y, 0);
    rotateX(-PI/2)
    rotateY(frameCount * 0.005);
    texture(this.planetImg);
    sphere(this.planetRadius);
    pop();
  }

  drawRing() {
    push();
    translate(0, 0, 0);
    torus(this.distanceFromSun, 0.5);
    pop();
  }

  draw() {
    this.drawRing();
    this.drawPlanet();
  }
}

class PlanetWithRing extends Planet {
  constructor(rotationSpeed, distanceFromSun, planetRadius, planetImg, ringImage) {
    super(rotationSpeed, distanceFromSun, planetRadius, planetImg);
    this.ringImage = ringImage;
  }

  draw() {
    super.draw();
    this.angle += this.rotationSpeed;
    const x = this.distanceFromSun * cos(this.angle);
    const y = this.distanceFromSun * sin(this.angle);
    push();
    translate(x, y, 0);
    texture(this.ringImage);
    torus(this.planetRadius + 40, 20);
    pop();
  }
}

class Sun {
  constructor(sunRadius, sunImg) {
    this.sunRadius = sunRadius;
    this.sunImg = sunImg;
  }

  draw() {
    push();
    translate(0, 0, 0);
    texture(this.sunImg);
    sphere(this.sunRadius);
    pop();
  }
}

class Ship {
  constructor(shipModel, shipTexture) {
    this.shipModel = shipModel;
    this.shipTexture = shipTexture;
    this.X = random(1000);
    this.Y = 0;
    this.Z = random(1000);
    this.speed = 8
    this.direction  = 0;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.X -= this.speed;
      this.direction = -PI / 2;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.X += this.speed;
      this.direction = PI / 2;
    }
    if (keyIsDown(UP_ARROW)) {
      this.Z += this.speed;
      this.direction = 0;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.Z -= this.speed;
      this.direction = PI;
    }
  }

  draw() {
    push();
    rotateX(PI / 2);
    scale(0.3);
    translate(this.X, this.Y, this.Z);
    rotateY(this.direction);
    texture(this.shipTexture);
    model(this.shipModel);
    pop();
  }
}
