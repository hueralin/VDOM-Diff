
// 比较两棵树的属性
function diffAttr(oldAttr, newAttr) {
    let patch = {}
    // 判断旧属性和新属性的关系
    for(let key in oldAttr) {
        // 属性还在，看看是否相同
        // 属性在新的里面已经删除，newProps[key]即为undefined，也适用
        if(oldAttr[key] !== newAttr[key]) {
            patch[key] = newAttr[key]
        }
    }
    // 新VDOM可能增加了一些属性
    for(let key in newAttr) {
        // if(!oldAttr[key]) {
        if(!oldAttr.hasOwnProperty(key)) {
            patch[key] = newAttr[key]
        }
    }
    return patch
}

// 比较儿子节点
function diffChildren(oldChildren, newChildren, patches) {
    oldChildren.forEach((child, idx) => {
        walk(child, newChildren[idx], ++INDEX, patches)
    });
}

const ATTRS = 'ATTRS'
const TEXT = 'TEXT'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'

// 全局维护一个Index，代表先序深度遍历的顺序
let INDEX = 0

// 判断节点是否为字符串
function isString(node) {
    return Object.prototype.toString.call(node) === '[object String]'
}

// 遍历VDOM，返回补丁包
function walk(oldVDOM, newVDOM, index, patches) {
    // 每个元素都有一个补丁对象
    // 当前所做的补丁包（临时的补丁包）
    let currentPatch = []
    // 如果新VDOM删除了某个元素
    if (!newVDOM) {
        currentPatch.push({ type: REMOVE, index })
    }
    // 判断是否为文本节点
    else if (isString(oldVDOM) && isString(newVDOM)) {
        // 判断文本是否变化（即节点内容是否发生变化）
        if(oldVDOM !== newVDOM) {
            currentPatch.push({ type: TEXT, text: newVDOM })
        }
    }
    // 第一步！查看节点类型是否变化（即是否是同一个DOM元素）
    // 是同一个就比较属性
    else if (oldVDOM.type === newVDOM.type) {
        // 比较属性是否有更改
        let attrs = diffAttr(oldVDOM.props, newVDOM.props)
        // Object.keys()返回一个由对象的实例属性名构成的数组
        if(Object.keys(attrs).length > 0) {
            // 说明补丁对象里有东西，将属性的补丁包放进当前的补丁包
            currentPatch.push({ type: ATTRS, attrs })
        }
        if (oldVDOM.children && newVDOM.children) {
            // 递归，如果有儿子节点，就比儿子
            diffChildren(oldVDOM.children, newVDOM.children, patches)
        }
    } else {
        // 说明节点被替换了(标签类型都不一样，用新VDOM去替换)
        currentPatch.push({ type: REPLACE, newVDOM })
    }
    // 第二步！
    if (currentPatch.length > 0) {
        // 当临时的补丁包里有东西，才将临时补丁包放进大补丁包
        patches[index] = currentPatch
    }
}

function diff(oldVDOM, newVDOM) {
    /**
     * 补丁包
     * {
     *  0: [xxx],   第0个改了哪些
     *  1: [xxx],   第1个改了哪些   个，指的是先序深度遍历的顺序
     *  ...
     * }
     */
    let patches = {}
    // 层级
    let index = 0
    // 先序深度遍历(递归) 将比较后的结果放到补丁包中
    walk(oldVDOM, newVDOM, index, patches)
    return patches 
}

export default diff
