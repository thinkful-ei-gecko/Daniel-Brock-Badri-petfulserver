const { Queue } = require('./Queue');

function users() {
  const userQ = new Queue();
  userQ.enqueue('Daniel');
  userQ.enqueue('Badri');
  userQ.enqueue('Brock');
  userQ.enqueue('Phoebe');
  userQ.enqueue('Kevin');

  console.log(userQ);
}

function dogs() {
  const dogs = new Queue();
  dogs.enqueue('Max');
  dogs.enqueue('Layla');
  dogs.enqueue('Lucy');
  dogs.enqueue('Lassie');

  console.log(dogs);
}
