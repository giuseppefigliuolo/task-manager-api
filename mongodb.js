// CRUD create read update delete
// const mongodb = require("mongodb");
// variable to initialize the connection. Questo MongoClient ci fornirà le funzioni necessarie per connettersi al database
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
/**
 * con il destructuring di JS le righe scritte sopra si possono scrivere così:
 * const { MongoClient, ObjectID } = require('mongodb')
 */

//  Questa è una funzione che genererà per noi un nuovo id. In nosql gli id generati conservano anche una data precisa -la possiamo sapere con id.getTimeStamp()
// const id = new ObjectID();
// console.log(id.getTimestamp());

// definiamo l'url al database e le credenziali per accedervi
// const connectionURL = "mongodb://127.0.0.1:27017";
// const databaseName = "task-manager";

// Ecco il metodo di MongoClient per connettersi
// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
// Questa callback comincerà una volta connessi
// if (error) {
//   Questo return serve ad arrestare la funziona una volta che l'errore c'è
//   return console.log("Unable to connect to database");
// }

// This variable is simply a database reference
// const db = client.db(databaseName);

// Collection vuole il nome della collection (tipo tabella in un NoSQL) e poi il metodo 'insert one' per inserire un document nella collection
//   db.collection("users").insertOne(
//     {
//       _id: id,
//       name: "Tony",
//       age: 28,
//     },
//     // insertOne ha una callback per gestire gli errori o il res
//     (error, result) => {
//       if (error) {
//         return console.log("Unable to insert user");
//       }
//       //   ops è un'array di oggetti che contiene tutti i 'documenti' nosql appena inseriti tramite insertOne
//       console.log(result.ops);
//     }
//   );
//   db.collection("users").findOne({ _id: new ObjectID("5ee685ebdce8793a8c2430ff") }, (error, result) => {
//     if (error) {
//       return console.log("error");
//     }

//     console.log(result);
//   });

// Qui vogliamo trovare con find tutte gli users con una certa età
// Con find mongodb ci restituisce un 'cursor' ovvero un preciso riferimento ai dati che cercavamo nel database
//   toArray ci restituisce un array e non più un cursor
//   db.collection("users")
//     .find({ name: "Tony" })
//     .count((error, result) => {
//       console.log(result);
//     });
// db.collection("tasks")
//   .updateMany(
//     {
//       completed: false,
//     },
//     {
//       $set: {
//         completed: true,
//       },
//     }
//   )
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });
//   db.collection("tasks")
//     .deleteOne({
//       task: "Travel to US",
//     })
//     .then(res => {
//       console.log(res);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });
