import _ from 'lodash';
import tempIds from './tempIds.js';

// [claude comment] sends queued changes in the order they were made, swapping temporary ids for the real ones the server assigned to earlier changes - free of IndexedDB/fetch/redux, so sendChanges.test.js can run it against a fake server
// [claude comment] send() rejecting with a TypeError means the server is unreachable - the changes from there on stay queued (ifStopped); any other rejection is the server refusing that one change
const sendChanges = async ({ changes, idMap, send, onSent, onRefused }) => {
  let currentIdMap = idMap;

  for (const change of changes) {
    const body = tempIds.replaceTempIds(change.body, currentIdMap);

    let result;
    try {
      result = await send(change, body);
    } catch (error) {
      if (error instanceof TypeError) {
        return { idMap: currentIdMap, ifStopped: true };
      } else {
        await onRefused(change, { error, body, idMap: currentIdMap });
        continue;
      }
    }

    // [claude comment] where in the server's answer each temporary id's real id is, e.g. 'id' or 'newIdsByOldId.-1791451834731635' (the old id in that path may be temporary too)
    const assignedIds = _.omitBy(
      _.mapValues(change.tempIds ? change.tempIds : {}, (path) =>
        _.get(result, tempIds.replaceTempIdsInString(path, currentIdMap))
      ),
      _.isUndefined
    );
    currentIdMap = { ...currentIdMap, ...assignedIds };

    await onSent(change, { result, body, assignedIds, idMap: currentIdMap });
  }

  return { idMap: currentIdMap, ifStopped: false };
};

export default sendChanges;
