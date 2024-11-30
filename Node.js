export class Node {
  constructor(index, type, parent, nextSib, prevSib, firstChild) {
    this.index = index;
    this.type = type;
    this.parent = parent;
    this.nextSib = nextSib;
    this.prevSib = prevSib;
    this.firstChild = firstChild;
  }
  getLevel() {
    switch (this.type) {
      case "root":
        return 0;
      case "room":
        return 1;
      case "bed":
        return 2;
      case "bunk":
        return 3;
      case "customer":
        return 4;
    }
  }
  getChildType() {
    switch (this.type) {
      case "root":
        return "room";
      case "room":
        return "bed";
      case "bed":
        return "bunk";
      case "bunk":
        return "customer";
      case "customer":
        return null;
    }
  }
}
