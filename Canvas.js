export class Canvas {
    constructor(funcList) {
      this.funcList = funcList;
      this.tail = "";
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