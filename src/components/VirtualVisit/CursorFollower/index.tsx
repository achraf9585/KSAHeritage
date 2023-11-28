import { useEffect, useState } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";

interface CursorFollowerProps {
  position: number[];
}

const CursorFollower: React.FC<CursorFollowerProps> = ({ position }) => {
  const vectorPosition = new THREE.Vector3(
    position[0],
    position[1],
    -position[2]
  );

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("Vector.png");

  return (
    <mesh position={vectorPosition} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent opacity={0.7} />{" "}
      {/* Adjust the opacity value here */}
    </mesh>
  );
};

export default CursorFollower;
