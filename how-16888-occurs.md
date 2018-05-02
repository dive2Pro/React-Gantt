
> issues 已提 (https://github.com/facebook/react/issues/12688), 我很好奇为什么这两个结合之后会发生这种事情. 来一个个分析吧

# React.forwardRef


```js
    // Tell React I want to be able to put a ref on LikeButton.
const LikeButton = React.forwardRef((props, ref) => (
  <div className="LikeButton">
    {/* Forward LikeButton's ref to the button inside. */}
    <button ref={ref} onClick={props.onClick}>
      Like
    </button>
  </div>
));

// I can put a ref on it as if it was a DOM node or a class!
// (In this example, the ref points directly to the DOM node.)
<LikeButton ref={myRef} />;

```

> 在 回调中可以拿到 `ref` 属性, 即使是深层次 的 Component 也可以通过它来更准确的回调组件


这是 `foreardRef`, 只有两个属性, 一个定义了 type , 一个是 render 的方式

```js
 
 export default function forwardRef<Props, ElementType: React$ElementType>(
   render: (props: Props, ref: React$ElementRef<ElementType>) => React$Node,
 ) {

   return {
     $$typeof: REACT_FORWARD_REF_TYPE,
     render,
   };
 }
 ```

 在 React 开始更新的时候:


 ```js

   case ForwardRef:
        return updateForwardRef(current, workInProgress);

 ```

下面是更新时的策略

 ```js

  function updateForwardRef(current, workInProgress) {
     const render = workInProgress.type.render;
     const nextChildren = render(
       workInProgress.pendingProps,
       workInProgress.ref,
     );
     reconcileChildren(current, workInProgress, nextChildren);
     memoizeProps(workInProgress, nextChildren);
     return workInProgress.child;
   }
 ```

 只要有更新, `render` 方法就会被调用, `ref` 作为参数传出. 一切看起来都没有问题,父组件有更新, 这里就会 `rerender`, 但是 在出现问题的情况中, `parent` 并没有更新 看来可能是新的 `context` 中的问题.还需要看看 `React.createContext`的工作机制

## React.createContext

返回后的结果,  `Provider` 和 `Consumer` 只是两个不同的 `Fiber` 类型, Provider 会记录 `_context` 也就是 `Consumer`. 它保持唯一的一个 `_changedBits` ,  `Provider`中接受到的 `value` 发生改变则改变 '_changedBits'
 ```js

  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    _defaultValue: defaultValue,
    _currentValue: defaultValue,
    _changedBits: 0,
    // These are circular
    Provider: (null: any),
    Consumer: (null: any),
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };
  context.Consumer = context;

 ```
 
## 更新 `<Provider value={value}>{...}</Provider>`

 ``` js
  updateContextProvider(
    current,
    workInProgress,
    renderExpirationTime,
  ) {
    
    const newProps = workInProgress.pendingProps;
    const oldProps = workInProgress.memoizedProps;
 
       if (hasLegacyContextChanged()) {
         // Normally we can bail out on props equality but if context has changed
         // we don't do the bailout and we have to reuse existing props instead.
       } 
       // 这里的比较方式, 说明只要是同一个 对象就不会更新, 

       // 类似 <Provider value={// 指向一个不在 render 方法中的对象}> ... </> 不会更新
       else if (oldProps === newProps) {
         workInProgress.stateNode = 0; // 置空, 下一轮不需要更新 `Consumer`
         pushProvider(workInProgress); 
         return bailoutOnAlreadyFinishedWork(current, workInProgress);
       }

    ... 经过一系列的操作, 检查是否需要更新Context
    
    if (changedBits !== 0) {
    // propagateContextChange 会做一个 `DFS` 遍历 更新 'timeslice' , 直到遇到每一条子孙系上的 `Consumer`, 接着的更新就再交由 `Consumer` 
      propagateContextChange(
               workInProgress,
               context,
               changedBits,
               renderExpirationTime,
             );
    }
    ...
    workInProgress.stateNode = changedBits; //改变标记位的值
    // 将 这个 fiber 入栈 
    pushProvider(workInProgress)
    // reconcileChildren 
    return workInprocess.child // 返回子组件  此时 workingInProgress 的 beginWork 结束, child 开始自己的 beginWork, 从而一直反应到 ContextConsumer
    
  }
```

## 更新 `<Consumer>{() => {}} </Consumer> `

> **所有的 Some.Consumer 共享同一个对象**

``` js

  function updateContextConsumer(
    current,
    workInProgress,
    renderExpirationTime,
  ) {
    const context: ReactContext<any> = workInProgress.type;
    const newProps = workInProgress.pendingProps;
    const oldProps = workInProgress.memoizedProps;

    // 获取值
    const newValue = context._currentValue;
    // 标记位, 不为 0 就 render()
    const changedBits = context._changedBits;
    ... 判断 如果 props 改变 或者 changeBits 不为 0 就更新
    
    if (changedBits === 0 && oldProps === newProps) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    const render = newProps.children;
    // 只接受的值是 `function`
    const newChildren = render(newValue);
    reconcileChildren(current, workInProgress, newChildren);
    return workInProgress.child;
}

```    

```js
propagateContextChange() {
  DFS() {
  case ContextConsumer:
        // 使用 位操作 检查是否 匹配
        if (fiber.type === context && (observedBits & changedBits) !== 0) {
          // 匹配的 更新祖先节点的 expiration 时间
          // Update the expiration time of all the ancestors, including
          // the alternates.
        }

        break;

    // 碰到 ContextProvider 也不再继续遍历 , 转交更新权
  case ContextProvider:
            // Don't scan deeper if this is a matching provider
             nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
             break;
  }
}

```


```js

export function pushProvider(providerFiber: Fiber): void {
   index = 1;
   stack[index] = providerFiber;
   const context: ReactContext<any> = providerFiber.type.context;
   context.currentValue = providerFiber.pendingProps.value;
   context.changedBits = providerFiber.stateNode;  // 改变 `_context._changedBits`的值
}

```


  现在我明白了, 我提的`issues` 应该是 `React.forwardRef`

## 总结
  
  现在我明白了, 我提的`issues` , 引发的问题 应该不是`React.createContext`的问题, 而是 `React.forwardRef` 中的问题, 在其的 子孙控件中`setState`, 会导致 `callback` 被触发.
  所以: **[为什么子孙控件会导致 forwardRef() 触发 callback? 🤔🤔](#why-is-occur?)**
  
## 感慨

  通过阅读这一部分代码, 加深了对`react`的理解, 
  原来并不是 简单的 `shouldComponentUpdate = false` 就阻止了子组件更新, 而是 没有传递新的 `props` 给子组件, 减少了更新的过程.
  新的 `createContext`  **不是** Component, 和 `Fragment` 一样,  它是一种更新模式.
  我觉得很有趣的一点是 它保存数据和更新数据的方式,
  `Provider` 和 所有的`Comsumer` 共享的是同一个对象, 所有的属性的改变是"全局"的, 结合 `React` 的更新策略, 牵一发而动全身.   
  不得不佩服`React`组员的代码水平, 还是得学习一个.

# Why is Occur? 

## React 的 Component `setState`后更新策略是 

```js
  // 位于 : ReactFiberClassComponent : 167
  enqueueSetState(inst, payload, callback) {
      const fiber = ReactInstanceMap.get(inst);
      const expirationTime = computeExpirationForFiber(fiber);

      const update = createUpdate(expirationTime);
      update.payload = payload;
      if (callback !== undefined && callback !== null) {
        if (__DEV__) {
          warnOnInvalidCallback(callback, 'setState');
        }
        update.callback = callback;
      }

      // 目前不关注, 这个是和 fiber 的架构有关
      enqueueUpdate(fiber, update, expirationTime);
      // 组件开始更新
      scheduleWork(fiber, expirationTime);
    }
```

**scheduleWork**
```js
  // 位于 ReactFiberScheduler 1200
   
   while (node !== null) {
      // 更新时 会遍历这一条父组件, 更新沿途组件的 `expiration` 
      ...
       
      if (node.return === null) {
        // 如果到达 HostRoot, 开始自顶向下更新 
        if (node.tag === HostRoot) {
          ...

          if (
            // If we're in the render phase, we don't need to schedule this root
            // for an update, because we'll do it before we exit...
            !isWorking ||
            isCommitting ||
            // ...unless this is a different root than the one we're rendering.
            nextRoot !== root
          ) {
            // Add this root to the root schedule.
            requestWork(root, expirationTime);
          }
         
        }
      }
      node = node.return;
    }

```

**requestWork** -> **performWorkOnRoot**

```js
  // 位于 `ReactSchedule` 1623
   
   ...
   if (!isAsync) {
      // Flush sync work.
      // 每一次 `completeRoot` 之后 , `root.finishedWork` 都会被置空
      let finishedWork = root.finishedWork
      if (finishedWork !== null) {
        // This root is already complete. We can commit it.
        completeRoot(root, finishedWork, expirationTime);
      } else {
        root.finishedWork = null;
        // 开始 render 一次 Root
        finishedWork = renderRoot(root, expirationTime, false);
        if (finishedWork !== null) {
          // We've completed the root. Commit it.
          completeRoot(root, finishedWork, expirationTime);
        }
      }
   }

  ...

```

** renderRoot **  -> **workLoop** -> **performUnitOfWork** -> **beginWork** 
这里就开始进行 这一支组件的更新. 每个子组件又会对自己这一支进行更新. 但由于 没有 `state` 或者 `props` 的改变, React 并不会对组件进行更新.

**但是**, 如果是`forwardRef`, 它的更新策略是这样的:

```js
function updateForwardRef(current, workInProgress) {
    const render = workInProgress.type.render;
    // 在这里, 它的回调会被调用, 所以这就造成了一轮 `props` 的传递
    const nextChildren = render(
      workInProgress.pendingProps,
      workInProgress.ref,
    );
    reconcileChildren(current, workInProgress, nextChildren);
    memoizeProps(workInProgress, nextChildren);
    return workInProgress.child;
}
``` 

[fix之后](https://github.com/facebook/react/pull/12690/files?utf8=%E2%9C%93&diff=split&w=1) 

```js
function updateForwardRef(current, workInProgress) {
    const render = workInProgress.type.render;
    const nextProps = workInProgress.pendingProps;
     const ref = workInProgress.ref;
     if (hasLegacyContextChanged()) {
       // Normally we can bail out on props equality but if context has changed
       // we don't do the bailout and we have to reuse existing props instead.
     } else if (workInProgress.memoizedProps === nextProps) {
       const currentRef = current !== null ? current.ref : null;
       if (ref === currentRef) {
         return bailoutOnAlreadyFinishedWork(current, workInProgress);
       }
     }
     const nextChildren = render(nextProps, ref);
      reconcileChildren(current, workInProgress, nextChildren);
     memoizeProps(workInProgress, nextProps);
}
```