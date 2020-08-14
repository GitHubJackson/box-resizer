import React, { useRef } from 'react';
import ReactDivResizer from './components/ReactDivResizer';
import './App.css';

function App() {
  const appRef = useRef<HTMLDivElement>(null);

  return (
    <div className="App" ref={appRef}>
      <ReactDivResizer boxRef={appRef}/>
    </div>
  );
}

export default App;
