/*
Before requiring the mongoose package,
install it as a dependency:

npm i --save mongoose

*/

// IMPORT MONGOOSE
const mongoose = require('mongoose');
const dbName = 'example-mongoose';



// CREATE A DATABASE CONNECTION INSTANCE - TO DB `example-mongoose`
mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// CREATE A MODEL
/* Mongoose model is a link to a specific collection.
   Mongoose model can also be used to create "structured objects"
   that can later be stored in that specific collection.
*/


const Cat = mongoose.model('Cat', {
  name: String,
  color: String,
});

const Dog = mongoose.model('Dog', {
  name: String,
});



// USE THE MODEL TO CREATE A DOCUMENT INSTANCE (STRUCTURED OBJECT)
const kitty = new Cat({ name: 'Iron Kitty', color: 'ironhack blue' });




// INSERT THE DOCUMENT INSTANCE INTO THE COLLECTION

// save() - equivalent to `insertOne` method in mongo shell
kitty.save(err => {
  if (err) console.log(err);
  // if instance cannot be saved for some reason
  else console.log('instance saved to DB');
});





// RETRIEVE ALL THE DOCUMENTS FROM THE COLLECTION `cats`

// Cat model is a direct connection to the `cats` collection
// Using a callback
Cat.find({})
  .then(results => console.log('The retrieved documents: ', results))
  .catch(err => console.log('Cats.find({}) error: ', err));


/* 

  // Using the callback syntax instead of promises:
  
  Cat.find({}, (err, cats) => {
    if (err) console.log('Cat.find error', err);
    else cats.forEach( (cat)=> console.log(' --> cat: ', cat.name));
  });

*/



/*
  USING  `Promise.All( [] )` TO AWAIT FOR THE COMPLETION 
  OF MULTIPLE QUERIES ( aka ASYNCHRONOUS OPERATIONS )
*/
const arrayOfCats = [
  { name: 'marbles', color: 'black' },
  { name: 'fluffy', color: 'white' },
  { name: 'tiger', color: 'orange and black' },
];

const arrayOfDogs = [
  { name: 'daisy' },
  { name: 'jessy' },
  { name: 'sudo' }
];

const promise1 = Cat.insertMany(arrayOfCats);
const promise2 = Dog.insertMany(arrayOfDogs);

Promise.all([promise1, promise2])
  .then(result => console.log('Promise.all result: ', result))
  .catch(err => console.error(err));





/* 
  MONGOOSE CONNECTION EVENTS
  We can provide a callback to be run on each
  of the below database events.

*/ 
  // When successfully connected
mongoose.connection.on('connected', () =>
  console.log('Mongoose default connection open'),
);

  // When the connection is over - disconnected
mongoose.connection.on('disconnected', () =>
  console.log('Mongoose default connection disconnected'),
);

  // If the connection throws an error
mongoose.connection.on('error', err =>
  console.log('Mongoose default connection error: ' + err),
);

  // When the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log(
      'Mongoose default connection disconnected through app termination',
    );
    process.exit(0);
  });
});
