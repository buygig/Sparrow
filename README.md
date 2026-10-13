# Sparrow

Sparrow 是一个基于 SVG 的小型 JavaScript 图表库，提供渲染器、比例尺、坐标转换以及点和文本几何标记。运行时不依赖第三方库。

## 本地开发

```sh
npm ci
npm run ci
```

`npm run ci` 依次执行代码检查、Jest 测试、构建和三个打包入口的验证。`npm run lint:fix` 修复格式问题；`npm test -- --runInBand` 串行运行测试；`npm run test-live` 使用 Electron 打开真实浏览器测试窗口。默认测试使用 jsdom，不需要图形桌面。

构建完成后直接用浏览器打开 [examples/index.html](examples/index.html)，查看柱状图、散点图和极坐标示例。

## 使用

构建生成三个入口：

| 环境 | 文件 | 使用方式 |
| --- | --- | --- |
| CommonJS | `lib/sparrow.js` | `const { createRenderer } = require('sparrow')` |
| ES Module | `esm/sparrow.mjs` | `import { createRenderer } from 'sparrow'` |
| 浏览器 script | `dist/sparrow.js` | `<script src="./dist/sparrow.js"></script>`，通过 `sp` 使用 |

以下示例在浏览器中绘制三个数据点。比例尺将数据映射到 `[0, 1]`，`cartesian()` 再将归一化位置转换为 SVG 像素位置。SVG 的 y 轴向下，因此 y 比例尺使用反向 range，让数值增大时标记向上移动。

```js
import { createRenderer, createLinear, createCoordinate, cartesian, point } from 'sparrow';

const renderer = createRenderer(600, 400);
const xScale = createLinear({ domain: [0, 10], range: [0, 1] });
const yScale = createLinear({ domain: [0, 10], range: [1, 0] });
const coordinate = createCoordinate({
  x: 40,
  y: 20,
  width: 520,
  height: 340,
  transforms: [cartesian()],
});

point(renderer, [0, 1, 2], {}, {
  x: [2, 5, 8].map(xScale),
  y: [3, 8, 5].map(yScale),
}, { fill: 'steelblue', r: 5 }, coordinate);

document.querySelector('#chart').appendChild(renderer.node());
```

渲染 SVG 需要浏览器 DOM；比例尺和坐标计算可独立使用。创建 renderer 不会自动挂载节点。

## API

### SVG 渲染器

`createRenderer(width, height)` 返回 `line`、`rect`、`circle`、`text`、`path` 和 `ring` 绘制方法，参数为 SVG 属性对象，返回创建的元素。`ring({ cx, cy, r1, r2, ...styles })` 返回内边线、环体和外边线三个圆。

属性可使用 camelCase（如 `strokeWidth`）；值为 `null` 或 `undefined` 的属性会省略。`text` 的内容通过 `textContent` 设置；`path.d` 支持标准 SVG 字符串，也支持 `[['M', 0, 0], ['L', 10, 10]]`。矩形支持负宽高。

`save()` 创建嵌套分组，`restore()` 回到上层分组；在根分组调用 `restore()` 不会越界。使用 `translate(tx, ty = 0)`、`rotate(degrees)`、`scale(sx, sy = sx)` 设置当前分组的变换。`node()` 获取 SVG，`group()` 获取当前分组。

### 比例尺

比例尺是可调用函数：`const scale = createLinear({ domain: [0, 100], range: [0, 1] }); scale(50)` 返回 `0.5`。

| 工厂 | 用途 |
| --- | --- |
| `createIdentity()` | 原值返回 |
| `createLinear({ domain, range, interpolate })` | 数值线性映射，支持 `ticks(count)` 和 `nice(count)` |
| `createLog({ domain, range, base })` | 正值对数映射，支持刻度和整化定义域 |
| `createTime({ domain, range })` | Date 时间映射，刻度返回 Date |
| `createOrdinal({ domain, range })` | 分类映射，range 不足时循环使用，未知类别返回 undefined |
| `createBand({ domain, range, padding })` | 分类区间，`bandWidth()` 获取带宽 |
| `createPoint({ domain, range })` | 分类点位置 |
| `createThreshold({ domain, range })` | 按显式阈值分段，阈值归入右侧区间 |
| `createQuantize({ domain, range })` | 数值范围等宽分段 |
| `createQuantile({ domain, range })` | 按样本分位数分段 |

`interpolateNumber(t, start, stop)` 和 `interpolateColor(t, [r, g, b], [r, g, b])` 可用于自定义线性插值。`nice()` 更新比例尺内部定义域；输入数组不会被修改。

### 坐标与标记

`createCoordinate({ x, y, width, height, transforms })` 返回坐标映射函数。默认是单位恒等映射；变换按数组顺序应用，可组合 `transpose()`、`polar({ innerRadius, outerRadius, startAngle, endAngle })` 和 `cartesian()`。极坐标角度单位为弧度，x 从 0 到 1 对应起止角度，y 从 0 到 1 对应外半径到内半径；需要映射到画布时，将 `cartesian()` 放在最后。坐标函数提供 `isPolar()` 和 `center()`。

`point(renderer, indices, scales, values, styles, coordinate)` 和 `text(renderer, indices, scales, values, styles, coordinate)` 返回对应 SVG 元素数组。`indices` 是数据索引，`values` 包含已经映射的通道数组，`scales` 为比例尺字典（当前这两个标记可传 `{}`）。两者必需 `x`、`y`，文本另需 `text`；可选通道包含 `fill`、`stroke`，点支持 `r`，文本支持 `rotate`、`fontSize`。通道值优先于直接样式，其次使用默认值。

原始 `drawRedRect(svg)` 演示接口仍可使用。
