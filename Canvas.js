export class Canvas {
  constructor(funcList) {
    this.funcList = funcList;
    this.tail = "";
  }
  updateFuncList(funcList) {
    this.funcList = funcList
  }
  append(s) {
    this.tail += s;
  }
  show() {
    let head = "";
    for (let func of this.funcList) {
      if (!func()) continue;
      head += func();
      head += "\n";
    }
    console.log(head + this.tail);
  }
}
