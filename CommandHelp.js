export class CommandHelp {
  constructor() {
    this.list = [];
  }
  addDoc(command, help) {
    this.list.push({ command: command, help: help });
  }
  show() {
    console.log("Command help:");
    for (let doc of this.list) console.log(`${doc.command}: ${doc.help}`);
    console.log();
  }
}
