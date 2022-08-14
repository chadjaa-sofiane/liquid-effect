const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "red";

const throtling = (func, wait) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const updateCanvasSize = throtling(() => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(canvas.width, canvas.height);
}, 1000);

window.addEventListener("resize", updateCanvasSize);

const mouse = {
  x: 0,
  y: 0,
  radius: 100,
};

const updateMousePosition = (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

const updateMouseRadius = (e) => {
  if (mouse.radius > 500 && e.deltaY > 0) return;
  if (mouse.radius <= 0 && e.deltaY < 0) return;
  mouse.radius += e.deltaY / 10;
};

document.addEventListener("mousemove", updateMousePosition);
document.addEventListener("wheel", updateMouseRadius);

const createMetaBall = (container) => {
  let x = container.x;
  let y = container.y;
  let radius = container.radius;
  let speedX = 1;
  let speedY = 1;
  let density = Math.random() * 100 + 0.1;
  return {
    update: () => {
      let dx = mouse.x - x;
      let dy = mouse.y - y;
      const distance = Math.sqrt(dx ** 2 + dy ** 2) - radius / 2;
      let gravity = mouse.radius / radius;
      if (distance <= mouse.radius) {
        const forseDirectionX = dx / distance;
        const forseDirectionY = dy / distance;
        const forse = 1 - mouse.radius / distance;
        x += forseDirectionX * forse * density * gravity;
        y += forseDirectionY * forse * density * gravity;
      } else {
        if (x < 0 || x > container.width) {
          speedX = -speedX;
        }
        if (y < 0 || y > container.height) {
          speedY = -speedY;
        }
        x += speedX;
        y += speedY;
      }
    },
    draw: (ctx) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.fill();
    },
  };
};

const createLiquidEffect = ({ width, height }) => {
  const liquidBalls = [];
  return {
    liquidBalls,
    init: (number) => {
      for (let i = 0; i < number; i++) {
        liquidBalls.push(
          createMetaBall({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 80 + 20,
            width,
            height,
          })
        );
      }
    },
    update: () => {
      liquidBalls.forEach((ball) => ball.update());
    },
    draw: (ctx) => {
      liquidBalls.forEach((ball) => ball.draw(ctx));
      console.log(width, height);
      ctx.strokeStyle = "white";
      // save the context state
      ctx.save();
      ctx.fillStyle = "rgba(255,0,0,0.5)";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    },
    setSize: (width, height) => {
      width = width;
      height = height;
    },
  };
};

const liquidEffect = createLiquidEffect(canvas);
liquidEffect.init(50);

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  liquidEffect.update();
  liquidEffect.draw(ctx);
  requestAnimationFrame(animate);
};
animate();
