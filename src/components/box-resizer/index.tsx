import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
import styles from './index.module.less';

// resizer 对象
const resizeConf = {
  preX: 0,
  preY: 0, // 鼠标上次位置
  state: '', // 标识是否处于resize和resize的类型
  targetInitX: 0,
  targetInitY: 0, // 元素初始位置
  minWidth: 300,
  maxWidth: 800, // 边界值
  minHeight: 200,
  maxHeight: 600,
  maxLeft: 0, // 记录上一次到达边界的定位值
  minLeft: 0,
  maxTop: 0,
  minTop: 0,
  resizeDirections: ['right', 'left', 'top', 'bottom', 'lt', 'lb', 'rt', 'rb']
};

// interface IProps {
//   boxRef: any;
//   minWidth?: number; // 最小宽度
//   maxWidth?: number; // 最大宽度
//   minHeight?: number; // 最小高度
//   maxHeight?: number; // 最大高度
// }

export default function BoxResizer(props: any) {
  const { boxRef, config } = props;
  const resizeConfRef = useRef({
    ...resizeConf,
    ...config
  });
  const { resizeDirections } = resizeConfRef.current;

  // resizer handler
  function handleMouseDown(direction: any, e: any) {
    // 记录一开始的鼠标位置
    const { clientX: preX, clientY: preY } = e;
    resizeConfRef.current.preX = preX;
    resizeConfRef.current.preY = preY;
    resizeConfRef.current.state = direction;
  }

  // 全局 mouseup event
  function handleDocMouseUp(e: any) {
    if (resizeConfRef.current.state) {
      initResizeConf();
    }
  }

  // 全局 mousemove event
  function handleDocMouseMove(e: any) {
    if (!resizeConfRef.current.state) return;
    const {
      state,
      preX,
      preY,
      minHeight,
      minWidth,
      maxWidth,
      maxHeight,
      minLeft,
      maxLeft,
      minTop,
      maxTop
    } = resizeConfRef.current;

    // 记录鼠标移动位置
    const { clientX: curX, clientY: curY } = e;

    // 通过对象查找对应处理方法
    const handlers = {
      right: () => {
        // console.log("right");
        // 计算偏移量
        const diffWidth = curX - preX;
        resizeConfRef.current.preX = curX;
        if (boxRef.current) {
          const { width: previewModalWidth } =
            boxRef.current.getBoundingClientRect();
          // console.log(previewModalWidth);
          const newPreviewModalWidth = previewModalWidth + diffWidth;
          boxRef.current.style.width = newPreviewModalWidth + 'px';
          // 防止到左边界，右边轴调整尺寸后再回到左边轴调整时定位冲突
          resizeConfRef.current.minLeft = 0;
          resizeConfRef.current.maxLeft = 0;
          // 边界控制
          if (newPreviewModalWidth <= minWidth) {
            boxRef.current.style.width = minWidth + 'px';
          }
          if (newPreviewModalWidth >= maxWidth) {
            boxRef.current.style.width = maxWidth + 'px';
          }
        }
      },
      bottom: () => {
        // 计算偏移量
        const diffHeight = curY - preY;
        resizeConfRef.current.preY = curY;
        if (boxRef.current) {
          const { height: previewModalHeight } =
            boxRef.current.getBoundingClientRect();
          const newPreviewModalHeight = previewModalHeight + diffHeight;
          boxRef.current.style.height = newPreviewModalHeight + 'px';
          // 防止到上边界，下边轴调整尺寸后再回到左边轴调整时定位冲突
          resizeConfRef.current.minTop = 0;
          resizeConfRef.current.maxTop = 0;
          // 边界控制
          if (newPreviewModalHeight <= minHeight) {
            boxRef.current.style.height = minHeight + 'px';
          }
          if (newPreviewModalHeight >= maxHeight) {
            boxRef.current.style.height = maxHeight + 'px';
          }
        }
      },
      left: () => {
        // console.log('left');
        // 计算偏移量
        const diffWidth = curX - preX;
        resizeConfRef.current.preX = curX;
        if (boxRef.current) {
          const { width: previewModalWidth, left: previewModalLeft } =
            boxRef.current.getBoundingClientRect();
          // 如果有改变了translate，要解决translateX冲突。这里是要兼容外层套一层react-draggable的问题，如果没操作translate，则不影响（translate默认为0）
          const transformStyle = boxRef.current.style.transform;
          const translateX =
            Number(transformStyle.replace(/[^\d|,]/g, '').split(',')[0]) || 0;
          const realLeft = previewModalLeft - translateX;
          const newPreviewModalWidth = previewModalWidth - diffWidth;
          // 动态调整modal位置
          boxRef.current.style.left = realLeft + diffWidth + 'px';
          boxRef.current.style.width = newPreviewModalWidth + 'px';
          // 边界控制，目前到达边界，元素位置还是会移动
          if (newPreviewModalWidth <= minWidth) {
            if (minLeft) {
              boxRef.current.style.left = minLeft + 'px';
            } else {
              boxRef.current.style.left = realLeft - diffWidth + 'px';
              resizeConfRef.current.minLeft = realLeft + diffWidth; // 保存第一次到达边界的left
            }
            boxRef.current.style.width = minWidth + 'px';
          }
          if (newPreviewModalWidth >= maxWidth) {
            if (maxLeft) {
              boxRef.current.style.left = maxLeft + 'px';
            } else {
              boxRef.current.style.left = realLeft - diffWidth + 'px';
              resizeConfRef.current.maxLeft = realLeft + diffWidth; // 保存第一次到达边界的left
            }
            boxRef.current.style.width = maxWidth + 'px';
          }
        }
      },
      top: () => {
        // console.log('top');
        // 计算偏移量
        const diffHeight = curY - preY;
        resizeConfRef.current.preY = curY;
        if (boxRef.current) {
          const { height: previewModalHeight, top: previewModalTop } =
            boxRef.current.getBoundingClientRect();
          // 如果有改变了translate，要解决translateX冲突。这里是要兼容外层套一层react-draggable的问题，如果没操作translate，则不影响
          const transformStyle = boxRef.current.style.transform;
          const translateY =
            Number(transformStyle.replace(/[^\d|,]/g, '').split(',')[1]) || 0;
          // console.log(translateY);
          const realTop = previewModalTop - translateY;
          const newPreviewModalHeight = previewModalHeight - diffHeight;
          // 动态调整modal位置
          boxRef.current.style.top = realTop + diffHeight + 'px';
          boxRef.current.style.height = newPreviewModalHeight + 'px';
          // console.log(realTop);
          // 边界控制，目前到达边界，元素位置还是会移动
          if (newPreviewModalHeight <= minHeight) {
            if (minTop) {
              boxRef.current.style.top = minTop + 'px';
            } else {
              boxRef.current.style.top = realTop - diffHeight + 'px';
              resizeConfRef.current.minTop = realTop + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.height = minHeight + 'px';
          }
          if (newPreviewModalHeight >= maxHeight) {
            if (maxTop) {
              boxRef.current.style.top = maxTop + 'px';
            } else {
              boxRef.current.style.top = realTop - diffHeight + 'px';
              resizeConfRef.current.maxTop = realTop + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.height = maxHeight + 'px';
          }
        }
      },
      lt: () => {
        // console.log('leftTop');
        // 计算偏移量
        const diffWidth = curX - preX;
        const diffHeight = curY - preY;
        resizeConfRef.current.preX = curX;
        resizeConfRef.current.preY = curY;
        if (boxRef.current) {
          const {
            width: previewModalWidth,
            height: previewModalHeight,
            left: previewModalLeft,
            top: previewModalTop
          } = boxRef.current.getBoundingClientRect();
          // 如果有改变了translate，要解决translateX冲突。这里是要兼容外层套一层react-draggable的问题，如果没操作translate，则不影响
          const transformStyle = boxRef.current.style.transform;
          const translateX =
            Number(transformStyle.replace(/[^\d|,]/g, '').split(',')[0]) || 0;
          const translateY =
            Number(transformStyle.replace(/[^\d|,]/g, '').split(',')[1]) || 0;
          const realTop = previewModalTop - translateY;
          const realLeft = previewModalLeft - translateX;
          const newPreviewModalWidth = previewModalWidth - diffWidth;
          const newPreviewModalHeight = previewModalHeight - diffHeight;
          // 动态调整modal位置
          boxRef.current.style.left = realLeft + diffWidth + 'px';
          boxRef.current.style.width = newPreviewModalWidth + 'px';
          boxRef.current.style.top = realTop + diffHeight + 'px';
          boxRef.current.style.height = newPreviewModalHeight + 'px';
          // 边界控制，目前到达边界，元素位置还是会移动
          // 最小高度边界
          if (newPreviewModalHeight <= minHeight) {
            if (minTop) {
              // console.log(minTop);
              boxRef.current.style.top = minTop + 'px';
            } else {
              boxRef.current.style.top = realTop - diffHeight + 'px';
              resizeConfRef.current.minTop = realTop + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.height = minHeight + 'px';
          }
          // 最大高度边界
          if (newPreviewModalHeight >= maxHeight) {
            if (maxTop) {
              // console.log(maxTop);
              boxRef.current.style.top = maxTop + 'px';
            } else {
              boxRef.current.style.top = realTop - diffHeight + 'px';
              resizeConfRef.current.maxTop = realTop + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.height = maxHeight + 'px';
          }
          // 最小宽度边界
          if (newPreviewModalWidth <= minWidth) {
            if (minLeft) {
              // console.log(minLeft);
              boxRef.current.style.left = minLeft + 'px';
            } else {
              boxRef.current.style.left = realLeft - diffHeight + 'px';
              resizeConfRef.current.minLeft = realLeft + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.width = minWidth + 'px';
          }
          // 最大宽度边界
          if (newPreviewModalWidth >= maxWidth) {
            if (maxLeft) {
              // 只走了这个逻辑，因为只到了这个边界
              // console.log(maxLeft);
              boxRef.current.style.left = maxLeft + 'px';
            } else {
              boxRef.current.style.left = realLeft - diffHeight + 'px';
              resizeConfRef.current.maxLeft = realLeft + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.width = maxWidth + 'px';
          }
        }
      },
      lb: () => {
        // console.log('leftBottom');
        // 计算偏移量
        const diffWidth = curX - preX;
        const diffHeight = curY - preY;
        resizeConfRef.current.preX = curX;
        resizeConfRef.current.preY = curY;
        if (boxRef.current) {
          const {
            width: previewModalWidth,
            height: previewModalHeight,
            left: previewModalLeft
          } = boxRef.current.getBoundingClientRect();
          // 如果有改变了translate，要解决translateX冲突。这里是要兼容外层套一层react-draggable的问题，如果没操作translate，则不影响
          const transformStyle = boxRef.current.style.transform;
          const translateX =
            Number(transformStyle.replace(/[^\d|,]/g, '').split(',')[0]) || 0;
          const realLeft = previewModalLeft - translateX;
          const newPreviewModalWidth = previewModalWidth - diffWidth;
          const newPreviewModalHeight = previewModalHeight + diffHeight;
          // 动态调整modal位置
          boxRef.current.style.left = realLeft + diffWidth + 'px';
          boxRef.current.style.width = newPreviewModalWidth + 'px';
          boxRef.current.style.height = newPreviewModalHeight + 'px';
          // 防止到上边界，下边轴调整尺寸后再回到左边轴调整时定位冲突
          resizeConfRef.current.minTop = 0;
          resizeConfRef.current.maxTop = 0;
          // 最小高度边界
          if (previewModalHeight <= minHeight) {
            boxRef.current.style.height = maxHeight + 'px';
          }
          // 最大高度边界
          if (previewModalHeight >= maxHeight) {
            boxRef.current.style.height = maxHeight + 'px';
          }
          // 最小宽度边界
          if (previewModalWidth <= minWidth) {
            boxRef.current.style.left = realLeft - diffWidth + 'px';
            boxRef.current.style.width = minWidth + 'px';
          }
          // 最大宽度边界
          if (previewModalWidth >= maxWidth) {
            boxRef.current.style.left = realLeft - diffWidth + 'px';
            boxRef.current.style.width = maxWidth + 'px';
          }
        }
      },
      rt: () => {
        // console.log('rightTop');
        // 计算偏移量
        const diffWidth = curX - preX;
        const diffHeight = curY - preY;
        resizeConfRef.current.preX = curX;
        resizeConfRef.current.preY = curY;
        if (boxRef.current) {
          const {
            width: previewModalWidth,
            height: previewModalHeight,
            top: previewModalTop
          } = boxRef.current.getBoundingClientRect();
          // 如果有改变了translate，要解决translateX冲突。这里是要兼容外层套一层react-draggable的问题，如果没操作translate，则不影响
          const transformStyle = boxRef.current.style.transform;
          const translateY =
            Number(transformStyle.replace(/[^\d|,]/g, '').split(',')[1]) || 0;
          const realTop = previewModalTop - translateY;
          const newPreviewModalWidth = previewModalWidth + diffWidth;
          const newPreviewModalHeight = previewModalHeight - diffHeight;
          // 动态调整modal位置
          boxRef.current.style.top = realTop + diffHeight + 'px';
          boxRef.current.style.width = newPreviewModalWidth + 'px';
          boxRef.current.style.height = newPreviewModalHeight + 'px';
          // 防止到左边界，右边轴调整尺寸后再回到左边轴调整时定位冲突
          resizeConfRef.current.minLeft = 0;
          resizeConfRef.current.maxLeft = 0;
          // 最小高度边界
          if (newPreviewModalHeight <= minHeight) {
            if (minTop) {
              // console.log(minTop);
              boxRef.current.style.top = minTop + 'px';
            } else {
              boxRef.current.style.top = realTop - diffHeight + 'px';
              resizeConfRef.current.minTop = realTop + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.height = minHeight + 'px';
          }
          // 最大高度边界
          if (newPreviewModalHeight >= maxHeight) {
            if (maxTop) {
              // console.log(minTop);
              boxRef.current.style.top = maxTop + 'px';
            } else {
              boxRef.current.style.top = realTop - diffHeight + 'px';
              resizeConfRef.current.maxTop = realTop + diffHeight; // 保存第一次到达边界的left
            }
            boxRef.current.style.height = maxHeight + 'px';
          }
          // 最小宽度边界
          if (newPreviewModalWidth <= minWidth) {
            boxRef.current.style.width = minWidth + 'px';
          }
          // 最大宽度边界
          if (newPreviewModalWidth >= maxWidth) {
            boxRef.current.style.width = maxWidth + 'px';
          }
        }
      },
      rb: () => {
        // console.log('righBottom');
        // 计算偏移量
        const diffWidth = curX - preX;
        const diffHeight = curY - preY;
        resizeConfRef.current.preX = curX;
        resizeConfRef.current.preY = curY;
        if (boxRef.current) {
          const { width: previewModalWidth, height: previewModalHeight } =
            boxRef.current.getBoundingClientRect();
          const newPreviewModalWidth = previewModalWidth + diffWidth;
          const newPreviewModalHeight = previewModalHeight + diffHeight;
          // 动态调整modal位置
          boxRef.current.style.width = newPreviewModalWidth + 'px';
          boxRef.current.style.height = newPreviewModalHeight + 'px';
          // 边界控制，目前到达边界，元素位置还是会移动
          // 防止到边界，对立边轴调整尺寸后再回到原边轴调整时定位冲突
          resizeConfRef.current.minLeft = 0;
          resizeConfRef.current.maxLeft = 0;
          resizeConfRef.current.minTop = 0;
          resizeConfRef.current.maxTop = 0;
          // 最小高度边界
          if (newPreviewModalHeight <= minHeight) {
            boxRef.current.style.height = minHeight + 'px';
          }
          // 最大高度边界
          if (newPreviewModalHeight >= maxHeight) {
            boxRef.current.style.height = maxHeight + 'px';
          }
          // 最小宽度边界
          if (newPreviewModalWidth <= minWidth) {
            boxRef.current.style.width = minWidth + 'px';
          }
          // 最大宽度边界
          if (newPreviewModalWidth >= maxWidth) {
            boxRef.current.style.width = maxWidth + 'px';
          }
        }
      },
      default: () => {
        console.log('default handler');
      }
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handlers[state] ? handlers[state]() : handlers['default']();
    props.onChange({
      width: parseInt(boxRef.current.style.width),
      height: parseInt(boxRef.current.style.height),
      left: parseInt(boxRef.current.style.left),
      top: parseInt(boxRef.current.style.top)
    });
  }

  function handleMouseUp(e: any) {
    initResizeConf();
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleDocMouseMove);
    window.addEventListener('mouseup', handleDocMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleDocMouseMove);
      window.removeEventListener('mouseup', handleDocMouseUp);
    };
  }, []);

  function initResizeConf() {
    resizeConfRef.current.state = '';
  }

  return (
    <React.Fragment>
      {Array.isArray(resizeDirections) &&
        resizeDirections.length > 0 &&
        resizeDirections.map((d, i) => {
          return (
            <div
              className={classnames(styles[`resizer-${d}`], styles['resizer'])}
              onMouseDown={e => handleMouseDown(d, e)}
              onMouseUp={handleMouseUp}
              key={i}
            ></div>
          );
        })}
    </React.Fragment>
  );
}
