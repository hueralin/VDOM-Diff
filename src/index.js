import { createElement, render, renderDOM } from './element'
import diff from './diff'
import patch from './patch'

let vdom = createElement('ul', { class: 'vdom color'}, [
    createElement('li', null, ['B']),
    createElement('li', null, ['C']),
    createElement('li', null, ['D'])
])

let vdom2 = createElement('ul', { class: 'vdom'}, [
    createElement('li', null, ['B']),
    createElement('li', null, ['E']),
    createElement('div', null, ['D'])
])

// 如果平级元素有互换，回导致重新渲染
// 新增节点也不会被更新，因为遍历的是旧VDOM

// 生成补丁对象
let patches = diff(vdom, vdom2)
console.log(patches)

// 将虚拟DOM转化为真是DOM
let dom = render(vdom)

// 给真实DOM打补丁，重新更新视图
patch(dom, patches)

// 将DOM插入到页面指定元素内
renderDOM(dom, document.getElementById('root'))
// console.log(vdom)
// console.log(dom)
