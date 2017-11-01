


const catchAsync = (asyncFn) =>
  asyncFn()
    .then(() => {
      console.log("catchAsync thened");
    })
    .catch(() => {
      console.log("catchAsync catched");
    });


const rejectedFunction = () =>
  Promise.reject(3);

catchAsync(async () => {
  await rejectedFunction;
});





const doSlowThing = () =>
  Promise.reject('rejjecting');

router.get('/', catchAsync(async (request, response) => {
  await doSlowThing();
  // response.status(200).json({ good: 'reponse' });
}));



