import '../brick-viewer';
import { BrickViewer } from '../brick-viewer';
import { LitElement } from 'lit-element';
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';
export declare class KnobsExample extends LitElement {
    step: number;
    src: string;
    brickViewer: BrickViewer;
    sources: {
        filename: string;
        prettyName: string;
    }[];
    static styles: import("lit-element").CSSResult;
    firstUpdated(): void;
    render(): import("lit-element").TemplateResult;
}
//# sourceMappingURL=knobs-example.d.ts.map