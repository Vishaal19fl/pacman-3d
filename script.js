import * as THREE from "three";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Move camera higher and slightly backward
camera.lookAt(0, 1, 0); // Make camera look at the table

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("tableContainer").appendChild(renderer.domElement);

// Create the cuboid (wall-mounted slab)
const geometry = new THREE.BoxGeometry(8, 0.2, 1); // Wide, thin cuboid
const material = new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.5, roughness: 0.7 });
const table = new THREE.Mesh(geometry, material);
scene.add(table);

// Position the table
table.position.set(0, 0.1, 0); // Raise the table higher

// Load Gaming Chair Models
const loader = new GLTFLoader();
let chair1, chair2, chair3; // Variables to store the chair models

loader.load(
    'models/gaming_chair.glb',
    function (gltf) {
        // First chair (center)
        chair1 = gltf.scene.clone();
        applyMaterial(chair1);
        chair1.scale.set(0.1, 0.1, 0.1);
        chair1.position.set(0, 0.5, 2);
        chair1.rotation.y = Math.PI;
        scene.add(chair1);

        // Second chair (left)
        chair2 = gltf.scene.clone();
        applyMaterial(chair2);
        chair2.scale.set(0.1, 0.1, 0.1);
        chair2.position.set(-2.5, 0.5, 2); // Position to the left
        chair2.rotation.y = Math.PI;
        chair2.scale.set(0, 0, 0); // Start with scale 0 (hidden)
        scene.add(chair2);

        // Third chair (right)
        chair3 = gltf.scene.clone();
        applyMaterial(chair3);
        chair3.scale.set(0.1, 0.1, 0.1);
        chair3.position.set(2.5, 0.5, 2); // Position to the right
        chair3.rotation.y = Math.PI;
        chair3.scale.set(0, 0, 0); // Start with scale 0 (hidden)
        scene.add(chair3);
    },
    undefined,
    function (error) {
        console.error("Error loading model:", error);
    }
);

// Helper function to apply material to a chair
function applyMaterial(chair) {
    const chairMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.7, metalness: 0.3 });
    chair.traverse((child) => {
        if (child.isMesh) {
            child.material = chairMaterial;
        }
    });
}

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x444444);
scene.add(ambientLight);

// Resize Handling
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// GSAP Animation for Table and Chairs
const textRight = document.querySelector('.text-right');

textRight.addEventListener('mouseenter', () => {
    // Animate table scale
    gsap.to(table.scale, {
        duration: 0.5,
        x: 1.45 ,
        ease: "power2.out"
    });

    // Animate chairs to appear
    gsap.to(chair2.scale, {
        duration: 0.5,
        x: 0.1,
        y: 0.1,
        z: 0.1,
        ease: "power2.out"
    });
    gsap.to(chair3.scale, {
        duration: 0.5,
        x: 0.1,
        y: 0.1,
        z: 0.1,
        ease: "power2.out"
    });
});

textRight.addEventListener('mouseleave', () => {
    // Animate table scale back to original
    gsap.to(table.scale, {
        duration: 0.5,
        x: 1,
        ease: "power2.out"
    });

    // Animate chairs to disappear
    gsap.to(chair2.scale, {
        duration: 0.5,
        x: 0,
        y: 0,
        z: 0,
        ease: "power2.out"
    });
    gsap.to(chair3.scale, {
        duration: 0.5,
        x: 0,
        y: 0,
        z: 0,
        ease: "power2.out"
    });
});