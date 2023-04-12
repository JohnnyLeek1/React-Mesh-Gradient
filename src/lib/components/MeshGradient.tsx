/// <reference types="vite-plugin-glsl/ext" />

/**
 *  @file MeshGradient.tsx
 *  React-Mesh-Gradient
 *  @author Johnny Leek <https://github.com/JohnnyLeek1>
 *  @version 1.0.0
 *  @description A React WebGL component that renders a mesh gradient utilizing Three.JS and React Three Fiber.
 * 
 */

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import vertex from '../shaders/vertex.glsl';
import fragment from '../shaders/fragment.glsl';

/**
 * Properties that are available for the Mesh Gradient.
 * 
 * See individual docs inside the interface for explanations of each property
 * 
 * @interface MeshGradientProps
 * @property {string[]} colors
 * @property {boolean} [wireframe=false]
 * @property {number} [speed=0.01] 
 * @property {number} [backgroundColor=0x000000]
 * @property {number} [backgroundOpacity=0.8]
 * @property {(e: THREE.Event) => void} [onGradientClick]
 * @property {(e: THREE.Event) => void} [onGradientContextMenu]
 * @property {(e: THREE.Event) => void} [onGradientDoubleClick]
 * @property {(e: THREE.Event) => void} [onGradientWheel]
 * @property {(e: THREE.Event) => void} [onGradientPointerUp]
 * @property {(e: THREE.Event) => void} [onGradientPointerDown]
 * @property {(e: THREE.Event) => void} [onGradientPointerOver]
 * @property {(e: THREE.Event) => void} [onGradientPointerOut]
 * @property {(e: THREE.Event) => void} [onGradientPointerMove]
 * @property {(e: THREE.Event) => void} [onGradientPointerEnter]
 * @property {(e: THREE.Event) => void} [onGradientPointerLeave]
 * @property {(e: THREE.Event) => void} [onGradientPointerMove]
 * @property {(e: THREE.Event) => void} [onGradientPropsUpdate]
 */
interface MeshGradientProps {
  /** An array of colors to be used in the gradient. The colors should be in hex format. */
  colors: string[];
  /** Whether or not the gradient should be rendered in wireframe mode. */
  wireframe?: boolean;
  // The speed at which the gradient should move. The speed should be a number between 0 and 1.
  speed?: number;
  // The background color of the gradient. The color should be in hex format.
  backgroundColor?: string;
  // The opacity of the background. The opacity should be a number between 0 and 1.
  backgroundOpacity?: number;
  // Click handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientClick?: (e: THREE.Event) => void;
  // Context menu handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientContextMenu?: (e: THREE.Event) => void;
  // Double click handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientDoubleClick?: (e: THREE.Event) => void;
  // Wheel handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientWheel?: (e: THREE.Event) => void;
  // Pointer up handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerUp?: (e: THREE.Event) => void;
  // Pointer down handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerDown?: (e: THREE.Event) => void;
  // Pointer over handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerOver?: (e: THREE.Event) => void;
  // Pointer out handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerOut?: (e: THREE.Event) => void;
  // Pointer enter handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerEnter?: (e: THREE.Event) => void;
  // Pointer leave handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerLeave?: (e: THREE.Event) => void;
  // Pointer move handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPointerMove?: (e: THREE.Event) => void;
  // Update handler for the gradient. Will be called with the native Three.JS Event object.
  onGradientPropsUpdate?: (e: THREE.Event) => void;
}

/**
 * The MeshGradient component. Returns a Three.JS mesh which has the ShaderMaterial consisting of the gradient.
 * @param {MeshGradientProps} props - {@link MeshGradientProps}
 * @returns A mesh containing the MeshGradient
 */
