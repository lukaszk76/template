const updateProperties = (elem, state) => {
  elem.style.setProperty("--x", `${state.x}px`);
  elem.style.setProperty("--y", `${state.y}px`);
  elem.style.setProperty("--width", `${state.width}px`);
  elem.style.setProperty("--height", `${state.height}px`);
  elem.style.setProperty("--radius", state.radius);
  elem.style.setProperty("--scale", state.scale);
  elem.style.opacity = "0.9";
  elem.style.setProperty("--shadow1", state.shadow1);
  elem.style.setProperty("--shadow2", state.shadow2);
  elem.style.setProperty("--shadowColor", state.shadowColor);
};

const addCursorPointer = () => {
  const cursorPointer = document.querySelector(".cursor-pointer");
  let timeout;
  //follow cursor on mousemove
  document.addEventListener("mousemove", (e) => {
    let x = e.clientX;
    let y = e.clientY;
    cursorPointer.style.top = y + "px";
    cursorPointer.style.left = x + "px";
    cursorPointer.style.opacity = "0.9";
    cursorPointer.style.display = "block";

    //cursor effects when mouse stopped
    function mouseStopped() {
      cursorPointer.style.opacity = "0";
    }

    clearTimeout(timeout);
    timeout = setTimeout(mouseStopped, 5000);
  });
  //cursor effects when mouseout
  document.addEventListener("mouseout", () => {
    cursorPointer.style.display = "none";
  });
};

const addCursorCircle = () => {
  document.querySelectorAll(".cursor").forEach((cursor) => {
    let onElement;

    const createState = (e) => {
      const defaultState = {
        x: e.clientX,
        y: e.clientY,
        width: 40,
        height: 40,
        radius: "50%",
        shadow1: "3px",
        shadow2: "1px",
        shadowColor: "#F7544D",
      };

      const computedState = {};

      if (onElement != null) {
        const { top, left, width, height } = onElement.getBoundingClientRect();
        const radius = window.getComputedStyle(onElement).borderTopLeftRadius;

        computedState.x = left + width / 2;
        computedState.y = top + height / 2;
        computedState.width = width;
        computedState.height = height;
        computedState.radius = radius;
        computedState.shadow1 = "5px";
        computedState.shadow2 = "2px";
        computedState.shadowColor = "#F7544D";
      }

      return {
        ...defaultState,
        ...computedState,
      };
    };

    let timeout;
    document.addEventListener("mousemove", (e) => {
      const state = createState(e);
      updateProperties(cursor, state);
      function mouseStopped() {
        cursor.style.opacity = "0.3";
      }

      clearTimeout(timeout);
      timeout = setTimeout(mouseStopped, 5000);
    });

    document
      .querySelectorAll("a, button, input, textarea, .selectable")
      .forEach((elem) => {
        elem.addEventListener("mouseenter", () => (onElement = elem));
        elem.addEventListener("mouseleave", () => (onElement = null));
      });
  });
};

export const addAnimatedCursor = () => {
  addCursorCircle();
  addCursorPointer();
};
