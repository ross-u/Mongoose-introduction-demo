# Mongoose | Introduction



<br>



## Application Design Patterns



<br>



Mongo Shell  and MongoDB Limitations:

 

- **We repeat a lot of code** (hard coding common queries).

- **It’s hard to enforce data consistency** (There is no way to enforce the structure of the documents).

- There are ways to enforce data document structure, but they are not esy to implement or manage in pure MongoDB.

  

To avoid these problems we need **an abstraction on top of our database connection**.



This abstraction is called an **ODM**.



<br>



## Object Document Mapper (ODM)

-  **ODM helps us to structure our data. **

-  **We create blueprints (called schemas )  to enforce the structure of our documents (what data type and names).**

-  **These schema instructions are written as  JavaScript objects.**



<br>



ODMs give us a set of reusable methods to perform CRUD actions in a more simple way.



Validations [are a bit tricky with just MongoDB](https://docs.mongodb.com/manual/core/document-validation/), and applying consistency is tricky.  Here is where the ODM steps in.





<br>





## Mongoose

[Mongoose](http://mongoosejs.com/docs/)  `npm` package, is an ODM (Object Document Mapper ) for MongoDB and Node.js.



### Setup

Mongoose is easy to set upjust like any other `npm` package. 

Let’s start a new project and install it.



```bash
# Create Directory
mkdir mongoose-example
cd mongoose-example

# Initialize npm and install mongoose
npm init
npm install --save mongoose
touch example.js
```





### Connecting to the Database

First, we must require mongoose in our `example.js`:

```js
const mongoose = require('mongoose');
const dbName = 'example-mongoose';

// CREATE AN INSTANCE OF CONNECTION TO DATABASE - `example-mongoose`
mongoose.connect(
  `mongodb://localhost:27017/${dbName}`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
```





 **The *same instance of Mongoose* [is shared](https://en.wikipedia.org/wiki/Singleton_pattern) across your application,** meaning that **once you** (require and) **connect to mongoose first time**, any `require('mongoose')` in other files after that will be talking to the `example-mongoose` database.



<br>



#### Automatic database creation/connection

- You don’t have to create the `example-mongoose` database. 

- MongoDB will check if the database exists when it connects to the server. 

  If it doesn’t exist, it will create the database and then connect to it.







### Model

- The **data model** (or just **model**) is what directly manages the data and querying logic. 

- **Model** is an overlay on top of one collection, that we use to query and interact with that collection in a database.

- Each collection has it's own model.



- [Mongoose models](http://mongoosejs.com/docs/api.html#model-js), are **a link to specific a collection**.

- Mongoose model  can also be used to create "**structured objects**" that will in future be stored in that  **a specific collection**. 



```js
// CREATE A MODEL
/* Mongoose models are JavaScript constructor functions that 
create objects to be stored in a specific collection, 
and are connected to that collection  */

const Cat = mongoose.model(
  'Cat', 
  {                 // SCHEMA OBJECT
    name: String,
    color: String,
  });
```



- The second parameter object is called - Schema 
- Schema represents how the document must look.





<br>







### CREATE A DOCUMENT INSTANCE

```js
// CALL MODEL TO CREATE A MODEL INSTANCE (STRUCTURED OBJECT)
const kitty = new Cat({ name: 'Iron Kitty', color: 'ironhack blue' });
```





#### Instance has the MongoDB methods that can be called from the instance itself.



```js
// `save()` - equivalent to `insertOne` method in mongo shell

// INSERT THE DOCUMENT INSTANCE INTO THE COLLECTION
kitty.save( (err) => {
  if (err) console.log(err); // if instance cannot be saved for some reason
  else console.log(`instance saved to DB ${dbName}`);
});



```



DB and collection don't exist yet

```bash
$ mongo
> show dbs
```



#### Run the `example.js`

```
node example.js
```



Now check in mongo shell

```js
> use exampleApp
> db.cats.find()
```



<br>



### Return all the documents

```js
// RETRIEVE ALL THE DOCUMENTS FROM THE COLLECTION `cats`
// Using a callback:
  Cat.find({}, (err, catsData) => {
    if (err) console.log('Cat.find error', err);
    else catsData.forEach((cat) => console.log('cat ->', cat));
  });
```







### Mongoose Thenables



- Mongoose async operations return ***Thenables***, which are a mongoose own implementation of Promises.

- Important to know is that we can call `.then()` and `.catch()` in the exactly same way as with Promises.

- We can use set the default type of promises to be other than mongoose ***Thenables***, for example ES6 promises by doing :

  ```js
  require('mongoose').Promise = Promise;
  ```





More details here: <https://mongoosejs.com/docs/promises.html>



We use Promises with the following syntax:

```js
myPromise
  .then(successCallback)
  .catch(failureCallback)
```





<br>



#### Let's refactor the `Cat.find`  to use promises instead of the callbacks.



```js
// RETRIEVE ALL THE DOCUMENTS FROM THE COLLECTION `cats`

// Using thenables (mongoose type of Promise)
Cat.find({})
  .then( (results) => console.log('RESULTS: ', results ))
  .catch( (err)=> console.log('Query Error: ', err));

/* //Using callback instead of promises:
  Cat.find({}, (err, cats) => {
    if (err) console.log('Cat.find error', err);
    else cats.forEach( (cat)=> console.log(' --> cat: ', cat.name));
  });
*/
```





<br>



### Promises All

Sometimes we may need to do something only after all promises are finished.

To wait for multiple promisified operations to finish, we use `Promise.all`





<br>



#### Create new Model - Dog

This will create new collection `dogs` in the database `mongoose-example`.

```js
const Dog = mongoose.model('Dog', { name: String });
```







<br>



### Create 2 promises with `insertMany` using `Cat` and `Dog` models



```js
// USING PROMISE ALL TO AWAIT FOR COMPLETION OF MULTIPLE QUERIES

const arrayOfCats = [
  { name: 'marbles', color: 'black' },
  { name: 'fluffy', color: 'white' },
  { name: 'tiger', color: 'orange and black' },
];
const arrayOfDogs = [ 
  {name: 'daisy'},
  {name: 'bella'},
  {name: 'sudo'}
];


const promise1 = Cat.insertMany( arrayOfCats );
const promise2 = Dog.insertMany( arrayOfDogs );


Promise.all( [promise1, promise2] )
  .then( (result) => console.log('Promise.all result: ', result))
  .catch( (err) => console.error(err));
```









## Mongoose connection events



```js
/* 
  MONGOOSE CONNECTION EVENTS
  We can provide a callback to be run on each
  of the below database events.
*/ 

// When successfully connected
mongoose.connection.on('connected', () => console.log('Mongoose connected'));

// When the connection is disconnected
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// If the connection throws an error
mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err));

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', () => {  
  mongoose.connection.close(() => { 
    console.log('Mongoose connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});
```

<br>



## Extra Resources

- [Mongoose Documentation](http://mongoosejs.com/docs/)
- [ES6 Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
