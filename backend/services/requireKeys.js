// const b = requireKeys(
//   ['userId', 'title'], // what to validate
//   (args) => {
//     console.log('creating a comment with title=' + args.title);
//   }
// )

// b({ userId: 'wow' })
const requireKeys = (requiredKeys, functionBeingValidated) =>
  (realArgs) => {
    requiredKeys.forEach((key) => {
      if (realArgs[key] === undefined) {
        throw new Error(`${key} is required in function, but is undefined`);
      }
    });

    return functionBeingValidated(realArgs);
  };

export { requireKeys };
