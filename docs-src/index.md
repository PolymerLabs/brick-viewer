---
layout: page.11ty.cjs
title: <brick-viewer> ⌲ Home
---

# &lt;brick-viewer>

`<brick-viewer>` is an element that displays models of a certain type of plastic brick.

## As easy as HTML

<section class="columns">
  <div>

`<brick-viewer>` is just an HTML element. You can it anywhere you can use HTML! It can be configured with attributes in plain HTML.

```html
<brick-viewer src='./models/lunar.mpd'></brick-viewer>
```

  </div>
  <div>

<brick-viewer src='./models/lunar.mpd'></brick-viewer>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<brick-viewer>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const url="models/lunar.mpd";

render(html`
  <brick-viewer .src=${url}></brick-viewer>
`, document.body);
```

  </div>
</section>
