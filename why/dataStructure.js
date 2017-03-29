_____________hash with id inside vs hash indexed by id ?
[
  {
    id: 1
    title: 'Ruby',
    imageUrl: 'placehold.it/150x100'
  }
];

vs 

[
  {
    1: {
      title: 'Ruby',
      imageUrl: 'placehold.it/150x100'
    }
  }
]

I chose hash with id inside, because was confused as to how to work with eg
course = { 1: {} }. Should I Object.keys(course)[0] all the time?
