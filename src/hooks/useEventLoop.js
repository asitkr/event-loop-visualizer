// import { useState, useRef } from "react";

// let idCounter = 0;

// const createTask = (name, type, delay = 0) => ({
//     id: `${type}-${idCounter++}`,
//     name,
//     type,
//     delay,
// });

// export const useEventLoop = () => {
//     const [state, setState] = useState({
//         callStack: [],
//         webApi: [],
//         microtaskQueue: [],
//         callbackQueue: [],
//         logs: [],
//         step: 0,
//         isRunning: false,
//         isPaused: false,
//     });

//     const taskQueue = useRef([]);

//     const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

//     const parseCode = (code) => {
//         const lines = code.split("\n");
//         const tasks = [];

//         lines.forEach((line) => {
//             const trimmed = line.trim();

//             if (trimmed.startsWith("console.log")) {
//                 const match = trimmed.match(/console\.log\((.*)\)/);
//                 tasks.push({
//                     type: "sync",
//                     label: match ? match[1].replace(/['"]/g, "") : "log",
//                 });
//             }

//             if (trimmed.includes("setTimeout")) {
//                 const delayMatch = trimmed.match(/,\s*(\d+)\)/);
//                 const delay = delayMatch ? Number(delayMatch[1]) : 0;

//                 tasks.push({
//                     type: "macro",
//                     label: "setTimeout callback",
//                     delay,
//                 });
//             }

//             if (trimmed.includes("Promise")) {
//                 tasks.push({
//                     type: "micro",
//                     label: "Promise.then callback",
//                 });
//             }
//         });

//         return tasks;
//     };

//     const runEventLoop = async () => {
//         while (taskQueue.current.length > 0) {
//             const task = taskQueue.current.shift();

//             setState((prev) => ({
//                 ...prev,
//                 step: prev.step + 1,
//             }));

//             if (task.type === "sync") {
//                 const stackTask = createTask(task.label, "SYNC");

//                 setState((prev) => ({
//                     ...prev,
//                     callStack: [stackTask],
//                 }));

//                 await sleep(1200);

//                 setState((prev) => ({
//                     ...prev,
//                     callStack: [],
//                     logs: [...prev.logs, task.label],
//                 }));
//             }

//             if (task.type === "macro") {
//                 const apiTask = createTask(task.label, "TIMEOUT", task.delay);

//                 setState((prev) => ({
//                     ...prev,
//                     webApi: [...prev.webApi, apiTask],
//                 }));

//                 await sleep(1200);

//                 setState((prev) => ({
//                     ...prev,
//                     webApi: prev.webApi.filter((t) => t.id !== apiTask.id),
//                     callbackQueue: [...prev.callbackQueue, apiTask],
//                 }));
//             }

//             if (task.type === "micro") {
//                 const apiTask = createTask(task.label, "PROMISE");

//                 setState((prev) => ({
//                     ...prev,
//                     webApi: [...prev.webApi, apiTask],
//                 }));

//                 await sleep(1200);

//                 setState((prev) => ({
//                     ...prev,
//                     webApi: prev.webApi.filter((t) => t.id !== apiTask.id),
//                     microtaskQueue: [...prev.microtaskQueue, apiTask],
//                 }));
//             }

//             await sleep(600);

//             // Microtask priority
//             setState((prev) => {
//                 if (prev.microtaskQueue.length > 0) {
//                     const task = prev.microtaskQueue[0];

//                     return {
//                         ...prev,
//                         microtaskQueue: prev.microtaskQueue.slice(1),
//                         callStack: [task],
//                     };
//                 }

//                 if (prev.callbackQueue.length > 0) {
//                     const task = prev.callbackQueue[0];

//                     return {
//                         ...prev,
//                         callbackQueue: prev.callbackQueue.slice(1),
//                         callStack: [task],
//                     };
//                 }

//                 return prev;
//             });

//             await sleep(1200);

//             setState((prev) => ({
//                 ...prev,
//                 callStack: [],
//             }));
//         }

//         setState((prev) => ({
//             ...prev,
//             isRunning: false,
//         }));
//     };

//     const run = (code) => {
//         reset();
//         const tasks = parseCode(code);
//         taskQueue.current = tasks;

//         setState((prev) => ({
//             ...prev,
//             isRunning: true,
//         }));

//         runEventLoop();
//     };

//     const reset = () => {
//         taskQueue.current = [];

//         setState({
//             callStack: [],
//             webApi: [],
//             microtaskQueue: [],
//             callbackQueue: [],
//             logs: [],
//             step: 0,
//             isRunning: false,
//             isPaused: false,
//         });
//     };

//     const togglePause = () => {
//         setState((prev) => ({
//             ...prev,
//             isPaused: !prev.isPaused,
//         }));
//     };

