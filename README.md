# 🚀 JavaScript Event Loop Visualizer

An interactive visual tool to understand how the JavaScript Event Loop works.

This project visually demonstrates:

- Call Stack (Synchronous execution)
- Web APIs (Async operations)
- Microtask Queue (Promises)
- Callback Queue (Macrotasks)
- Event Loop behavior & priority handling

---

## 📸 Preview

Visual representation of how JavaScript executes synchronous and asynchronous code.
```

-----------------------------------
|         CODE EDITOR             |
-----------------------------------
| Run | Reset | Speed Control 🎚 |
-----------------------------------
|  Call Stack | Web APIs          |
|  Microtask  | Callback Queue    |
-----------------------------------
```

## 🧠 What This Visualizer Explains

JavaScript is single-threaded, but it can handle asynchronous operations using:

- Call Stack
- Web APIs (Browser APIs)
- Microtask Queue
- Callback Queue
- Event Loop

This tool helps you **see the execution order visually**.

---

## ✨ Features

- 🔴 Visual Call Stack execution
- 🟠 Web API simulation
- 🟣 Microtask Queue (Promise priority)
- 🔵 Macrotask Queue (setTimeout)
- 🎚 Speed control slider
- 📝 Console output logs
- 🧩 Step counter
- 🎨 Modern UI (Tailwind CSS)

---

## 🛠 Tech Stack

- React
- Custom Hook (`useEventLoop`)
- Tailwind CSS
- JavaScript

---

## 📂 Project Structure

```
src/
 ├── components/
 │     ├── CodeEditor.jsx
 │     ├── Legend.jsx
 │     ├── Visualizer.jsx
 │     └── Controls.jsx
 │
 ├── hooks/
 │     └── useEventLoop.js
 │
 └── App.jsx
```

## ▶️ How It Works

User writes JavaScript code in the editor.

Code is parsed into tasks:

console.log() → Sync task

setTimeout() → Macrotask

Promise.then() → Microtask

The visualizer simulates:

Call Stack execution

Web API delay

Queue priority

Microtasks are executed before macrotasks.

Output logs appear step by step.

# 🧪 Example Input
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");

Execution Order:
Start
End
Promise
Timeout

## 🎚 Speed Control

You can control execution speed using the slider:

0.5x → Faster

1x → Normal

2x → Slower

3x → Very Slow

## 🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/event-loop-visualizer.git

2️⃣ Install dependencies
npm install

3️⃣ Start development server
npm run dev

## 📚 Learning Purpose

This project is built to:

Understand JavaScript execution model

Prepare for frontend interviews

Demonstrate async behavior visually

Improve conceptual clarity of Event Loop

## 🎯 Future Improvements

⏸ Proper pause/resume control

👣 Step-by-step execution mode

📊 Timeline view

🔁 Async/Await visualization

🌐 Node.js event loop mode

## 🤝 Contributing

Pull requests are welcome.
For major changes, open an issue first to discuss what you'd like to change.

📄 License

MIT License

## 💡 Author

Built with ❤️ to deeply understand JavaScript internals.

If you want, I can also:

Write a professional GitHub project description

Write LinkedIn post for showcasing this project

Help you deploy it on Vercel

Make it resume-ready bullet point

Just tell me 🚀


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
