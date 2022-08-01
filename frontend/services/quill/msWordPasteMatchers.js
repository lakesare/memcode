// See https://github.com/quilljs/quill/issues/1225#issuecomment-1000785590

import Delta from 'quill-delta';

function matchMsWordList(node, delta) {
    // Clone the operations
    let ops = delta.ops.map((op) => Object.assign({}, op));

    // Trim the front of the first op to remove the bullet/number
    let bulletOp = ops.find((op) => op.insert && op.insert.trim().length);
    if (!bulletOp) { return delta }

    bulletOp.insert = bulletOp.insert.trimLeft();
    let listPrefix = bulletOp.insert.match(/^.*?(^·|\.)/) || bulletOp.insert[0];
    bulletOp.insert = bulletOp.insert.substring(listPrefix[0].length, bulletOp.insert.length);

    // Trim the newline off the last op
    let last = ops[ops.length-1];
    last.insert = last.insert.substring(0, last.insert.length - 1);

    // Determine the list type
    let listType = listPrefix[0].length === 1 ? 'bullet' : 'ordered';

    // Determine the list indent
    let style = node.getAttribute('style').replace(/\n+/g, '');
    let levelMatch = style.match(/level(\d+)/);
    let indent = levelMatch ? levelMatch[1] - 1 : 0;

    // Add the list attribute
    ops.push({insert: '\n', attributes: {list: listType, indent}})

    return new Delta(ops);
}

function maybeMatchMsWordList(node, delta) {
    if (delta.ops[0].insert.trimLeft()[0] === '·') {
        return matchMsWordList(node, delta);
    }

    return delta;
}

const msWordPasteMatchers = [
    ['p.MsoListParagraphCxSpFirst', matchMsWordList],
    ['p.MsoListParagraphCxSpMiddle', matchMsWordList],
    ['p.MsoListParagraphCxSpLast', matchMsWordList],
    ['p.MsoListParagraph', matchMsWordList],
    ['p.msolistparagraph', matchMsWordList],
    ['p.MsoNormal', maybeMatchMsWordList]
];

export default msWordPasteMatchers;
