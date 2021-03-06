function mapToColor(density) {
  const densityLog = Math.log10(density);

  if (densityLog < -3) {
    return "#ff0000";
  }
  if (densityLog < -2) {
    return "#fff000";
  }
  if (densityLog < -1) {
    return "#ffffff";
  }
  return "#0088ff";
}

function genUniverse() {
  let masses = [];
  let radiuses = [];
  let densities = [];

  for (let i = 0; i < 50; i++) {
    masses[i] = Math.random() * 49 + 1;
    radiuses[i] = Math.random() * 49 + 1;
    densities[i] = masses[i] / (radiuses[i] * radiuses[i] * Math.PI);

    const color = mapToColor(densities[i]);

    let star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.ceil(Math.random() * window.innerWidth);
    star.style.top = Math.ceil(Math.random() * window.innerHeight);
    star.style.borderRadius = radiuses[i] + "px";
    star.style.height = 2 * radiuses[i] + "px";
    star.style.width = 2 * radiuses[i] + "px";
    star.style.backgroundColor = color;
    star.style.boxShadow = "0 0 " + radiuses[i] + "px " + color;
    document.body.appendChild(star);
  }

  return { masses, radiuses, densities };
}

function initialize(stars) {
  let positions = [];
  let velocities = [];

  for (let i = 0; i < stars.length; i++) {
    let position = [];
    let velocity = [0, 0];
    position.push(parseInt(stars[i].style.left.split("p")[0]));
    position.push(parseInt(stars[i].style.top.split("p")[0]));

    positions.push(position);
    velocities.push(velocity);
  }

  return { positions, velocities };
}

function computeAcceleration(positions, gravityConstant, masses) {
  let accelerations = [];
  for (let i = 0; i < positions.length; i++) {
    let acceleration = [0, 0];
    for (let j = 0; j < positions.length; j++) {
      if (i != j) {
        const distanceSquared =
          Math.pow(positions[i][0] - positions[j][0], 2) +
          Math.pow(positions[i][1] - positions[j][1], 2);

        const distance = Math.sqrt(distanceSquared);

        if (distance > 5) {
          acceleration[0] +=
            ((positions[j][0] - positions[i][0]) /
              (distanceSquared * distance)) *
            gravityConstant *
            masses[j];
          acceleration[1] +=
            ((positions[j][1] - positions[i][1]) /
              (distanceSquared * distance)) *
            gravityConstant *
            masses[j];
        }
      }
    }
    accelerations.push(acceleration);
  }
  return accelerations;
}

function computeVelocity(accelerations, velocities) {
  let newVelocities = [];
  for (let i = 0; i < velocities.length; i++) {
    let newVelocity = velocities[i];

    newVelocity[0] += accelerations[i][0];
    newVelocity[1] += accelerations[i][1];

    newVelocities.push(newVelocity);
  }

  return newVelocities;
}

function computePositions(positions, velocities) {
  let newPositions = [];
  for (let i = 0; i < positions.length; i++) {
    let newPosition = positions[i];

    newPosition[0] += velocities[i][0];
    newPosition[1] += velocities[i][1];

    newPositions.push(newPosition);
  }
  return newPositions;
}

function updateUI(positions, elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.left = Math.round(positions[i][0]) + "px";
    elements[i].style.top = Math.round(positions[i][1]) + "px";
  }
}

let { radiuses, masses } = genUniverse();
let stars = document.getElementsByClassName("star");

let { positions, velocities } = initialize(stars);

const gravityConstant = 1;

setInterval(() => {
  let accelerations = computeAcceleration(positions, gravityConstant, masses);
  velocities = computeVelocity(accelerations, velocities);
  positions = computePositions(positions, velocities);
  updateUI(positions, stars);
}, 1);
