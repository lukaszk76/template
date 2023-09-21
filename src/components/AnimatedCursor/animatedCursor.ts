import "./animatedCursor.css";

interface State {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: string;
  shadow1: string;
  shadow2: string;
  shadowColor: string;
  scale: string;
}

const updateProperties = (elem: HTMLElement, state: State) => {
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
  const cursorPointer = document.querySelector(
    ".cursor-pointer",
  ) as HTMLElement;
  let timeout: NodeJS.Timeout;
  //follow cursor on mousemove
  document.addEventListener("mousemove", (e) => {
    if (cursorPointer == null) return;

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
  const cursors = document.querySelectorAll(
    ".cursor",
  ) as NodeListOf<HTMLDivElement>;

  cursors.forEach((cursor) => {
    let onElement: HTMLElement | null = null;

    const createState = (e: MouseEvent) => {
      const defaultState = {
        x: e.clientX,
        y: e.clientY,
        width: 40,
        height: 40,
        radius: "50%",
        shadow1: "3px",
        shadow2: "1px",
        shadowColor: "hsl(var(--accent-foreground))",
      };

      const computedState = {} as State;

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
        computedState.shadowColor = "hsl(var(--accent-foreground))";
      }

      return {
        ...defaultState,
        ...computedState,
      };
    };

    let timeout: NodeJS.Timeout;
    document.addEventListener("mousemove", (e) => {
      const state = createState(e);
      updateProperties(cursor, state);
      function mouseStopped() {
        cursor.style.opacity = "0.3";
      }

      clearTimeout(timeout);
      timeout = setTimeout(mouseStopped, 5000);
    });

    const elements = document.querySelectorAll(
      "a, button, input, textarea, .selectable",
    ) as NodeListOf<HTMLElement>;

    elements.forEach((elem) => {
      elem.addEventListener("mouseenter", () => (onElement = elem));
      elem.addEventListener("mouseleave", () => (onElement = null));
    });
  });
};

export const addAnimatedCursor = () => {
  addCursorCircle();
  addCursorPointer();
};
