---
layout: page.11ty.cjs
title: <brick-viewer>
---

## As easy as HTML

<section class="columns">
  <div>

Just use `<brick-viewer>` element like a normal HTML element.

```html
<brick-viewer
  src="./bulldozer.mpd"
></brick-viewer>
```

  </div>
  <div style="margin-top: 18px">
    <brick-viewer src="./models/bulldozer.mpd"></brick-viewer>
  </div>
</section>

## Declarative rendering

<knobs-example></knobs-example>

## Install

<section>

`<brick-viewer>` is distributed on npm, so you can install it locally or use it via npm CDNs like unpkg.com.

### Local Installation

```bash
npm i brick-viewer
```

### CDN

npm CDNs like [unpkg.com]() can directly serve files that have been published to npm. This works great for standard JavaScript modules that the browser can load natively.

For this element to work from unpkg.com specifically, you need to include the `?module` query parameter, which tells unpkg.com to rewrite "bare" module specificers to full URLs.

HTML example:

```html
<script type="module" src="https://unpkg.com/brick-viewer?module"></script>
```

JavaScript example:

```js
import {BrickViewer} from 'https://unpkg.com/brick-viewer?module';
```
</section>

## API

<section>

### Attributes

| Attribute | Property | Description |
| --- | --- | --- |
| src | src | A model (.mpd) URL |
| step | step | Which construction step of the model to display |

### Events

| Event name | Description |
| --- | --- | --- |
| model-loaded | Fired when a model is successfully loaded. |

</section>