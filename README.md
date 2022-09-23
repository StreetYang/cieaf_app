# cieaf_app
a reactive element creater

# 安装
```
> npm i cieaf_app
```

# 使用
```
import { h, createApp } from 'cieaf_app'

const el = document.getElementById('app');

const main = app => h`
    <a @click=${() => app.count++}>${app.count}</a>
    `;

createApp(el, main, { count: 0 });
```