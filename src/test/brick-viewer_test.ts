import {BrickViewer} from '../brick-viewer.js';
// import {fixture, html} from '@open-wc/testing';
import {assert} from 'chai';

suite('brick-viewer', () => {
  test('is defined', () => {
    const el = document.createElement('brick-viewer');
    assert.instanceOf(el, BrickViewer);
  });
});
