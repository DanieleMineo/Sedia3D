import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { TDSLoader } from 'three/addons/loaders/TDSLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( 20, 20, 10 ); //default; directionalLight shining from top
directionalLight.castShadow = true; // default false
scene.add( directionalLight );

directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
//Set up shadow properties for the directionalLight
directionalLight.shadow.mapSize.width = 4096; // default 512
directionalLight.shadow.mapSize.height = 4096; // default 512
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 50; // default

const directionalLightHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
directionalLightHelper.visible = false

// Add directional light and helper to the scene
scene.add(directionalLight, directionalLightHelper)

// GUI controls for directional light
const lightFolder = gui.addFolder('Directional Light')
lightFolder.add(directionalLight.position, 'x', -25, 25, 0.1).name('Position X')
lightFolder.add(directionalLight.position, 'y', 10, 25, 0.1).name('Position Y')
lightFolder.add(directionalLight.position, 'z', -25, 25, 0.1).name('Position Z')
lightFolder.add(directionalLight, 'intensity', 0, 2, 0.01).name('Intensity')
lightFolder.open()

// GUI controls for directional light helper
const helperFolder = gui.addFolder('Directional Light Helper')
helperFolder.add(directionalLightHelper, 'visible').name('Visible')
helperFolder.open()


/**
 * Models
 */

const textureLoader = new THREE.TextureLoader()

//Texture

const textureStruttura = {
    map: textureLoader.load( 'models/sedia/textures/struttura.webp' ),
    ao: textureLoader.load( 'models/sedia/textures/struttura-ao.jpg' )
}

const textureImbottito = {
    map: textureLoader.load( 'models/sedia/textures/schienale.webp' ),
    ao: textureLoader.load( 'models/sedia/textures/imbottito-ao.jpg' )
}

const texturePiedini = {
    ao: textureLoader.load( 'models/sedia/textures/piedini-ao.jpg' )
}

const texturePavimento = {
    ao: textureLoader.load( 'models/sedia/textures/pavimento-ao.jpg' )
}

const textureSchienale = {
    map: textureLoader.load( 'models/sedia/textures/schienale.jpg' ),
    normal: textureLoader.load( 'models/sedia/textures/schienale-normal.jpg' ),
    roughness: textureLoader.load( 'models/sedia/textures/schienale-roughness.jpg' ),
}

const textureSeduta = {
    map: textureLoader.load( 'models/sedia/textures/seduta.jpg' ),
    normal: textureLoader.load( 'models/sedia/textures/seduta-normal.jpg' ),
    roughness: textureLoader.load( 'models/sedia/textures/seduta-roughness.jpg' ),
}

const gltfLoader = new GLTFLoader()

//Path sedia
gltfLoader.setResourcePath( 'models/sedia/textures/' );

const modelRotation = {
    y: 0
};

let controls;

