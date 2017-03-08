

// ___how to create and apply entity:


const contentState = editorState.getCurrentContent();
const contentStateWithEntity = contentState.createEntity(
  'LINK',
  'MUTABLE',
  { href: 'http://www.zombo.com' }
);
const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
const contentStateWithLink = Modifier.applyEntity(
  contentState,
  selectionState,
  entityKey
);

// ___how to edit entity:
  // two Entity methods are available to modify entities: mergeData and replaceData. The former allows updating data by passing in an object to merge, while the latter completely swaps in the new data object.




content_blocks contain text ranges

