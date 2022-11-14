# box-resizer

这是一个可通过鼠标拖拽，从各个方向来调整容器大小的组件

[在线预览](https://blog.zhouweibin.top/lab/box-resizer)

### 安装

```
yarn add @lucascv/box-resizer
// npm install @lucascv/box-resizer
```

### 使用

直接将组件 BoxResizer 放入需要调整的容器中即可，假设容器组件是 Box

```
// hook中使用
import { BoxResizer } from '@lucascv/box-resizer';
...
const boxRef = useRef<HTMLDivElement|null>(null);

return (
  ...
  <Box ref={boxRef}>
    <BoxResizer boxRef={boxRef}/>
  <Box/>
  ...
)
...
```

### 注意事项

容器暂且需要绝对定位、固定宽高，适用于给弹框类组件套壳

```
.Container {
  position: absolute;
  top: 100px;
  left: 100px;
  width: 300px;
  height: 300px;
  // NOTE: 以上为必备属性
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: aquamarine;
}
```

### API

| 属性     | 说明                                 | 类型                              | 默认值 | 版本 |
| -------- | ------------------------------------ | --------------------------------- | ------ | ---- |
| boxRef   | 必选。容器 ref，用于获取容器样式属性 | React.ref                         |        |
| config   | 可选。容器的一些配置                 | IConfig                           |        |
| onChange | 可选。容器改动后的回调               | (modalStyle: IModalStyle) => void |        |

config：
| 属性 | 说明 | 类型 | 默认值 | 版本 |
| minWidth | 可选。最小宽度 | number | 300 |
| maxWidth | 可选。最大宽度 | number | 800 |
| minHeight | 可选。最小高度 | number | 200 |
| maxHeight | 可选。最大高度 | number | 600 |
| resizeDirection | 可选。指定可缩放的边框，默认全部放开 | TResizeDirection | 全部 |

```typescript
type TResizeDirection =
  | 'right'
  | 'left'
  | 'top'
  | 'bottom'
  | 'lt'
  | 'lb'
  | 'rt'
  | 'rb';
```

### Todo

1.x

- [x] 上下左右拖动调整
- [x] 斜方向四个角度拖动调整
- [x] 宽高边缘限制

  2.x

- [ ] 放开容器限制，比如绝对布局/宽高
- [ ] 性能优化，拖动节流和引入 mutationObserver
- [ ] 体验优化

### 其他

该项目会持续优化，欢迎提 issues.
