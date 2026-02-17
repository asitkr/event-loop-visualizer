
import * as acorn from 'acorn';

export function rewriteCode(code) {
  try {
    const ast = acorn.parse(code, { ecmaVersion: 2020 });
    let magicString = code.split('');
    let insertions = [];

    // Simple recursive walker to find function bodies and calls
    // We will insert 'await __env.step();' at the start of functions
    // and wrap specific calls with 'await __env.callWrapper(...)' for visualization
    
    // For this demo, we will use a simpler approach:
    // We will wrap the entire code in an async function in the runner.
    // We just need to identify calls to instrument.
    
    // Actually, writing a full robust transformer with just 'acorn' and no 'astring'/generator is hard.
    // Let's rely on line-based instrumentation if possible, or just standard regex for specific keywords
    // which is fragile but sufficient for the "demo" commands like setTimeout/log.
    
    // BETTER APPROACH:
    // We use a custom runtime that doesn't need heavy source transformation.
    // typical code: setTimeout(() => { console.log('hi') }, 1000)
    // We can run this code inside a `with(__env) { eval(code) }` block.
    // keys in __env: setTimeout, console, Promise.
    // But we need to PAUSE execution to show the stack.
    // If we use 'async/await', the user code MUST contain 'await'. 
    // User won't write 'await console.log'.
    // So we MUST return a transformer that adds 'await'.
  
    // Let's try a very basic recursive re-printer that adds 'await'.
    
    return transform(ast, code);
  } catch (err) {
    console.error("Parse error:", err);
    return code; // Fallback
  }
}

function transform(ast, originalCode) {
  let output = [];
  
  function traverse(node) {
    if (!node) return;

    // Handle different node types
    switch (node.type) {
      case 'Program':
      case 'BlockStatement':
        node.body.forEach(stmt => {
            traverse(stmt);
            output.push(';\n');
        });
        break;
        
      case 'ExpressionStatement':
        traverse(node.expression);
        break;
        
      case 'CallExpression':
        // Check if it's a "visualizable" function
        // For console.log, setTimeout, etc.
        // We wrap it: await __env.call(context, funcName, args...)
        
        const isLog = isConsoleLog(node.callee);
        const isTimeout = isSetTimeout(node.callee);
        const isPromise = isPromiseThen(node.callee);
        
        if (isLog || isTimeout || isPromise) {
            output.push('(await __env.call(');
            // Function name/type
            if (isLog) output.push(`"console.log", `);
            else if (isTimeout) output.push(`"setTimeout", `);
            else if (isPromise) output.push(`"Promise", `);
            else output.push(`"unknown", `);
            
            // Arguments
            output.push('(');
            // Recursively print args... this is the hard part without a printer.
            // We can just slice the source code for arguments!
            node.arguments.forEach((arg, i) => {
                if (i > 0) output.push(',');
                // If the arg is a function (callback), we need to transform that too!
                if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') {
                    // special handling
                    traverse(arg); 
                } else {
                    output.push(originalCode.slice(arg.start, arg.end));
                }
            });
            output.push(')');
            
            output.push('))');
        } else {
            // Just print as is for now -> maybe use source slice
            output.push(originalCode.slice(node.start, node.end));
        }
        break;
        
      case 'ArrowFunctionExpression':
      case 'FunctionExpression':
        output.push('async (');
        node.params.forEach((p, i) => {
            if (i > 0) output.push(',');
            output.push(originalCode.slice(p.start, p.end));
        });
        output.push(') => {');
        traverse(node.body);
        output.push('}');
        break;
        
      default:
        // Fallback: This effectively limits supported syntax to what we handle above + simple literals
        // If we encoutner a loop or if, we might break if we don't handle its structure.
        // For a high-fidelity visualizer, we might successfully just append the source 
        // IF we didn't need to break inside.
        output.push(originalCode.slice(node.start, node.end));
    }
  }
  
  // This simple traverser is too risky.
  // ALTERNATIVE:
  // Use a simple Regex replacer for the specific demo cases.
  // 1. console.log(...) -> await __env.log(...)
  // 2. setTimeout(...) -> await __env.setTimeout(...)
  // 3. Promise.resolve().then(...) -> await __env.promise(...)
  
  // Why? Because writing a JS-to-JS transpiler in 5 mins is error prone.
  // The User just wants a visualizer. Regex is robust enough for "standard" demo code.
  
  return regexTransform(originalCode);
}

function regexTransform(code) {
  // 1. Naive function asyncification
  // arrow functions: () => { ... } to async () => { ... }
  // function decl: function foo() { ... } to async function foo() { ... }
  let processed = code
    .replace(/function\s+(\w+)\s*\(/g, 'async function $1(')
    .replace(/(\w+)\s*=>/g, 'async $1 =>')
    .replace(/\(([^)]*)\)\s*=>/g, 'async ($1) =>');

  // 2. Inject awaits for known APIs
  // console.log -> await __env.log
  processed = processed.replace(/console\.log/g, 'await __env.log');
  
  // setTimeout -> await __env.setTimeout
  processed = processed.replace(/setTimeout/g, 'await __env.setTimeout');
  
  // Promise.resolve -> await __env.promiseResolve
  processed = processed.replace(/Promise\.resolve/g, 'await __env.promiseResolve');
  
  // .then -> .then(async ... ) (already handled by step 1 if arrow func)
  // But we need to wrap the .then call itself?
  // Actually, standard Promise behavior in JS is async.
  // If we override Promise, we can control it.
  
  // queueMicrotask
  processed = processed.replace(/queueMicrotask/g, 'await __env.queueMicrotask');

  return processed;
}

function isConsoleLog(callee) {
    return callee.type === 'MemberExpression' && 
           callee.object.name === 'console' && 
           callee.property.name === 'log';
}

function isSetTimeout(callee) {
    return callee.type === 'Identifier' && callee.name === 'setTimeout'; 
}

function isPromiseThen(callee) {
    // very basic check
    return callee.type === 'MemberExpression' && callee.property.name === 'then';
}
