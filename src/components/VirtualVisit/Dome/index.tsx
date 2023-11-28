import { useEffect, useState } from "react";
import { CameraControls } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { PerspectiveCamera } from "three";
import { TSiteModalProps } from "types/ISiteModalProps";
import _debounce from "lodash/debounce"; // Import debounce from lodash

import InfoButtons from "../InfoButtons";
import NavigationButtons from "../NavigationButtons";
import CursorFollower from "../CursorFollower"; // Update the import path

interface DomeProps {
  id: number;
  names: string[];
  url: string;
  modals: TSiteModalProps[];
  positions: number[][];
  links: number[];
  cameraPosition: number[];
  onClick: (arg0: number) => void;
  texture: THREE.Texture;
  cameraControlsRef: React.RefObject<CameraControls>;
}

function AnimationIn(
  camera: PerspectiveCamera,
  onClick: (arg0: number) => void,
  i: number
) {
  gsap.to(camera, {
    fov: 50,
    duration: 2,
    ease: "power1.inOut",
    onUpdate: function () {
      camera.updateProjectionMatrix();
    },
    onComplete: function () {
      onClick(i);
      AnimationOut(camera);
    },
  });
}

function AnimationOut(camera: PerspectiveCamera) {
  gsap.to(camera, {
    fov: 80,
    duration: 2,
    ease: "power1.inOut",
    onUpdate: function () {
      camera.updateProjectionMatrix();
    },
  });
}

function LandingAnimation(
  camera: PerspectiveCamera,
  cameraControlsRef: React.RefObject<CameraControls>,
  cameraPosition: number[]
) {
  if (cameraControlsRef.current) {
    gsap
      .timeline()
      .add("start")
      .to(
        cameraControlsRef.current.camera.position,
        {
          x: -cameraPosition[0],
          y: -cameraPosition[1],
          z: -cameraPosition[2],
          duration: 5,
          ease: "Power3.easeInOut",
          onUpdate: function () {
            if (cameraControlsRef.current) {
              cameraControlsRef.current.setPosition(
                camera.position.x,
                camera.position.y,
                camera.position.z,
                false
              );
            }
          },
        },
        "start"
      )
      .to(
        camera,
        {
          fov: 80,
          near: 1, // Adjust the near clipping plane as needed
          far: 5000, // Adjust the far clipping plane as needed
          duration: 5,
          ease: "Power3.easeInOut",
          onUpdate: function () {
            camera.updateProjectionMatrix();
          },
        },
        "start"
      );
  }
}

let actualPhotoId = -1;

const Dome: React.FC<DomeProps> = ({
  id,
  names,
  positions,
  links,
  modals,
  onClick,
  texture,
  url,
  cameraControlsRef,
  cameraPosition,
}) => {
  const [domeTexture, setDomeTexture] = useState<THREE.Texture>(texture);
  const [vectorPosition, setVectorPosition] = useState([0, 0, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = _debounce(
    (event: ThreeEvent<MouseEvent>) => {
      const { clientX, clientY } = event;

      // Normalize mouse position to the range [-1, 1]
      const normalizedX = (clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(clientY / window.innerHeight) * 2 + 1;

      // Adjust the position based on the camera's projection matrix
      const vector = new THREE.Vector3(normalizedX, normalizedY, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const mousePos = camera.position
        .clone()
        .add(dir.multiplyScalar(distance));

      // Update the state with the new mouse position
      setMousePosition({ x: normalizedX, y: normalizedY });
      setVectorPosition([mousePos.x, mousePos.y, mousePos.z]);
    },
    16 // Adjust the delay as needed (16ms corresponds to 60 updates per second)
  );

  const textureLoader = new THREE.TextureLoader();
  const iconToggleModal = textureLoader.load("/images/infoIcon.png");

  const { camera } = useThree();

  if (id !== actualPhotoId) {
    actualPhotoId = id;
    setDomeTexture(texture);
  }

  const handleNavigationButtonClick = _debounce((i: number) => {
    const onComplete = () => {
      AnimationOut(camera as PerspectiveCamera);
    };
    AnimationIn(camera as PerspectiveCamera, onClick, i);
  }, 200); // Adjust the delay as needed

  useEffect(() => {
    const controller = new AbortController();

    let timeout = 750;

    if ((camera as PerspectiveCamera).fov > 100) {
      LandingAnimation(
        camera as PerspectiveCamera,
        cameraControlsRef,
        cameraPosition
      );
      timeout = 5000;
    }

    textureLoader.loadAsync(url).then((textureLoaded) => {
      setTimeout(() => {
        if (!controller.signal.aborted) {
          setDomeTexture(textureLoaded);
        }
      }, timeout);
    });

    return () => {
      controller.abort();
    };
  }, [url]);

  return (
    <group>
      <mesh onPointerMove={handleMouseMove}>
        <sphereGeometry args={[100, 60, 10]} />
        <meshBasicMaterial map={domeTexture} side={THREE.BackSide} />
      </mesh>
      <NavigationButtons
        positions={positions}
        names={names}
        url={url}
        links={links}
        id={id}
        onClick={handleNavigationButtonClick}
      />
      <InfoButtons
        icon={iconToggleModal}
        modals={modals}
        cameraControlsRef={cameraControlsRef}
      />
      {/* Add the updated CursorFollower component */}
      <CursorFollower position={vectorPosition} />
    </group>
  );
};

export default Dome;
