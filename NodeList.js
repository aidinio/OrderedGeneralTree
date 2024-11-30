import { Node } from "./Node.js";

export class NodeList {
  constructor(list = []) {
    this.list = list;
    this.nextIndex = list.length;
  }
  addNode(node) {
    this.list[this.nextIndex++] = node;
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
    const parent = this.list[parId];
    if (parent.type == "bunk") return;
    const node = new Node(
      this.nextIndex,
      parent.getChildType(),
      parId,
      parent.firstChild,
      null,
      null
    );
    this.addNode(node);
    if (parent.firstChild) this.list[parent.firstChild].prevSib = node.index;
    parent.firstChild = node.index;
  }
  moveBefore(sibId, nodeId) {
    if (!this.canMove(sibId, nodeId)) return;
    const sib = this.list[sibId];
    const node = this.list[nodeId];
    if (node.prevSib) this.list[node.prevSib].nextSib = node.nextSib;
    if (node.nextSib) this.list[node.nextSib].prevSib = node.prevSib;
    if (sib.prevSib) this.list[sib.prevSib].nextSib = nodeId;
    if (this.list[node.parent]?.firstChild == nodeId)
      this.list[node.parent].firstChild = node.nextSib;
    if (this.list[sib.parent]?.firstChild == sibId)
      this.list[sib.parent].firstChild = nodeId;
    node.nextSib = sibId;
    node.prevSib = sib.prevSib;
    sib.prevSib = nodeId;
    node.parent = sib.parent;
  }
  moveAfter(sibId, nodeId) {
    if (!this.canMove(sibId, nodeId)) return;
    const sib = this.list[sibId];
    const node = this.list[nodeId];
    if (node.prevSib) this.list[node.prevSib].nextSib = node.nextSib;
    if (node.nextSib) this.list[node.nextSib].prevSib = node.prevSib;
    if (sib.nextSib) this.list[sib.nextSib].prevSib = nodeId;
    if (this.list[node.parent]?.firstChild == nodeId)
      this.list[node.parent].firstChild = node.nextSib;
    node.nextSib = sib.nextSib;
    node.prevSib = sibId;
    sib.nextSib = nodeId;
    node.parent = sib.parent;
  }
  swap(uId, vId) {
    if (!this.canMove(uId, vId)) return;
    const [u, v] = [this.list[uId], this.list[vId]];
    if (u.nextSib == vId) {
      this.moveBefore(uId, vId);
      return;
    }
    if (v.nextSib == uId) {
      this.moveBefore(vId, uId);
      return;
    }
    if (u.nextSib) this.list[u.nextSib].prevSib = vId;
    if (v.nextSib) this.list[v.nextSib].prevSib = uId;
    if (u.prevSib) this.list[u.prevSib].nextSib = vId;
    else this.list[u.parent].firstChild = vId; // prevSib is null, so u is firstChild
    if (v.prevSib) this.list[v.prevSib].nextSib = uId;
    else this.list[v.parent].firstChild = uId; // prevSib is null, so v is firstChild
    [u.nextSib, v.nextSib] = [v.nextSib, u.nextSib];
    [u.prevSib, v.prevSib] = [v.prevSib, u.prevSib];
    [u.parent, v.parent] = [v.parent, u.parent];
  }
  prependChild(parId, nodeId) {
    const [parent, node] = [this.list[parId], this.list[nodeId]];
    if (
      parId >= this.nextIndex ||
      nodeId >= this.nextIndex ||
      parent.getLevel() != node.getLevel() - 1
    )
      return;
    if (parent.firstChild) this.moveBefore(parent.firstChild, nodeId);
    else {
      if (node.nextSib) this.list[node.nextSib].prevSib = node.prevSib;
      if (node.prevSib) this.list[node.prevSib].nextSib = node.nextSib;
      if (this.list[node.parent].firstChild == nodeId)
        this.list[node.parent].firstChild = node.nextSib;
      node.prevSib = null;
      node.nextSib = null;
      node.parent = parId;
      parent.firstChild = nodeId;
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