//     return {
//         ...state,
//         run,
//         reset,
//         togglePause,
//     };
// };


import { useState, useRef } from "react";

let idCounter = 0;

const createTask = (name, type, delay = 0) => ({
    id: `${type}-${idCounter++}`,
    name,
    type,
    delay,
});

export const useEventLoop = () => {
    const [state, setState] = useState({
        callStack: [],
        webApi: [],
        microtaskQueue: [],
        callbackQueue: [],
        logs: [],
        step: 0,
        isRunning: false,
        isPaused: false,
    });

    // ✅ Speed state added
    const [speed, setSpeed] = useState(1.5); // default slower

    const taskQueue = useRef([]);

    // ✅ sleep uses speed multiplier
    const sleep = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms * speed));

    const parseCode = (code) => {
        const lines = code.split("\n");
        const tasks = [];

        lines.forEach((line) => {
            const trimmed = line.trim();

            if (trimmed.startsWith("console.log")) {
                const match = trimmed.match(/console\.log\((.*)\)/);
                tasks.push({
                    type: "sync",
                    label: match ? match[1].replace(/['"]/g, "") : "log",
                });
            }

            if (trimmed.includes("setTimeout")) {
                const delayMatch = trimmed.match(/,\s*(\d+)\)/);
                const delay = delayMatch ? Number(delayMatch[1]) : 0;

                tasks.push({
                    type: "macro",
                    label: "setTimeout callback",
                    delay,
                });
            }

            if (trimmed.includes("Promise")) {
                tasks.push({
                    type: "micro",
                    label: "Promise.then callback",
                });
            }
        });

        return tasks;
    };

    const runEventLoop = async () => {
        while (taskQueue.current.length > 0) {
            const task = taskQueue.current.shift();

            setState((prev) => ({
                ...prev,
                step: prev.step + 1,
            }));

            // ---------------- SYNC ----------------
            if (task.type === "sync") {
                const stackTask = createTask(task.label, "SYNC");

                setState((prev) => ({
                    ...prev,
                    callStack: [stackTask],
                }));

                await sleep(800);

                setState((prev) => ({
                    ...prev,
                    callStack: [],
                    logs: [...prev.logs, task.label],
                }));
            }

            // ---------------- MACRO ----------------
            if (task.type === "macro") {
                const apiTask = createTask(task.label, "TIMEOUT", task.delay);

                setState((prev) => ({
                    ...prev,
                    webApi: [...prev.webApi, apiTask],
                }));

                await sleep(800);

                setState((prev) => ({
                    ...prev,
                    webApi: prev.webApi.filter((t) => t.id !== apiTask.id),
                    callbackQueue: [...prev.callbackQueue, apiTask],
                }));
            }

            // ---------------- MICRO ----------------
            if (task.type === "micro") {
                const apiTask = createTask(task.label, "PROMISE");

                setState((prev) => ({
                    ...prev,
                    webApi: [...prev.webApi, apiTask],
                }));

                await sleep(800);

                setState((prev) => ({
                    ...prev,
                    webApi: prev.webApi.filter((t) => t.id !== apiTask.id),
                    microtaskQueue: [...prev.microtaskQueue, apiTask],
                }));
            }

            await sleep(600);

            // ---------------- EVENT LOOP PRIORITY ----------------
            setState((prev) => {
                if (prev.microtaskQueue.length > 0) {
                    const nextTask = prev.microtaskQueue[0];

                    return {
                        ...prev,
                        microtaskQueue: prev.microtaskQueue.slice(1),
                        callStack: [nextTask],
                    };
                }

                if (prev.callbackQueue.length > 0) {
                    const nextTask = prev.callbackQueue[0];

                    return {
                        ...prev,
                        callbackQueue: prev.callbackQueue.slice(1),
                        callStack: [nextTask],
                    };
                }

                return prev;
            });

            await sleep(800);

            setState((prev) => ({
                ...prev,
                callStack: [],
            }));
        }

        setState((prev) => ({
            ...prev,
            isRunning: false,
        }));
    };

    const run = (code) => {
        reset();
        const tasks = parseCode(code);
        taskQueue.current = tasks;

        setState((prev) => ({
            ...prev,
            isRunning: true,
        }));

        runEventLoop();
    };

    const reset = () => {
        taskQueue.current = [];

        setState({
            callStack: [],
            webApi: [],
            microtaskQueue: [],
            callbackQueue: [],
            logs: [],
            step: 0,
            isRunning: false,
            isPaused: false,
        });
    };

    const togglePause = () => {
        setState((prev) => ({
            ...prev,
            isPaused: !prev.isPaused,
        }));
    };

    return {
        ...state,
        run,
        reset,
        togglePause,
        setSpeed, // ✅ expose this
        speed,    // optional (if you want to display value)
    };
};