function MeshGradient({
  colors, wireframe = false, speed = 0.01, backgroundColor = "#FFFFFF",
  backgroundOpacity = 1.0, onGradientClick, onGradientContextMenu,
  onGradientDoubleClick, onGradientWheel, onGradientPointerUp,
  onGradientPointerDown, onGradientPointerOver, onGradientPointerOut,
  onGradientPointerEnter, onGradientPointerLeave, onGradientPointerMove,
  onGradientPropsUpdate
}: MeshGradientProps) {

  // Store a ref to the mesh and shader material
  const meshRef = useRef<THREE.Mesh>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  // Access the Three renderer so that we can modify its properties on initialization
  const renderer = useThree(state => state.gl);

  // Store the time in state so that we can pass it to the shader
  const [time, setTime] = useState(0);

  // Map hex colors to Three.Color objects
  const colorPalette = colors.map((color) => new THREE.Color(color as THREE.ColorRepresentation));

  // When the component is rendered, set the Three.JS renderer properties
  useEffect(() => {

    // Renderer settings
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(backgroundColor as THREE.ColorRepresentation, backgroundOpacity);
    renderer.useLegacyLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

  });

  // Every frame, update the time with the current speed, multiplied by the delta time (to ensure a consistent rate across all devices)
  useFrame((_, delta) => (setTime(time + speed * delta)));

  /**
   * Render a mesh at the origin.
   * 
   * The ShaderMaterial handles the gradient. It contains 2 uniforms:
   * - time: The time passed since the component was rendered
   * - colorPalette: The array of colors to be used in the gradient
   * 
   * These are passed to the vertex and fragment shaders, which are defined in ../shaders/[fragment / vertex].glsl
   */

  return (
    <mesh
      ref={meshRef}
      position={new THREE.Vector3(0, 0, 0)}
      onClick={onGradientClick ? (e) => onGradientClick(e) : undefined}
      onContextMenu={onGradientContextMenu ? (e) => onGradientContextMenu(e) : undefined}
      onDoubleClick={onGradientDoubleClick ? (e) => onGradientDoubleClick(e) : undefined}
      onWheel={onGradientWheel ? (e) => onGradientWheel(e) : undefined}
      onPointerUp={onGradientPointerUp ? (e) => onGradientPointerUp(e) : undefined}
      onPointerDown={onGradientPointerDown ? (e) => onGradientPointerDown(e) : undefined}
      onPointerOver={onGradientPointerOver ? (e) => onGradientPointerOver(e) : undefined}
      onPointerOut={onGradientPointerOut ? (e) => onGradientPointerOut(e) : undefined}
      onPointerEnter={onGradientPointerEnter ? (e) => onGradientPointerEnter(e) : undefined}
      onPointerLeave={onGradientPointerLeave ? (e) => onGradientPointerLeave(e) : undefined}
      onPointerMove={onGradientPointerMove ? (e) => onGradientPointerMove(e) : undefined}
      onUpdate={onGradientPropsUpdate ? (e) => onGradientPropsUpdate(e) : undefined}
    >
      <planeGeometry args={[1, 1, 500, 500]} />
      <shaderMaterial
        extensions={{
          derivatives: true,
          fragDepth: false,
          drawBuffers: false,
          shaderTextureLOD: false
        }}
        ref={shaderRef}
        side={THREE.DoubleSide}
        uniforms={{
          time: { value: time },
          uColor: { value: colorPalette }
        }}
        wireframe={wireframe}
        vertexShader={vertex}
        fragmentShader={fragment}
        key={Math.random()}
      />
    </mesh>


  );
}

/**
 * Properties that are available to the Mesh Gradient Renderer.
 * 
 * @interface MeshGradientRendererProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
 * @extends {MeshGradientProps}
 * 
 * See individual docs inside the interface for explanations of each property
 * @property {string} [width] 
 * @property {string} [height]
 * 
 * Can also pass all properties from {@link MeshGradientProps} and {@link React.HTMLAttributes<HTMLDivElement>}
 * 
 */
interface MeshGradientRendererProps extends React.HTMLAttributes<HTMLDivElement>, MeshGradientProps {
  // The width of the gradient. The width should be a string that can be parsed by the CSS parser.
  width?: string;
  // The height of the gradient. The height should be a string that can be parsed by the CSS parser.
  height?: string;
}

/**
 * The MeshGradientRenderer component. Renders a MeshGradient component inside a customizable div, which contains a
 * responsive Three.JS canvas.
 * @param {MeshGradientRendererProps} props - {@link MeshGradientRendererProps}
 * @returns A div containing the desired MeshGradient
 */
const MeshGradientRenderer: React.FunctionComponent<MeshGradientRendererProps> = ({
  width, height, colors, wireframe, speed,
  backgroundColor, backgroundOpacity,
  onGradientClick, onGradientContextMenu,
  onGradientDoubleClick, onGradientWheel, onGradientPointerUp,
  onGradientPointerDown, onGradientPointerOver, onGradientPointerOut,
  onGradientPointerEnter, onGradientPointerLeave, onGradientPointerMove,
  onGradientPropsUpdate,
  ...containerProps
}) => {

  return (
    <div {...containerProps} >
      <Canvas>
        <PerspectiveCamera makeDefault manual position={new THREE.Vector3(0, 0, 0.5)} near={0.001} far={1000} />
        <MeshGradient
          colors={colors} wireframe={wireframe} speed={speed}
          backgroundColor={backgroundColor} backgroundOpacity={backgroundOpacity}
          onGradientClick={onGradientClick} onGradientContextMenu={onGradientContextMenu}
          onGradientDoubleClick={onGradientDoubleClick} onGradientWheel={onGradientWheel}
          onGradientPointerUp={onGradientPointerUp} onGradientPointerDown={onGradientPointerDown}
          onGradientPointerOver={onGradientPointerOver} onGradientPointerOut={onGradientPointerOut}
          onGradientPointerEnter={onGradientPointerEnter} onGradientPointerLeave={onGradientPointerLeave}
          onGradientPointerMove={onGradientPointerMove} onGradientPropsUpdate={onGradientPropsUpdate}
        />
      </Canvas>
    </div>
  );
};

export default MeshGradientRenderer;