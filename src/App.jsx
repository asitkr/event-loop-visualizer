
import { useState } from 'react';
import { useEventLoop } from './hooks/useEventLoop';
import { CodeEditor } from './components/CodeEditor';
import { Visualizer } from './components/Visualizer';
import { motion } from 'framer-motion';
import { FaPlay, FaRedo, FaPause, FaStepForward } from 'react-icons/fa';

const EXAMPLES = {
  basic: `console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');`,

  multiple: `console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
}, 0);

setTimeout(() => {
  console.log('Timeout 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
});

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');`,

  allSections: `console.log('Sync 1');

setTimeout(() => {
  console.log('Macro 1');
}, 100);

setTimeout(() => {
  console.log('Macro 2');
}, 50);

setTimeout(() => {
  console.log('Macro 3');
}, 0);

Promise.resolve().then(() => {
  console.log('Micro 1');
});

Promise.resolve().then(() => {
  console.log('Micro 2');
});

Promise.resolve().then(() => {
  console.log('Micro 3');
});

console.log('Sync 2');
console.log('Sync 3');`,

  priority: `console.log('Start');

setTimeout(() => {
  console.log('SetTimeout 0ms');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise Then 1');
});

console.log('Middle');

Promise.resolve().then(() => {
  console.log('Promise Then 2');
}, 0); // Note: Then 2

setTimeout(() => {
  console.log('SetTimeout 10ms');
}, 10);

console.log('End');`,

  complex: `console.log('Script Start');

setTimeout(() => {
  console.log('Timer 1');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 1');
});

setTimeout(() => {
  console.log('Timer 2');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise 2');
});

Promise.resolve().then(() => {
  console.log('Promise 3');
});

setTimeout(() => {
  console.log('Timer 3');
}, 0);

console.log('Script End');`
};

function App() {
  const [code, setCode] = useState(EXAMPLES.complex);  // Start with a rich example
  const { run, reset, togglePause, ...state } = useEventLoop();

  const handleRun = () => {
    run(code);
  };

  const loadExample = (key) => {
    reset();
    setCode(EXAMPLES[key]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg flex items-center justify-center font-bold text-2xl text-black">
            JS
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-600">
              Event Loop Visualizer
            </h1>
            <p className="text-xs text-gray-500">Interactive Runtime Simulation</p>
          </div>
        </div>

        <div className="flex gap-3 items-center bg-gray-900/50 p-2 rounded-xl border border-gray-800">
          <div className="px-4 border-r border-gray-700 flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Steps</span>
            <span className="font-mono text-xl text-yellow-500">{state.step || 0}</span>
          </div>

          <button
            onClick={reset}
            className="p-3 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center justify-center gap-2 border border-gray-700 group relative"
            title="Reset"
          >
            <FaRedo size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {state.isRunning && (
            <button
              onClick={togglePause}
              className={`
                        p-3 rounded-lg font-bold shadow-lg transition flex items-center justify-center gap-2 w-32
                        ${state.isPaused
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}
                    `}
            >
              {state.isPaused ? (
                <>
                  <FaStepForward size={14} /> Resume
                </>
              ) : (
                <>
                  <FaPause size={14} /> Pause
                </>
              )}
            </button>
          )}

          {!state.isRunning && (
            <button
              onClick={handleRun}
              className="px-6 py-3 rounded-lg font-bold shadow-lg transition flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-900/20 min-w-[120px] justify-center"
            >
              <FaPlay size={14} /> Run
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col gap-6 h-full">
        {/* Editor Section - Full Width Top */}
        <section className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Source Code
            </h2>

            {/* Example Buttons */}
            <div className="flex gap-2">
              {Object.keys(EXAMPLES).map(key => (
                <button
                  key={key}
                  onClick={() => loadExample(key)}
                  disabled={state.isRunning}
                  className={`
                                text-[10px] uppercase font-bold px-2 py-1 rounded border transition-colors
                                ${state.isRunning ? 'opacity-50 cursor-not-allowed border-transparent' : 'hover:bg-gray-700 border-gray-700 bg-gray-800'}
                            `}
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 h-[300px]">
            <div className="flex-1 h-full">
              <CodeEditor code={code} setCode={setCode} />
            </div>
            {/* Legend / Info Side Panel for Editor */}
            <div className="hidden lg:flex flex-col justify-center gap-2 w-64 text-xs text-gray-400 bg-gray-900/50 p-4 rounded-lg border border-gray-800 h-full">
              <h3 className="uppercase tracking-wider font-bold text-gray-500 mb-2 border-b border-gray-700 pb-2">Legend</h3>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-900 border border-red-500 rounded"></div> <span>Call Stack (Sync)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-900 border border-orange-500 rounded animate-pulse"></div> <span>Web APIs (Async)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-900 border border-purple-500 rounded"></div> <span>Microtasks (Promise)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-900 border border-blue-500 rounded"></div> <span>Macrotasks (Callback)</span></div>

              <div className="mt-4 pt-4 border-t border-gray-700 opacity-70">
                <p>Microtasks run immediately after the current stack clears.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Visualization Section */}
        <section className="flex-1 min-h-[500px] bg-[#1e293b]/50 rounded-xl border border-gray-800 p-6 shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col relative group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20 group-hover:opacity-100 transition-opacity"></div>
          <Visualizer state={state} />
        </section>
      </main>
    </div>
  );
}

export default App;
