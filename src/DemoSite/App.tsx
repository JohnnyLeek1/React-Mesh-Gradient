import React, { useState, useContext } from 'react';
import { MeshGradientRenderer } from '../lib';
import './App.css';

function App() {


  const palettes = [
    [0xC3E4FF, 0x6EC3F4, 0xEAE2FF, 0xB9BEFF, 0xB3B8F9],
    [0x69D2E7, 0xA7DBD8, 0xE0E4CC, 0xF38630, 0xFA6900],
    [0xFE4365, 0xFC9D9A, 0xF9CDAD, 0xC8C8A9, 0x83AF9B]
  ];

  const [isWireframe, setIsWireframe] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [speed, setSpeed] = useState(0.01);

  return (
    <div>
      <MeshGradientRenderer
        className='fjsdkfj'
        style={{ width: '100vw', height: '100vh' }}
        colors={palettes[colorIndex]}
        wireframe={isWireframe}
        speed={speed}
        backgroundColor={0x000000}
        backgroundOpacity={0.8}
        onGradientClick={() => setColorIndex(colorIndex === palettes.length - 1 ? 0 : colorIndex + 1)}
        onGradientPointerMove={(e) => { console.log(e); }}
      />
      <div id="button_container">
        <button onClick={() => setIsWireframe(!isWireframe)}>Toggle Wireframe</button>
        <button onClick={() => setColorIndex(colorIndex === palettes.length - 1 ? 0 : colorIndex + 1)}>Switch Color</button>
        <input name="speed" id="speed" type="range" min="0" max="0.1" step="0.001" value={speed} onChange={(e) => setSpeed(e.target.valueAsNumber)} />
        <label htmlFor="speed">Gradient Speed: {speed}</label>
      </div>
    </div>
  );
}

export default App;
