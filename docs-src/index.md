---
layout: page.11ty.cjs
title: <brick-viewer>
---

## As easy as HTML

<knobs-example></knobs-example>

## Declarative rendering

<section class="columns">
  <div>

`<brick-viewer>` can be also used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const url="models/bulldozer.mpd";

render(html`
  <brick-viewer src=${url}></brick-viewer>
`, document.body);
```

  </div>
</section>

## Install

<section class="columns">
<div>

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

```html
import {BrickViewer} from 'https://unpkg.com/brick-viewer?module';
```
</div>
</section>

## API

<section class="columns">
<div>

### Attributes

| Attribute | Property | Description |
| --- | --- | --- |
| src | src | A model (.mpd) URL |
| step | step | Which construction step of the model to display |

### Events

| Event name | Description |
| --- | --- | --- |
| model-loaded | Fired when a model is successfully loaded. |

</div>
</section>