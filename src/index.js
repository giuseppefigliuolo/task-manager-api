const express = require("express");
const app = express();
// scrivendo solo require(...etc) facciamo si che quel file venga eseguito (non ci interessa richiamarlo in questo doc ma solo aviarlo) così in questo caso mongoose si connetterà al server
require("./db/mongoose");
// 11) Importiamo il router creato
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

// 1) Per heroku || o in caso 3000 - porta localhost
const port = process.env.PORT;

// 4) Questo ci autometicamente 'parserà' il json che ci restituirà il server
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// 2) Ascoltiamo port (heroku: port = process.env.PORT)
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

const Task = require("./models/task");
const User = require("./models/user");

// const main = async () => {
// const task = await Task.findById("5f057426b5b65100f4e699d8");
// // populate ci permette di popolare di dati. Quindi in questo caso dall'avere solo l'id avremo tutto il profilo utente 'popolato'
// await task.populate("owner").execPopulate();
// console.log(task.owner);

//   const user = await User.findById("5f0571e599f98a5150e813da");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };

// main();

// Primo esperimento con jsonwebtoken
/*
const jwt = require("jsonwebtoken");
const myFunction = async () => {
  // questo restituisce un'autenticazione
  // Dopo useremo il vero id
  const token = jwt.sign({ _id: "abc123" }, "thisismynewcourse", { expiresIn: "7 days" });
  // console.log(token);

  const data = jwt.verify(token, "thisismynewcourse");
  // console.log(data);
};

myFunction();

// Esperimento per verificare e spiegare userSchema.methods.toJSON
const pet = {
  name: "Tony",
};

pet.toJSON = function () {
  return {};
};

console.log(JSON.stringify(pet));

// Creiamo un endpoint per uppare file
const multer = require("multer");
const upload = multer({
  // dest is destination (name of the folder where file will be stored)
  dest: "images",
  // limits serve per settare un limite di spazio da non eccedere per il file da archiviare
  limits: {
    // in bites. 1mb = 1000000b
    fileSize: 1000000,
  },
  // Questo serve per filtrare per estensione del file. il parametro file ha le info riguardo ad esso. e cb = callback -> lo usiamo per dire a multer quando abbiamo finito
  fileFilter(req, file, cb) {
    // originalname è una proprietà di multer per prendere il nome originale del file: qui di seguito accettiamo solo pdf
    // dentro l'if abbiamo messo una regular expression \.(doc|docx)$ -> '/' significa che deve contenere i caratteri che lo seguono e poi il dollaro finale significa che li deve contenere alla fine del nome (quindi ottimo per controllare le file extension)
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error("Please upload a Word document"));
    }

    cb(undefined, true);
  },
});
const errorMiddleware = (req, res, next) => {
  throw new Error("From my middleware");
};
// Upload.single('upload') quell'upload tra virgolette sta ad identificare la key che metteremo nella richiesta post su postman
app.post(
  "/upload",
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
*/
