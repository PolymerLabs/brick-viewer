import {
  LitElement,
  property,
  customElement,
  PropertyValues,
  html,
  css,
  query,
  internalProperty,
} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined';

import * as THREE from 'three';
import {LDrawLoader} from 'three/examples/jsm/loaders/LDrawLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import '@material/mwc-icon-button';
import '@material/mwc-slider';
import '@material/mwc-linear-progress';
import {Slider} from '@material/mwc-slider';

import ResizeObserver from 'resize-observer-polyfill';

/*
 * Much of this code is from the three.js LDraw example:
 * https://github.com/mrdoob/three.js/blob/dev/examples/webgl_loader_ldraw.html
 */

enum LoadState {
  LOADING,
  DONE,
  ERROR,
}

@customElement('brick-viewer')
export class BrickViewer extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      height: 300px;
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
    mwc-linear-progress,
    #error-message {
      position: absolute;
      top: 0;
      width: 100%;
    }
    #error-message {
      padding-top: 10px;
      color: red;
      text-align: center;
    }
    canvas {
      outline: none;
    }
  `;

  @property()
  src: string | null = null;

  @property({type: Number, reflect: true})
  step?: number;

  @internalProperty()
  private _loadState?: LoadState;

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
    this._controls.addEventListener('change', () =>
      requestAnimationFrame(this._animate)
    );

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
    requestAnimationFrame(this._animate);
  };

  private _restart() {
    this.step! = 1;
  }

  private _stepBack() {
    this.step! -= 1;
  }

  private _stepForward() {
    this.step! += 1;
  }

  private _resetCamera() {
    this._controls.reset();
  }

  render() {
    return html`
      ${this._renderer.domElement}
      ${this._loadState === LoadState.LOADING
        ? html`
            <mwc-linear-progress indeterminate></mwc-linear-progress>
          `
        : ''}
      ${this._loadState === LoadState.ERROR
        ? html`
            <div id="error-message">Couldn't load model.</div>
          `
        : ''}

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
          max=${ifDefined(this._numConstructionSteps)}
          ?disabled=${this._numConstructionSteps === undefined}
          value=${ifDefined(this.step)}
          @input=${(e: CustomEvent) => (this.step = e.detail.value)}
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
    if (changedProperties.has('step')) {
      this._updateObjectsVisibility();
    }
    super.update(changedProperties);
  }

  private _loadModel() {
    if (this.src === null) {
      return;
    }
    this._loadState = LoadState.LOADING;
    this._loader.setPath('').load(
      this.src,
      (newModel) => {
        this._loadState = LoadState.DONE;
        if (this._model !== undefined) {
          this._scene.remove(this._model);
          this._model = undefined;
        }

        this._model = newModel;

        // Convert from LDraw coordinates: rotate 180 degrees around OX
        this._model.rotation.x = Math.PI;
        this._scene.add(this._model);

        this._numConstructionSteps = this._model.userData.numConstructionSteps;
        this.step = this._numConstructionSteps!;

        // Adjust camera
        const bbox = new THREE.Box3().setFromObject(this._model);
        this._controls.target.copy(bbox.getCenter(new THREE.Vector3()));
        this._controls.update();
        this._controls.saveState();

        this.dispatchEvent(
          new CustomEvent('model-loaded', {bubbles: true, composed: true})
        );
      },
      undefined,
      this._onError
    );
  }

  private _updateObjectsVisibility() {
    this._model &&
      this._model.traverse((c: any) => {
        if (c.isGroup && this.step) {
          c.visible = c.userData.constructionStep <= this.step;
        }
      });
    requestAnimationFrame(this._animate);
  }

  private _animate = () => {
    this._renderer.render(this._scene, this._camera);
  };

  private _onError = () => {
    this._loadState = LoadState.ERROR;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'brick-viewer': BrickViewer;
  }
}
