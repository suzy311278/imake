import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./Viewer.css";

const Viewer = ({ file, onRemove }) => {
  const viewerRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef(new THREE.WebGLRenderer({ antialias: true }));
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const controlsRef = useRef(null);
  const [stats, setStats] = useState({
    volume: "...",
    dimensions: "...",
    printTime: "...",
  });

  useEffect(() => {
    const currentRenderer = rendererRef.current;
    currentRenderer.setSize(300, 300);
    const currentViewerRef = viewerRef.current;
    if (currentViewerRef) {
      currentViewerRef.appendChild(currentRenderer.domElement);
    }

    const camera = cameraRef.current;
    camera.position.z = 150;

    const controls = new OrbitControls(camera, currentRenderer.domElement);
    controlsRef.current = controls;

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(1, 1, 1).normalize();
    sceneRef.current.add(light1);

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(-1, -1, -1).normalize();
    sceneRef.current.add(light2);

    if (file instanceof File) {
      const loader = new STLLoader();
      loader.load(URL.createObjectURL(file), (geometry) => {
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        sceneRef.current.add(mesh);

        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);

        const volumeInCm3 = (size.x * size.y * size.z) / 1000; // Convert mm³ to cm³

        setStats({
          volume: volumeInCm3.toFixed(2) + " cm³",
          dimensions: `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)} mm`,
          printTime: "10:00:00",
        });

        const center = new THREE.Vector3();
        box.getCenter(center);
        mesh.position.sub(center);
        controls.target.copy(center);
      }, undefined, (error) => {
        console.error("An error occurred loading the STL file", error);
      });
    } else {
      console.error("Invalid file input");
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      currentRenderer.render(sceneRef.current, camera);
    };

    animate();

    return () => {
      if (currentViewerRef) {
        currentViewerRef.removeChild(currentRenderer.domElement);
      }
    };
  }, [file]);

  const { volume, dimensions, printTime } = stats;

  return (
    <div className="file-container">
      <div className="file-details">
        <h2>{file.name}</h2>
        <button onClick={() => onRemove(file)}>Remove</button>
        <p><strong>Material Volume:</strong> {volume}</p>
        <p><strong>Model Dimensions:</strong> {dimensions}</p>
        <p><strong>Print Time:</strong> {printTime}</p>
      </div>
      <div className="viewer" ref={viewerRef}></div>
    </div>
  );
};

export default Viewer;