//Load Sedia
gltfLoader.load(
    '/models/sedia/sedia-beba-curvy.glb',
    (gltf) => {
        gltf.scene.traverse((node) => {
            if (node.isMesh) {
                // console.log(node);

                // Controllo UV
                if (!node.geometry.attributes.uv) {
                    // console.warn(`Il nodo "${node.name}" non ha coordinate UV!`);
                    node.visible = false
                } else {
                    // console.log(`Il nodo "${node.name}" ha coordinate UV.`);
                }

                if (node.name === 'BEBA_Curvy_Imbottito') {
                    node.material.map = textureImbottito.map;
                    node.material.map.wrapS = THREE.RepeatWrapping;
                    node.material.map.wrapT = THREE.RepeatWrapping;
                    node.material.map.repeat.set(10, 10); // Assicurati che la scala sia corretta
                    node.material.map.offset.set(10, 10);

                    node.material.aoMap = textureImbottito.ao;
                    node.material.aoMap.wrapS = THREE.RepeatWrapping;
                    node.material.aoMap.wrapT = THREE.RepeatWrapping;
                    node.material.aoMap.repeat.set(.5, .5); // Assicurati che la scala sia corretta
                    node.material.aoMap.offset.set(.5, .5);

                    node.castShadow = true; // L'oggetto proietta ombre
                    node.receiveShadow = false; // L'oggetto riceve ombre

                } else if (node.name === 'BEBA_Curvy_Struttura') {
                    node.material.map = textureStruttura.map;
                    node.material.aoMap = textureStruttura.ao;
                    node.material.aoMap = textureImbottito.ao;
                    node.material.aoMap.wrapS = THREE.RepeatWrapping;
                    node.material.aoMap.wrapT = THREE.RepeatWrapping;
                    node.material.aoMap.repeat.set(.5, .5); // Assicurati che la scala sia corretta
                    node.material.aoMap.offset.set(.5, .5);

                    node.castShadow = true; // L'oggetto proietta ombre
                    node.receiveShadow = false; // L'oggetto riceve ombre

                } else if (node.name === 'BEBA_Curvy_Pavimento') {

                    node.visible = false;

                    node.material.aoMap = texturePavimento.ao;
                    node.material.aoMap.repeat.set(1, 1); // Assicurati che la scala sia corretta
                    node.material.aoMap.offset.set(1, 1);

                    node.castShadow = false; // L'oggetto proietta ombre
                    node.receiveShadow = true; // L'oggetto riceve ombre

                } else if (node.name === 'BEBA_Curvy_Piedini') {
                    node.material.aoMap = texturePiedini.ao;
                    node.material.aoMap.repeat.set(1, 1); // Assicurati che la scala sia corretta
                    node.material.aoMap.offset.set(1, 1);

                    node.castShadow = false; // L'oggetto proietta ombre
                    node.receiveShadow = true; // L'oggetto riceve ombre
                }

                node.material.needsUpdate = true; // Aggiorna il materiale
            }
        });

        // Ridimensiona il modello
        gltf.scene.scale.set(0.5, 0.5, 0.5); // Ridimensiona il modello a metà della dimensione originale
		scene.add( gltf.scene );

        // Calcola il bounding box del modello
        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        const size = boundingBox.getSize(new THREE.Vector3());
        const center = boundingBox.getCenter(new THREE.Vector3());
        console.log(size)

        // Imposta i limiti di zoom della camera
        const maxDim = Math.max(size.x, size.y, size.z);
        const minZoom = maxDim * 0.15; // Distanza minima di zoom
        const maxZoom = maxDim * 1; // Distanza massima di zoom

        //Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(center.x, center.y, center.z);
        controls.minDistance = minZoom;
        controls.maxDistance = maxZoom;
        controls.enableDamping = true;
        controls.maxPolarAngle = Math.PI / 2;
        controls.update();
    

        // Aggiungi un controllo GUI per la rotazione del modello
        const modelFolder = gui.addFolder('Model Rotation');
        modelFolder.add(modelRotation, 'y', -Math.PI, Math.PI, 0.01).name('Rotation Y');
        modelFolder.open();

        // Funzione di animazione
        const animate = () => {
            requestAnimationFrame(animate);

            // Applica la rotazione al modello
            gltf.scene.rotation.y = modelRotation.y;

            renderer.render(scene, camera);
        };

        animate();
    },
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(3000, 3000),
    new THREE.MeshStandardMaterial({
        color: '#ffffff',
        metalness: 0,
        roughness: 1
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(10, 10, 10)
scene.add(camera)

/**
 * Renderer
 */

// Variabile per il colore di sfondo
const backgroundColor = {
    color: 0x000000
}


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.setClearColor(backgroundColor.color);

renderer.outputEncoding = THREE.sRGBEncoding;

// Aggiungi un controllo GUI per il colore di sfondo
const backgroundFolder = gui.addFolder('Background Color');
backgroundFolder.addColor(backgroundColor, 'color').name('Color').onChange((value) => {
    renderer.setClearColor(value);
});
backgroundFolder.open();

/**
 * Fog
 */
scene.fog = new THREE.Fog('#ededed', 10, 50)

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    if (controls) {
        controls.update();
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

/**
 * TODO
 *
 * - Camera che non vada sotto il piano
 * - Ambient Ligth per ombre tropo scure su modello
 * - Centratura verticale e orizzontale della orbit camera sul centro dell'oggetto
 * - Gestione max/min Zoom
 */