import React, { useRef, useState } from "https://esm.sh/react";
import type { Mesh } from "https://esm.sh/three";
import {
  Canvas,
  MeshProps,
  useFrame,
} from "https://esm.sh/react-three-fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "https://esm.sh/@react-three/postprocessing";
//import { ResizeObserver } from "https://esm.sh/@juggle/resize-observer"

const Box: React.FC<MeshProps> = (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "lightpink" : "silver"} />
    </mesh>
  );
};

const Scene: React.FC = (props) => {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {[...Array(props.count).keys()].map((n) => {
        return <Box
          key={n.toString()}
          position={[
            Math.sin(n) * 2,
            Math.cos(n),
            Math.sin(n) * Math.cos(n) * 2,
          ]}
        />;
      })}
    </>
  );
};

export default function TestCanvas(props) {
  return (
    <Canvas style={{ height: 1000, width: 1000 }}>
      <Scene count={props.count} />
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.2} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
