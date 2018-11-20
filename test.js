// make formula=true in editor

function Person(name) {
  this.name = name;
}

Person.prototype.setName = function (newName) {
  this.name = newName;
};

const person = new Person('Me');
person.setName('Alicia');



const newPerson = Object.create(person);

console.log(newPerson);
console.log(newPerson.name);

newPerson.setName('Tom');
console.log(newPerson);

