import '../brick-viewer';
import {BrickViewer} from '../brick-viewer';
import {LitElement, html, css} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import '@material/mwc-select';
import {Select} from '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

@customElement('knobs-example')
export class KnobsExample extends LitElement {
  @property({type: Number}) step = 1;
  @property({type: String}) src = 'radar_truck';

  @query('brick-viewer') brickViewer!: BrickViewer;

  sources = [
    {filename: 'bulldozer', prettyName: 'Bulldozer'},
    {filename: 'radar_truck', prettyName: 'Radar Truck'},
  ];

  static styles = css`
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
    .code .attribute, .code .string {
      color: #a6e22e;
    }
    .code .value {
      color: #e6db74;
    }
    .code .keyword {
      color: #66d9ef;
    }
  `;

  firstUpdated() {
    debugger;
    const targetNode = this.brickViewer;
    const config = {attributes: true};
    const callback: MutationCallback = (mutationsList) => {
      debugger;
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'step'
        ) {
          this.step = Number(targetNode.getAttribute('step'));
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  render() {
    return html`
      <div>
        <p>
          <code>&lt;brick-viewer&gt;</code> can be also used with declarative
          rendering libraries like Angular, React, Vue, and lit-html.<br />Change
          the "step" and "src" attributes to control the model.
        </p>
        <p>
          <span id="step-label">step:</span>
          <input
            type="number"
            min="1"
            max="66"
            .value="${this.step}"
            @change=${(e: Event) => {
              this.step = Number((e.target as HTMLInputElement).value);
            }}
          />
          <span id="src-label">src:</span>
          <mwc-select
            outlined
            @action=${(e: CustomEvent) => {
              this.src = (e.target! as Select).selected!.value;
            }}
          >
            ${this.sources.map(
              (source) => html`
                <mwc-list-item
                  ?selected=${source.filename === this.src}
                  value="${source.filename}"
                  >${source.prettyName}</mwc-list-item
                >
              `
            )}
          </mwc-select>
        </p>
        <pre class="code">
<span class="keyword">import</span> {html, render} <span class="keyword">from</span> <span class="string">'lit-html'</span>;

<span class="keyword">let</span> url = <span class="string">'./${this.src}.mpd'</span>;
<span class="keyword">let</span> step = <span class="value">${this.step}</span>;

render(html<span class="string">&#96;</span>
  &lt;<span class="tag">brick-viewer</span>
    <span class="attribute">src</span>=<span class="value">"\$\{</span>url<span class="value">}"</span>
    <span class="attribute">step</span>=<span class="value">"\$\{</span>step<span class="value">\}"</span>
  &gt;&lt;/<span class="tag">brick-viewer</span>&gt;
<span class="string">&#96;</span>, <span class="value">document</span>.body);</pre>
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
}
