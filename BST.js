class Node {
  constructor(val) {
    this.value = val;
    this.leftChild = null;
    this.rightChild = null;
  }
}

function Tree(arr) {
  const strippedArr = [...new Set(arr)];
  strippedArr.sort();
  let root = buildTree(strippedArr, 0, strippedArr.length - 1);

  function buildTree(array, start, end) {
    if (start > end) return null;

    let mid = Math.floor((end + start) / 2); // This gives you the LENGTH/2, not the INDEX

    let root = new Node(array[mid]);

    root.leftChild = buildTree(array, start, mid - 1);
    root.rightChild = buildTree(array, mid + 1, end);

    return root;
  }

  function insert(value) {
    root = insertRec(root, value);
  }

  function insertRec(node, value) {
    if (node === null) return new Node(value);
    if (value === node.value) return node;
    if (value < node.value) {
      node.leftChild = insertRec(node.leftChild, value);
    } else {
      node.rightChild = insertRec(node.rightChild, value);
    }
    return node;
  }

  function getSuccessor(curr) {
    curr = curr.rightChild;
    while (curr && curr.leftChild) {
      curr = curr.leftChild;
    }
    return curr;
  }

  function deleteItem(value) {
    root = deleteRec(root, value);
  }

  function deleteRec(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.leftChild = deleteRec(node.leftChild, value);
    } else if (value > node.value) {
      node.rightChild = deleteRec(node.rightChild, value);
    } else {
      if (!node.leftChild && !node.rightChild) return null;

      if (!node.leftChild) return node.rightChild;
      if (!node.rightChild) return node.leftChild;

      let successor = getSuccessor(node.rightChild);
      node.value = successor.value;
      node.rightChild = deleteRec(node.rightChild, successor.value);
    }
    return node;
  }

  function levelOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!root) return;

    const queue = [root];

    while (queue.length > 0) {
      const node = queue.shift();
      callback(node);

      if (node.leftChild) queue.push(node.leftChild);
      if (node.rightChild) queue.push(node.rightChild);
    }
  }

  function inOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!root) return;
    function traverse(node) {
        if (!node) return;
        traverse(node.leftChild)
        callback(node)
        traverse(node.rightChild)
    }
    traverse(root)
  }
  function preOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!root) return;
        function traverse(node) {
        if (!node) return;
        callback(node)
        traverse(node.leftChild)
        traverse(node.rightChild)
    }
    traverse(root)
  }
  function postOrderForEach(callback) {
    if (typeof callback !== "function") {
      throw new Error("A callback function is required");
    }
    if (!root) return;
        function traverse(node) {
        if (!node) return;
        traverse(node.leftChild)
        traverse(node.rightChild)
        callback(node)
    }
    traverse(root)
  }

  function height(value) {
    if (!root) return null;
    
    // First, find the node with the given value
    function findNode(node, target) {
      if (!node) return null;
      if (node.value === target) return node;
      if (target < node.value) return findNode(node.leftChild, target);
      return findNode(node.rightChild, target);
    }
    
    // Then calculate height from that node
    function calculateHeight(node) {
      if (!node) return -1; // Base case: null node has height -1
      
      const leftHeight = calculateHeight(node.leftChild);
      const rightHeight = calculateHeight(node.rightChild);
      
      return Math.max(leftHeight, rightHeight) + 1;
    }
    
    const targetNode = findNode(root, value);
    if (!targetNode) return null; // Value not found
    
    return calculateHeight(targetNode);
  }

  function depth(value) {
    if (!root) return null;
    
    function findDepth(node, target, currentDepth = 0) {
      if (!node) return null; // Value not found
      if (node.value === target) return currentDepth;
      
      if (target < node.value) {
        return findDepth(node.leftChild, target, currentDepth + 1);
      } else {
        return findDepth(node.rightChild, target, currentDepth + 1);
      }
    }
    
    return findDepth(root, value);
  }

  function isBalanced() {
    if (!root) return true; // Empty tree is balanced
    
    function checkBalance(node) {
      if (!node) return { balanced: true, height: -1 };
      
      const left = checkBalance(node.leftChild);
      const right = checkBalance(node.rightChild);
      
      // If either subtree is unbalanced, this tree is unbalanced
      if (!left.balanced || !right.balanced) {
        return { balanced: false, height: -1 };
      }
      
      // Check if height difference is more than 1
      const heightDiff = Math.abs(left.height - right.height);
      const balanced = heightDiff <= 1;
      const height = Math.max(left.height, right.height) + 1;
      
      return { balanced, height };
    }
    
    return checkBalance(root).balanced;
  }

  function rebalance() {
    if (!root) return;
    
    // Step 1: Collect all values using in-order traversal (gives sorted array)
    const values = [];
    inOrderForEach(node => values.push(node.value));
    
    // Step 2: Rebuild the tree with the sorted array
    root = buildTree(values, 0, values.length - 1);
  }

  return {
    root,
    buildTree,
    prettyPrint,
    insert,
    deleteItem,
    levelOrderForEach,
    inOrderForEach,
    preOrderForEach,
    postOrderForEach,
    height,
    depth,
    isBalanced,
    rebalance
  };
}

//

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.rightChild !== null) {
    prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.leftChild !== null) {
    prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// const arr = [1, 2, 3, 4, 5, 6, 7];

// const cT = Tree(arr);

// cT.insert(9);
// cT.deleteItem(5);
// cT.insert(10)
// cT.deleteItem(7)
// prettyPrint(cT.root);
// console.log(cT.isBalanced())