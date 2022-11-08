# box-resizer

这是一个可通过鼠标拖拽，从各个方向来调整容器大小的组件

### 在线预览

### 使用
#### 怎么使用
直接将组件 BoxResizer 放入需要调整的容器中即可，假设容器是 Box
```
// hook中使用
import { BoxResizer } from '@lucascv/box-resizer';
...
const boxRef = useRef<HTMLDivElement>(null);

return (
  ...
  <Box ref={boxRef}>
    <BoxResizer boxRef={boxRef}/>
  <Box/>
  ...
)
...
```
#### 注意事项
容器暂且需要绝对定位、固定宽高，适用于给弹框类组件套壳
```
.Container {
  position: absolute;
  box-sizing: border-box;
  top: 100px;
  left: 100px;
  width: 300px;
  height: 300px;
  // 以上为必备属性
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: aquamarine;
}

```

### API
属性|说明|类型|默认值|版本
-|-|-|-|-
boxRef|必选。容器ref，用于获取容器样式属性|ref||
minWidth|最小宽度|number|300|
maxWidth|最大宽度|number|800|
minHeight|最小高度|number|200|
maxHeight|最大高度|number|600|

### Todo
- [x] 上下左右拖动调整
- [x] 斜方向四个角度拖动调整
- [x] 宽高边缘限制

### 其他
该项目会持续优化，欢迎提issues.
