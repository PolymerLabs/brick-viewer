---
layout: page.11ty.cjs
title: <brick-viewer> ⌲ Home
---

# &lt;brick-viewer>

`<brick-viewer>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<brick-viewer>` is just an HTML element. You can it anywhere you can use HTML!

```html
<brick-viewer></brick-viewer>
```

  </div>
  <div>

<brick-viewer></brick-viewer>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<brick-viewer>` can be configured with attributed in plain HTML.

```html
<brick-viewer name="HTML"></brick-viewer>
```

  </div>
  <div>

<brick-viewer name="HTML"></brick-viewer>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<brick-viewer>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name="lit-html";

render(html`
  <h2>This is a &lt;brick-viewer&gt;</h2>
  <brick-viewer .name=${name}></brick-viewer>
`, document.body);
```

  </div>
  <div>

<h2>This is a &lt;brick-viewer&gt;</h2>
<brick-viewer name="lit-html"></brick-viewer>

  </div>
</section>
