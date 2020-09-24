var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import '../brick-viewer';
import { LitElement, customElement, html, css, property, query, } from 'lit-element';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
let KnobsExample = class KnobsExample extends LitElement {
    constructor() {
        super(...arguments);
        this.step = 1;
        this.src = 'bulldozer';
        this.sources = [
            { filename: 'bulldozer', prettyName: 'Bulldozer' },
            { filename: 'radar_truck', prettyName: 'Radar Truck' },
        ];
    }
    firstUpdated() {
        debugger;
        const targetNode = this.brickViewer;
        const config = { attributes: true };
        const callback = (mutationsList) => {
            debugger;
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'step') {
                    this.step = Number(targetNode.getAttribute('step'));
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    render() {
        return html `
      <div>
        <p>
          Use the brick-viewer tag like a normal HTML element. Change the "step"
          and "src" attributes to control the model.
        </p>
        <p>
          <span id="step-label">step:</span>
          <input
            type="number"
            min="1"
            max="66"
            .value="${this.step}"
            @change=${(e) => {
            this.step = Number(e.target.value);
        }}
          />
          <span id="src-label">src:</span>
          <mwc-select
            outlined
            @action=${(e) => {
            this.src = e.target.selected.value;
        }}
          >
            ${this.sources.map((source) => html `
                <mwc-list-item
                  ?selected=${source.filename === this.src}
                  value="${source.filename}"
                  >${source.prettyName}</mwc-list-item
                >
              `)}
          </mwc-select>
        </p>
        <pre class="code">
&lt;<span class="tag">brick-viewer</span>
  <span class="attribute">step</span>=<span class="value">"${this.step}"</span>
  <span class="attribute">src</span>=<span class="value">"./${this
            .src}.mpd"</span>
&gt;&lt;/<span class="tag">brick-viewer</span>&gt;</pre>
      </div>
      <div>
        <p>
          Result:
        </p>
        <brick-viewer
          step="${this.step}"
          src="./models/${this.src}.mpd"
          id="main-example"
        ></brick-viewer>
      </div>
    `;
    }
};
KnobsExample.styles = css `
    :host {
      --mdc-theme-primary: green;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 488px));
      grid-gap: 24px 48px;
      justify-content: center;
    }

    :host > div {
      flex: 1;
    }

    span {
      font-style: bold;
    }
    #src-label {
      margin-left: 15px;
    }
    #src-label,
    #step-label {
      font-weight: bold;
    }

    mwc-select {
      vertical-align: middle;
    }

    input[type='number'] {
      padding: 16px;
      font-size: 16px;
      font-family: Roboto;
      color: rgba(0, 0, 0, 0.87) !important;
      outline-color: var(--mdc-select-outlined-idle-border-color) !important;
    }
    input[type='number']:focus {
      outline-color: var(--mdc-theme-primary) !important;
    }

    .code {
      background: #272822;
      padding: 1em;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      color: #f8f8f2;
    }
    .code .tag {
      color: #f92672;
    }
    .code .attribute {
      color: #a6e22e;
    }
    .code .value {
      color: #e6db74;
    }
  `;
__decorate([
    property({ type: Number })
], KnobsExample.prototype, "step", void 0);
__decorate([
    property({ type: String })
], KnobsExample.prototype, "src", void 0);
__decorate([
    query('brick-viewer')
], KnobsExample.prototype, "brickViewer", void 0);
KnobsExample = __decorate([
    customElement('knobs-example')
], KnobsExample);
export { KnobsExample };
//# sourceMappingURL=knobs-example.js.map