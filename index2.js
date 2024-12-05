import { Node } from "./Node.js";
import { NodeList} from "./NodeList.js";

let nodes = new NodeList([new Node(0, "root", null, null, null, null)]);

// console.log((nodes.newChild(0)).list)
nodes
  .newChild(0)
  .newChild(0)
  .newChild(2)
  .newChild(1)
  .newChild(4)
  .newChild(5)
  .newChild(6)
  .moveBefore(2, 1)
  .moveBefore(4, 3)
  .newChild(2)
  .newChild(2)
  .newChild(7)
  .newChild(7)
  .moveBefore(10, 9)
  .moveAfter(10, 9)
  .moveAfter(5, 9)
  .moveAfter(2, 1)
  .swap(1, 2)
  .swap(3, 8)
  .swap(7, 4)
  .swap(7, 0)
  .prependChild(0, 2)
  .prependChild(0, 4)
  .prependChild(3, 5)
  .show();
