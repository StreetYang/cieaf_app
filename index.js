/*!
 * CIEAF_APP 0.1.x
 * Copyright 2022 StreetYang
 * Released under MIT License
 */

import { html as h, render as r } from 'lit-html'

function createApp(el, main, data) {

    const parent = el.shadowRoot || el;
    let changed = false;

    const ctx = new Proxy(data || {}, {
        get(target, attr) {
            if (!changed) {
                changed = true;
                setTimeout(render);
            }
            return target[attr];
        },

        set(target, attr, value) {
            if (!changed) {
                changed = true;
                setTimeout(render);
            }
            target[attr] = value;
            return true;
        }
    })

    function render() {
        r(h`${main(ctx)}`, parent);
        changed = false;
    }

    ctx.$el = el;
    return ctx;
}

export { h, createApp }