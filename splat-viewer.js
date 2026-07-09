import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import * as GaussianSplats3D from 'https://unpkg.com/@mkkellogg/gaussian-splats-3d@0.4.2/build/gaussian-splats-3d.module.js';

class SplatViewer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.position = 'relative';
        container.style.backgroundColor = '#000000';

        const loader = document.createElement('div');
        loader.innerText = 'Učitavam 3D scenu...';
        loader.style.position = 'absolute';
        loader.style.top = '50%';
        loader.style.left = '50%';
        loader.style.transform = 'translate(-50%, -50%)';
        loader.style.color = '#ffffff';
        loader.style.fontFamily = 'sans-serif';
        loader.style.zIndex = '999';

        container.appendChild(loader);
        this.shadowRoot.appendChild(container);

        const viewer = new GaussianSplats3D.Viewer({
            'initialCameraPosition': [0, 5, 10],
            'initialCameraLookAt': [0, 0, 0],
            'rootElement': container,
            'sphericalHarmonicsDegree': 0
        });

        viewer.addSplatScene('https://oliverkrivic-dot.github.io/gaussian-test1/meetingroom2.spz', {
            'splatAlphaRemovalThreshold': 5,
            'showLoadingUI': false
        })
        .then(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
            viewer.start();
        })
        .catch((error) => {
            console.error("Greška:", error);
            loader.innerText = "Greška pri učitavanju.";
        });

        // Resize osluškivač preraspoređen na razinu elementa
        window.addEventListener('resize', () => {
            if (viewer && viewer.renderer) {
                viewer.renderer.setSize(this.clientWidth, this.clientHeight);
            }
        });
    }
}

customElements.define('splat-viewer', SplatViewer);