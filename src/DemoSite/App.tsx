import React, { useState, useContext } from 'react';
import { MeshGradientRenderer } from '../lib';
import './App.css';

function App() {


  const palettes = [
    ["#C3E4FF", "#6EC3F4", "#EAE2FF", "#B9BEFF", "#B3B8F9"],
    ["#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630", "#FA6900"]
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
        backgroundColor={"#000000"}
        backgroundOpacity={0.8}
        onGradientClick={() => setColorIndex(colorIndex === palettes.length - 1 ? 0 : colorIndex + 1)}
        onGradientPointerMove={(e) => { console.log(e); }}
      >
        <div>hello</div>
      </MeshGradientRenderer>
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
