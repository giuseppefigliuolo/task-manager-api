const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail } = require("../emails/account");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");

// Sign-up
router.post("/users", async (req, res) => {
  //5) come per una normale funzione costruttore forniamo il parametro che sarà il body della richiesta http
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// With email and password checkiamo se l'utente ha immesso le giuste credenziali con il seguente endpoint
router.post("/users/login", async (req, res) => {
  try {
    // findByCredentials prende email e password -> l'abbiamo creata noi nel mangoose.model.user
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user: user, token: token });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
  } catch (e) {
    res.status(500).send();
  }
});

//  6) Ora settiamo il metodo get per ricevere dati dal database e leggerli/visualizzarli
router.get("/users/me", auth, async (req, res) => {
  // siccome il middleware auth salva i dati dell'utente in req.user -> quindi a questo punto l'untente è già autorizzato e pronto a visualizzare il suo profilo si può procedere direttamente inviandogli il req.send
  res.send(req.user);
});

// 7) Ora settiamo per ricevere un singolo task dal database
// router.get("/users/:id", async (req, res) => {
//   // 8) siccome :id... sarà un valore dinamico epress ci fornisce il metodo params che contiene i dati e gli indirizzi che forniamo. es. localhost:3000/users/2921898198 il req.params sarà -> id: 2921898198
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send();
//     console.log(err);
//   }
// });

// 8) .patch ci permette di ottenere un elemento del database e aggiornarlo
router.patch("/users/me", auth, async (req, res) => {
  // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(el => allowedUpdates.includes(el));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid update parameter" });
  }

  try {
    // Al contrario di mongoDB non c'è bisogno di usare il "set" -> come secondo parametro passiamo quello che vogliamo modificare (in questo caso il body(quindi il body della richiesta http con le varie chiavi e valori)). Il terzo argomento è un option -> in questo caso usiamo { new: true } per ritornare il nuovo user aggiornato. Invece runValidators serve per mantenere le validazioni impostate nei modelli di mongoose
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    // siccome User.findByIdAndUpdate bypassa userSchema.pre lo sostituiamo e creiamo la logica dell'aggiornamento dell'utente da zero
    updates.forEach(el => (req.user[el] = req.body[el]));
    await req.user.save();

    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// 10) .delete per express è l'endpoint per cancellare
router.delete("/users/me", auth, async (req, res) => {
  try {
    // Useremo il metodo REMOVE di mongoose -> rimuove l'utente che gli passiamo
    await req.user.remove();
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid format: .jpg, .jpeg, .png"));
    }
    cb(undefined, true);
  },
});
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // req.file.buffer contiene tutti i dati binari del file che uppiamo
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user | !user.avatar) {
      throw new Error();
    }

    // Questo è per specificare nell'header il il tipo di file con cui stiamo lavorando (png, pdf etc)
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
