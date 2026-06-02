/*
   --------------------------------------------------
   Three.js 3D Faceted Heart Scene for "Seninle"
   Renders a rotating, floating low-poly 3D heart 
   that splits open on click.
   --------------------------------------------------
*/

let scene, camera, renderer, heartGroup;
let leftHalf, rightHalf;
let particles = [];
let isOpen = false;
const container = document.getElementById('heart-3d-container');

function init3D() {
    // 1. Create Scene
    scene = new THREE.Scene();

    // 2. Camera Setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    // 3. Renderer Setup (Transparent background)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.4); // soft warm ambient pink
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(80, 100, 120);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf8a5c2, 0.8);
    dirLight2.position.set(-80, -50, 50);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xe66767, 1.5, 150);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    // 5. Geometries & Meshes
    heartGroup = new THREE.Group();
    scene.add(heartGroup);

    // Extrude Settings for Low-Poly Faceted look
    const extrudeSettings = {
        depth: 16,
        bevelEnabled: true,
        bevelSegments: 2, // low segments for faceted look
        steps: 1,         // minimal steps to achieve flat facets
        bevelSize: 4,
        bevelThickness: 5
    };

    // --- Left Half Shape ---
    const leftShape = new THREE.Shape();
    leftShape.moveTo(0, 20);
    leftShape.bezierCurveTo(0, 20, -10, 45, -35, 45);
    leftShape.bezierCurveTo(-65, 45, -75, 15, -75, -15);
    leftShape.bezierCurveTo(-75, -45, -55, -70, 0, -105);
    leftShape.lineTo(0, 20); // Close straight down the center line

    const leftGeometry = new THREE.ExtrudeGeometry(leftShape, extrudeSettings);
    // Center geometry origin to center of heart cleft/height for proper pivot rotation
    leftGeometry.center();

    // --- Right Half Shape ---
    const rightShape = new THREE.Shape();
    rightShape.moveTo(0, 20);
    rightShape.lineTo(0, -105); // Start straight down the center line
    rightShape.bezierCurveTo(55, -70, 75, -45, 75, -15);
    rightShape.bezierCurveTo(75, 15, 65, 45, 35, 45);
    rightShape.bezierCurveTo(10, 45, 0, 20, 0, 20);

    const rightGeometry = new THREE.ExtrudeGeometry(rightShape, extrudeSettings);
    rightGeometry.center();

    // Material: Glossy physical material with flatShading enabled
    const heartMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe66767,
        roughness: 0.15,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        flatShading: true, // Key for low-poly crystal facets!
        side: THREE.DoubleSide
    });

    leftHalf = new THREE.Mesh(leftGeometry, heartMaterial);
    rightHalf = new THREE.Mesh(rightGeometry, heartMaterial);

    // Adjust starting coordinates since geometries are centered separately
    // Left half gets shifted left slightly, right gets shifted right
    leftHalf.position.x = -18;
    rightHalf.position.x = 18;

    heartGroup.add(leftHalf);
    heartGroup.add(rightHalf);

    // Position entire group
    heartGroup.position.y = 15;
    heartGroup.scale.set(0.9, 0.9, 0.9);

    // 6. Interaction Event Handlers
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        // Normalize mouse positions between -1 and 1
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    container.addEventListener('click', triggerHeartOpening);

    // Raycaster for hover interactions
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouseVector, camera);
        const intersects = raycaster.intersectObjects([leftHalf, rightHalf]);
        
        if (intersects.length > 0 && !isOpen) {
            document.body.style.cursor = 'pointer';
            // Slight hover enlargement
            gsap.to(heartGroup.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.3 });
        } else {
            document.body.style.cursor = 'default';
            if (!isOpen) {
                gsap.to(heartGroup.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 0.3 });
            }
        }
    });

    // 7. Render Loop
    let clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Standard floating and rotating animations (disabled/reduced when open)
        if (!isOpen) {
            heartGroup.position.y = 15 + Math.sin(time * 1.5) * 8;
            heartGroup.rotation.y = time * 0.4;
            
            // Mouse parallax tilt
            heartGroup.rotation.x = THREE.MathUtils.lerp(heartGroup.rotation.x, mouseY * 0.3, 0.05);
            heartGroup.rotation.z = THREE.MathUtils.lerp(heartGroup.rotation.z, mouseX * 0.1, 0.05);
        } else {
            // Very subtle float when open
            heartGroup.position.y = 15 + Math.sin(time * 0.8) * 3;
        }

        // Update 3D Sparkle particles
        updateParticles();

        renderer.render(scene, camera);
    }

    animate();
}

// 8. Open Heart Animation
function triggerHeartOpening() {
    if (isOpen) return;
    isOpen = true;

    // Split halves outward
    gsap.to(leftHalf.position, {
        x: -45,
        z: -10,
        duration: 1.5,
        ease: 'power3.out'
    });
    
    gsap.to(leftHalf.rotation, {
        y: -Math.PI / 2.2, // hinge open like a gate
        z: -0.15,
        duration: 1.5,
        ease: 'power3.out'
    });

    gsap.to(rightHalf.position, {
        x: 45,
        z: -10,
        duration: 1.5,
        ease: 'power3.out'
    });
    
    gsap.to(rightHalf.rotation, {
        y: Math.PI / 2.2,
        z: 0.15,
        duration: 1.5,
        ease: 'power3.out'
    });

    // Emit 3D particles from cleft center
    spawn3DParticles();

    // Trigger overlay surprise letter in script.js after a brief delay
    setTimeout(() => {
        if (window.openSurpriseModal) {
            window.openSurpriseModal();
        }
    }, 400);
}

// 9. Close Heart Animation (Called from script.js when modal closes)
window.closeHeart3D = function() {
    if (!isOpen) return;
    isOpen = false;

    gsap.to(leftHalf.position, {
        x: -18,
        z: 0,
        duration: 1.2,
        ease: 'power3.inOut'
    });
    
    gsap.to(leftHalf.rotation, {
        y: 0,
        z: 0,
        duration: 1.2,
        ease: 'power3.inOut'
    });

    gsap.to(rightHalf.position, {
        x: 18,
        z: 0,
        duration: 1.2,
        ease: 'power3.inOut'
    });
    
    gsap.to(rightHalf.rotation, {
        y: 0,
        z: 0,
        duration: 1.2,
        ease: 'power3.inOut'
    });
};

// 10. 3D Particle Emitters (Golden stars and hearts floating out)
function spawn3DParticles() {
    const pGeometry = new THREE.SphereGeometry(1.2, 5, 5);
    
    // Golden and white colors for magical glow
    const colors = [0xffd700, 0xffffff, 0xf8a5c2, 0xe66767];
    
    for (let i = 0; i < 40; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const pMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });
        
        const mesh = new THREE.Mesh(pGeometry, pMaterial);
        
        // Spawn from center
        mesh.position.set(0, 0, 5);
        
        // Random velocity direction
        const angle = Math.random() * Math.PI * 2;
        const velocityZ = Math.random() * 4 + 1;
        const speed = Math.random() * 3 + 1.5;
        
        const velocity = new THREE.Vector3(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            velocityZ
        );
        
        scene.add(mesh);
        particles.push({ mesh, velocity, decay: Math.random() * 0.015 + 0.008 });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.mesh.position.add(p.velocity);
        
        // Slow down slightly
        p.velocity.multiplyScalar(0.97);
        
        // Fade out
        p.mesh.material.opacity -= p.decay;
        
        if (p.mesh.material.opacity <= 0) {
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
            particles.splice(i, 1);
        }
    }
}

// 11. Responsive resize handler
window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

// Start Three.js
init3D();
