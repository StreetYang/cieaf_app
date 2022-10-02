/*!
 * CIEAF_APP 0.1.x
 * Copyright 2022 StreetYang
 * Released under MIT License
 */

import { html as h, render as r } from 'lit-html'

class App {
    constructor(el, render, opts) {
        this.el = el;
        this._render = render;
        this._opts = Object(opts);
        this._done = false;

        this._initRoot();
        this._initData();
        this._initCSS();
        this._initProps();
        this.render()
    }

    _initRoot() {
        const { el, _opts } = this;
        if (_opts.shadow && !el.shadowRoot) {
            el.attachShadow({ mode: 'open' });
        }
        this.root = el.shadowRoot || el;
    }

    _initData() {
        const t = this;
        let data = t._opts.data || {};

        if (typeof data === 'function')
            data = data.call(t);
        if (typeof data !== 'object')
            throw Error('data type error');

        t.data = new Proxy(data, {
            get(target, attr) {
                if (t._done) {
                    t._done = false;
                    setTimeout(t.render.bind(t));
                }
                return target[attr];
            },

            set(target, attr, value) {
                if (t._done) {
                    t._done = false;
                    setTimeout(t.render.bind(t));
                }
                target[attr] = value;
                return true;
            }
        })
    }

    _initCSS() {
        const t = this;
        const { _opts, root } = t;

        let css = _opts.css;
        if (typeof css === 'string') {
            if (root.nodeType === 11) {
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(css);
                root.adoptedStyleSheets.push(sheet);
            } else {
                const el = document.createElement('style');
                el.textContent = css;
                root.appendChild(el);
            }
        }
    }

    _initProps() {
        const { _opts } = this;
        const ignore = ['data', 'css', 'shadow'];
        for (const name in _opts) {
            if (ignore.includes(name))
                continue;

            const value = _opts[name];
            if (typeof value === 'function')
                this[name] = value.bind(this);
            else
                this[name] = value;
        }
    }

    render() {
        this._done = false;
        r(h`${this._render(this)}`, this.root);
        this._done = true;
    }
}

function createApp(el, render, opts) {
    return new App(el, render, opts);
}

export { h, createApp }