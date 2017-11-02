


Promise.all([
  2,
  (true ? 9 : '')
])
  .then(([a, b]) => {
    console.log({a, b});
  })

