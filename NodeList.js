import { Node } from "./Node.js";

export function deepCopyWithMethods(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj; // Return the value if obj is not an object
  }

  // Create a new object with the same prototype as the original
  const copy = Object.create(Object.getPrototypeOf(obj));

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Recursively copy properties
      copy[key] = deepCopyWithMethods(obj[key]);
    }
  }
  return copy;
}

export class NodeList {
  constructor(list = []) {
    this.list = list;
    this.nextIndex = list.length;
  }
  addNode(node) {
    const tmpList = new NodeList(
      this.list.map((node) => deepCopyWithMethods(node))
    );
    tmpList.list[tmpList.nextIndex++] = node;
    return tmpList;
  }
  canMove(sibId, nodeId) {
    const sib = this.list[sibId];
    const node = this.list[nodeId];
    return (
      sibId != nodeId &&
      sibId < this.nextIndex &&
      nodeId < this.nextIndex &&
      sib.type == node.type
    );
  }
  newChild(parId) {
    // console.log("'''")
    // console.log(this.list.map(node => deepCopyWithMethods(node)))
    let tmpList = new NodeList(
      this.list.map((node) => deepCopyWithMethods(node))
    );
    const parent = tmpList.list[parId];
    if (!parent) return tmpList;
    if (parent.type == "customer") return tmpList;
    if (parent.type == "bunk" && parent.firstChild) return tmpList;
    const node = new Node(
      tmpList.nextIndex,
      parent.getChildType(),
      parId,
      parent.firstChild,
      null,
      null
    );
    tmpList = tmpList.addNode(node);
    if (parent.firstChild) tmpList.list[parent.firstChild].prevSib = node.index;
    parent.firstChild = node.index;
    // console.log('[*]', tmpList.list)
    tmpList.list[parId] = parent;
    return tmpList;
  }
  moveBefore(sibId, nodeId) {
    let tmpList = new NodeList(
      this.list.map((node) => deepCopyWithMethods(node))
    );
    if (!tmpList.canMove(sibId, nodeId)) return tmpList;
    const sib = tmpList.list[sibId];
    const node = tmpList.list[nodeId];
    if (node.prevSib) tmpList.list[node.prevSib].nextSib = node.nextSib;
    if (node.nextSib) tmpList.list[node.nextSib].prevSib = node.prevSib;
    if (sib.prevSib) tmpList.list[sib.prevSib].nextSib = nodeId;
    if (tmpList.list[node.parent]?.firstChild == nodeId)
      tmpList.list[node.parent].firstChild = node.nextSib;
    if (tmpList.list[sib.parent]?.firstChild == sibId)
      tmpList.list[sib.parent].firstChild = nodeId;
    node.nextSib = sibId;
    node.prevSib = sib.prevSib;
    sib.prevSib = nodeId;
    node.parent = sib.parent;
    return tmpList;
  }
  moveAfter(sibId, nodeId) {
    let tmpList = new NodeList(
      this.list.map((node) => deepCopyWithMethods(node))
    );
    if (!tmpList.canMove(sibId, nodeId)) return tmpList;
    const sib = tmpList.list[sibId];
    const node = tmpList.list[nodeId];
    if (node.prevSib) tmpList.list[node.prevSib].nextSib = node.nextSib;
    if (node.nextSib) tmpList.list[node.nextSib].prevSib = node.prevSib;
    if (sib.nextSib) tmpList.list[sib.nextSib].prevSib = nodeId;
    if (tmpList.list[node.parent]?.firstChild == nodeId)
      tmpList.list[node.parent].firstChild = node.nextSib;
    node.nextSib = sib.nextSib;
    node.prevSib = sibId;
    sib.nextSib = nodeId;
    node.parent = sib.parent;
    return tmpList;
  }
  swap(uId, vId) {
    let tmpList = new NodeList(
      this.list.map((node) => deepCopyWithMethods(node))
    );
    if (!tmpList.canMove(uId, vId)) return tmpList;
    const [u, v] = [tmpList.list[uId], tmpList.list[vId]];
    if (u.nextSib == vId) {
      return tmpList.moveBefore(uId, vId);
      // return tmpList;
    }
    if (v.nextSib == uId) {
      return tmpList.moveBefore(vId, uId);
      // return tmpList;
    }
    if (u.nextSib) tmpList.list[u.nextSib].prevSib = vId;
    if (v.nextSib) tmpList.list[v.nextSib].prevSib = uId;
    if (u.prevSib) tmpList.list[u.prevSib].nextSib = vId;
    else tmpList.list[u.parent].firstChild = vId; // prevSib is null, so u is firstChild
    if (v.prevSib) tmpList.list[v.prevSib].nextSib = uId;
    else tmpList.list[v.parent].firstChild = uId; // prevSib is null, so v is firstChild
    [u.nextSib, v.nextSib] = [v.nextSib, u.nextSib];
    [u.prevSib, v.prevSib] = [v.prevSib, u.prevSib];
    [u.parent, v.parent] = [v.parent, u.parent];
    return tmpList;
  }
  prependChild(parId, nodeId) {
    let tmpList = new NodeList(
      this.list.map((node) => deepCopyWithMethods(node))
    );
    const [parent, node] = [tmpList.list[parId], tmpList.list[nodeId]];
    if (
      parId >= tmpList.nextIndex ||
      nodeId >= tmpList.nextIndex ||
      parent.getLevel() != node.getLevel() - 1
    )
      return tmpList;
    if (parent.firstChild) return tmpList.moveBefore(parent.firstChild, nodeId);
    else {
      if (node.nextSib) tmpList.list[node.nextSib].prevSib = node.prevSib;
      if (node.prevSib) tmpList.list[node.prevSib].nextSib = node.nextSib;
      if (tmpList.list[node.parent].firstChild == nodeId)
      tmpList.list[node.parent].firstChild = node.nextSib;
      node.prevSib = null;
      node.nextSib = null;
      node.parent = parId;
      parent.firstChild = nodeId;
      return tmpList
    }
  }
  show() {
    // console.log("root");
    if (!this.nextIndex) return;
    const stack = [];
    for (let i = 0; i < this.nextIndex; i++) {
      if (this.list[i].type == "root") {
        stack.push(i);
        // break;
      }
    }
    while (stack.length) {
      let top = this.list[stack.pop()];
      if (top.type == "root") {
        top.firstChild && stack.push(top.firstChild);
        console.log("root", top.index);
        continue;
      } else if (!stack.length && !top.nextSib && !top.firstChild) {
        if (top.getLevel() == 1) console.log(`└── ${top.type} ${top.index}`);
        else
          console.log(
            `└${" ".repeat(top.getLevel() * 3 - 1)}└── ${top.type} ${top.index}`
          );
      } else if (top.nextSib) {
        if (top.getLevel() == 1) console.log(`├── ${top.type} ${top.index}`);
        else
          console.log(
            `│${" ".repeat(top.getLevel() * 3 - 1)}├── ${top.type} ${top.index}`
          );
        stack.push(top.nextSib);
      } else {
        if (top.getLevel() == 1) console.log(`└── ${top.type} ${top.index}`);
        else
          console.log(
            `│${" ".repeat(top.getLevel() * 3 - 1)}└── ${top.type} ${top.index}`
          );
      }
      if (top.firstChild) {
        stack.push(top.firstChild);
      }
    }
  }
}
