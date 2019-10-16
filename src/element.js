
// 虚拟DOM类
class Element {
    constructor(type, props, children) {
        this.type = type
        this.props = props
        this.children = children
    }
}

// 创建虚拟DOM
let createElement = (type, props, children) => {
    return new Element(type, props, children)
}

// 设置属性的方法
let setAttr = (node, key, value) => {
    switch(key) {
        case 'value':
            // 若是表单元素
            if (node.tagName.toUpperCase() === 'INPUT' || node.tagName.toUpperCase() === 'TEXTAREA') {
                node[key] = value
            } else {
                node.setAttribute(key, value)
            };break;
        case 'style':
            node.style.cssText = value;break;
        default:
            node.setAttribute(key, value)
    }
}

let render = (vdom) => {
    let el = document.createElement(vdom.type)
    // for in 用来遍历对象的实例属性和原型属性
    for (let key in vdom.props) {
        // 设置属性的方法，因为属性千奇百怪，而且重新渲染时还要修改，所以提出一个方法
        setAttr(el, key, vdom.props[key])
    }
    // 递归子元素
    vdom.children.forEach(child => {
        // 如果child是个Element元素则render
        // 若是个基本数据类型，string，number, boolean... 则直接创建文本节点
        child = (child instanceof Element) ? render(child) : document.createTextNode(child)
        // 插入到父元素
        el.appendChild(child)
    })
    return el
}

// 将DOM插入到页面的方法
let renderDOM = (dom, target) => {
    target.appendChild(dom)
}

export {
    createElement,
    render,
    renderDOM,
    Element,
    setAttr
}
