const mongoose = require('mongoose');
const dbName = 'example-mongoose';

// CREATE AN INSTANCE OF CONNECTION TO DATABASE - `example-mongoose`  
mongoose.connect(`mongodb://localhost/${dbName}`);



// CREATE A MODEL
/* Mongoose models are JavaScript constructor functions that 
create objects to be stored in a specific collection, 
and are connected to that collection  */
const Cat = mongoose.model('cat', { name: String });
const Dog = mongoose.model('Dog', { name: String });




// CALL MODEL TO CREATE A DOCUMENT INSTANCE (STRUCTURED OBJECT)
const kitty = new Cat({ name: 'Ironhacker'});




// INSERT THE DOCUMENT INSTANCE INTO THE COLLECTION
kitty.save( (err) => {
  if (err) console.log(err); // if instance cannot be saved for some reason
  else console.log('instance saved to DB');
});
// `save()` method on the model is equivalent to `insertOne` command 





// RETRIEVE ALL THE DOCUMENTS FROM THE COLLECTION `cats`
Cat.find({})
  .then( (results) => console.log('The retrieved documents: ', results ))
  .catch( (err)=> console.log('Cats.find({}) error: ', err)); 

/* //Using callback instead of promises:
  Cat.find({}, (err, cats) => {
    if (err) console.log('Cat.find error', err);
    else cats.forEach( (cat)=> console.log(' --> cat: ', cat.name));
  });
*/





// USING PROMISE ALL TO AWAIT FOR COMPLETION OF MULTIPLE QUERIES
let promise1 = Cat.insertMany([ {name: 'marbles'}, {name: 'fluffy'}, {name: 'tiger'}])
let promise2 = Dog.insertMany([ {name: 'daisy'}, {name: 'buddy'}, {name: 'bella'}])

Promise.all( [promise1, promise2] )
  .then( (result) => console.log('Promise.all result: ', result))
  .catch(err => console.error(err));





// MONGOOSE CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => console.log('Mongoose default connection open'));

// When the connection is disconnected
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

// If the connection throws an error
mongoose.connection.on('error', (err) => console.log('Mongoose default connection error: ' + err));

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', () => {  
  mongoose.connection.close(() => { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});