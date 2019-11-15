class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.first = null;
    this.last = null;
  }

  enqueue(value) {
    const node = new _Node(value);
    if (this.first === null) {
      this.first = node;
    }

    if (this.last) {
      this.last.next = node;
    }

    this.last = node;
  }

  dequeue() {
    if (this.first === null) {
      return;
    }
    const node = this.first;
    this.first = this.first.next;

    if (node === this.last) {
      this.last = null;
    }
    return node.value;
  }
}

function peek(queue) {
  let first = queue.first;
  return first;
}

function isEmpty(queue) {
  let first = queue.first;
  if (first === null) {
    return true;
  }
  return false;
}

function display(queue) {
  let displayQueue = queue;
  console.log(JSON.stringify(displayQueue));
}

module.exports = {
  Queue,
  _Node,
  display,
  isEmpty,
  peek,
};
