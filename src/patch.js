import { render, setAttr, Element } from "./element"

// 打补丁
let allPatches
let index = 0   // 默认第0个打补丁，深度遍历的序号
// node是个真实的DOM
function patch(node, patches) {
    allPatches = patches
    // 先序深度优先遍历node
    // 看第几个有补丁包，有则打上
    walk(node)
}

function walk(node) {
    let currentPatch = allPatches[index++]
    let childNodes = node.childNodes
    childNodes.forEach(child => walk(child));
    // 有补丁
    if(currentPatch) {
        // 打补丁(后序)
        doPatch(node, currentPatch)
    }
}

// 打补丁
function doPatch(node, patches) {
    patches.forEach(patch => {
        switch(patch.type) {
            case 'ATTRS':
                for(let key in patch.attrs) {
                    let value = patch.attrs[key]
                    if (value) {
                        setAttr(node, key, value)
                    } else {
                        // 因为新DOM可能把该属性去掉了
                        node.removeAttribute(key)
                    }
                }
                break;
            case 'TEXT':
                node.textContent = patch.text
                break;
            case 'REMOVE':
                node.parentNode.removeChild(node)
                break;
            case 'REPLACE':
                let newNode = (patch.newVDOM instanceof Element) ? render(patch.newVDOM) : document.createTextNode(patch.newVDOM)
                node.parentNode.replaceChild(newNode, node)
                break;
            default:break;

        }
    })
}

export default patch
