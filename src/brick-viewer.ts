import {
  LitElement,
  property,
  customElement,
  PropertyValues,
  html,
  css,
  query,
} from 'lit-element';

import * as THREE from 'three';
import {LDrawLoader} from 'three/examples/jsm/loaders/LDrawLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import '@material/mwc-icon-button';
import '@material/mwc-slider';
import {Slider} from '@material/mwc-slider';

import ResizeObserver from 'resize-observer-polyfill';

/*
 * Much of this code is from the three.js LDraw example:
 * https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_ldraw.html
 */

@customElement('brick-viewer')
export class BrickViewer extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      height: 200px;
    }
    #controls {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
    }
    mwc-slider {
      flex-grow: 1;
    }
  `;

  @property()
  src: string | null = null;

  @property({type: Number, attribute: 'step'})
  constructionStep?: number;

  @query('mwc-slider')
  slider!: Slider | null;

  private _camera: THREE.PerspectiveCamera;
  private _scene: THREE.Scene;
  private _renderer: THREE.WebGLRenderer;
  private _loader = new LDrawLoader();
  private _model: any;
  private _controls: OrbitControls;
  private _numConstructionSteps?: number;

  async firstUpdated() {
    // Buttons are loading after slider, so slider's initial width calculation is wrong.
    if (this.slider) {
      await this.slider.updateComplete;
      this.slider.layout();
    }
  }

  constructor() {
    super();

    this._camera = new THREE.PerspectiveCamera(
      45,
      this.clientWidth / this.clientHeight,
      1,
      10000
    );
    this._camera.position.set(150, 200, 250);

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xdeebed);

    const ambientLight = new THREE.AmbientLight(0xdeebed, 0.4);
    this._scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-1000, 1200, 1500);
    this._scene.add(directionalLight);

    this._renderer = new THREE.WebGLRenderer({antialias: true});
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(this.offsetWidth, this.offsetHeight);

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);

    (this._loader as any).separateObjects = true;

    this._animate();

    const resizeObserver = new ResizeObserver(this._onResize);
    resizeObserver.observe(this);
  }

  private _onResize: ResizeObserverCallback = (
    entries: ResizeObserverEntry[]
  ) => {
    const {width, height} = entries[0].contentRect;
    this._renderer.setSize(width, height);
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
  };

  private _restart() {
    this.constructionStep! = 1;
  }

  private _stepBack() {
    this.constructionStep! -= 1;
  }

  private _stepForward() {
    this.constructionStep! += 1;
  }

  private _resetCamera() {
    this._controls.reset();
  }

  render() {
    return html`
      ${this._renderer.domElement}
      <div id="controls">
        <mwc-icon-button
          @click=${this._restart}
          icon="replay"
        ></mwc-icon-button>
        <mwc-icon-button
          @click=${this._stepBack}
          icon="navigate_before"
        ></mwc-icon-button>
        <mwc-slider
          step="1"
          pin
          markers
          min="1"
          .max=${this._numConstructionSteps || 10}
          ?disabled=${this._numConstructionSteps === undefined}
          .value=${this.constructionStep || 10}
          @input=${(e: CustomEvent) => (this.constructionStep = e.detail.value)}
        ></mwc-slider>
        <mwc-icon-button
          @click=${this._stepForward}
          icon="navigate_next"
        ></mwc-icon-button>
        <mwc-icon-button
          @click=${this._resetCamera}
          icon="center_focus_strong"
        ></mwc-icon-button>
      </div>
    `;
  }

  update(changedProperties: PropertyValues) {
    if (changedProperties.has('src')) {
      this._loadModel();
    }
    if (changedProperties.has('constructionStep')) {
      this._updateObjectsVisibility();
    }
    super.update(changedProperties);
  }

  private _loadModel() {
    console.log('loading');
    if (this.src === null) {
      return;
    }
    this._loader.setPath('').load(
      this.src,
      (newModel) => {
        if (this._model !== undefined) {
          console.log('Removing old model');
          this._scene.remove(this._model);
          this._model = undefined;
        }

        this._model = newModel;

        // Convert from LDraw coordinates: rotate 180 degrees around OX
        this._model.rotation.x = Math.PI;
        this._scene.add(this._model);

        this._numConstructionSteps = this._model.userData.numConstructionSteps;
        this.constructionStep = this._numConstructionSteps!;

        // Adjust camera
        const bbox = new THREE.Box3().setFromObject(this._model);
        this._controls.target.copy(bbox.getCenter(new THREE.Vector3()));
        this._controls.update();
        this._controls.saveState();
      },
      onProgress,
      onError
    );
  }

  private _updateObjectsVisibility() {
    this._model &&
      this._model.traverse((c: any) => {
        if (c.isGroup && this.constructionStep) {
          c.visible = c.userData.constructionStep <= this.constructionStep;
        }
      });
  }

  private _animate = () => {
    // TODO: only rAF when there's an animation/interaction
    requestAnimationFrame(this._animate);
    this._renderer.render(this._scene, this._camera);
  };
}

function onProgress(e: ProgressEvent) {
  console.log('progress');
  // TODO: lengthComputable not available because es dev server doesn't
  // send content-size header
  if (e.lengthComputable) {
    // TODO: Add a progress bar
    console.log(Math.round((e.loaded / e.total) * 100) + '% downloaded');
  }
}

function onError() {
  // TODO: show in UI
  const message = 'Error loading model';
  console.log(message);
}

declare global {
  interface HTMLElementTagNameMap {
    'brick-viewer': BrickViewer;
  }
}
