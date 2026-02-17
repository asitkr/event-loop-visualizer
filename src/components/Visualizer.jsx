
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Reusable List Component for Stack/Queue
const QueueList = ({ title, items, color, type = 'stack', emptyMessage = 'Empty', borderColor }) => {
    return (
        <motion.div
            layout
            className={`
                flex flex-col gap-2 h-full bg-[#1e293b] rounded-lg border-2 p-4 shadow-lg flex-1 min-w-[200px]
                transition-colors duration-300
                ${items.length > 0 ? borderColor : 'border-gray-700'}
            `}
        >
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2 border-b border-gray-700 pb-2 flex justify-between">
                {title}
                <span className="text-gray-600 bg-gray-800 px-2 rounded-full">{items.length}</span>
            </h3>

            <div className={`flex ${type === 'stack' ? 'flex-col-reverse' : 'flex-col'} gap-2 overflow-y-auto max-h-[400px] flex-1 relative`}>
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                scale: 1,
                                boxShadow: "0 0 0 2px rgba(234, 179, 8, 0.5)" // Yellow ring flash effect on enter
                            }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            layoutId={item.id}
                            className={`
                                p-3 rounded text-sm font-mono border-l-4 shadow-md relative overflow-hidden
                                ${color}
                                ${item.type === 'TIMEOUT' ? 'animate-pulse' : ''} 
                            `}
                            onAnimationComplete={(definition) => {
                                // Remove ring effect after animation? 
                                // framer-motion doesn't easily support simple "flash" without state, 
                                // but initial animate works for entry flash.
                            }}
                        >
                            <div className="flex justify-between items-center relative z-10">
                                <span className="truncate max-w-[150px]" title={item.name}>{item.name || item.label || 'Task'}</span>
                                {item.delay !== undefined && (
                                    <span className="text-xs bg-black/20 px-1 rounded ml-2 whitespace-nowrap">{item.delay}ms</span>
                                )}
                            </div>

                            {/* Background Pulse Effect for executing items */}
                            {type === 'webapi' && (
                                <motion.div
                                    className="absolute inset-0 bg-white/5"
                                    animate={{ opacity: [0, 0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {items.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 italic text-xs select-none">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const Visualizer = ({ state }) => {
    const { callStack, webApi, microtaskQueue, callbackQueue, logs } = state;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
            {/* Top Section: Stack & Web APIs */}
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4 h-[450px]">
                    {/* Call Stack - Red */}
                    <QueueList
                        title="Call Stack"
                        items={callStack}
                        color="bg-red-900/30 border-red-500 text-red-200"
                        borderColor="border-red-500/50"
                        type="stack"
                        emptyMessage="Idle"
                    />
                    {/* Web APIs - Orange (Pulsing dealt with inside component) */}
                    <QueueList
                        title="Web APIs"
                        items={webApi}
                        color="bg-orange-900/30 border-orange-500 text-orange-200"
                        borderColor="border-orange-500/50"
                        type="webapi"
                        emptyMessage="No pending APIs"
                    />
                </div>

                {/* Console Output */}
                <div className="bg-[#0f172a] rounded-lg border border-gray-800 overflow-hidden flex flex-col h-[300px] shadow-inner">
                    <div className="bg-gray-800/50 px-4 py-1 text-xs text-gray-400 flex justify-between items-center border-b border-gray-800">
                        <span>TERMINAL</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>
                    <div className="p-4 font-mono text-sm overflow-y-auto flex-1 flex flex-col gap-1">
                        {logs.length === 0 && <span className="text-gray-700 opacity-50">...</span>}
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-gray-300 border-b border-gray-800/50 last:border-0 pb-1"
                            >
                                <span className="text-green-500 mr-2">➜</span>
                                <span className="text-gray-100">{log}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Section: Queues & Loop Info */}
            <div className="flex flex-col gap-6 h-full">
                <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 flex flex-col gap-4 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    {/* Event Loop Animation */}
                    <div className="absolute top-4 right-4 opacity-30 pointer-events-none">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-24 h-24 rounded-full border-4 border-dashed border-sky-500/50"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 m-4 rounded-full border-4 border-dashed border-purple-500/50"
                        />
                    </div>

                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent w-fit">
                        Event Loop
                    </h2>
                    <p className="text-gray-400 text-sm max-w-sm z-10 leading-relaxed">
                        The Event Loop monitors the Call Stack and the Queue. If the Stack is empty, it takes the first event from the queue and pushes it to the Stack.
                    </p>
                </div>

                <div className="grid grid-rows-2 gap-4 flex-1">
                    {/* Microtask Queue - Purple */}
                    <QueueList
                        title="Microtask Queue"
                        items={microtaskQueue}
                        color="bg-purple-900/30 border-purple-500 text-purple-200"
                        borderColor="border-purple-500/50"
                        type="queue"
                        emptyMessage="Empty"
                    />
                    {/* Callback Queue (Macrotask) - Blue */}
                    <QueueList
                        title="Macrotask Queue"
                        items={callbackQueue}
                        color="bg-blue-900/30 border-blue-500 text-blue-200"
                        borderColor="border-blue-500/50"
                        type="queue"
                        emptyMessage="Empty"
                    />
                </div>
            </div>
        </div>
    );
};
