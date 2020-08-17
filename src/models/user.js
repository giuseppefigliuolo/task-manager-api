const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email's not valid");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      // Questo serve per mettere una validazione al valore
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length < 6 || value.toLowerCase().includes("password")) {
          throw new Error("Password must be at least 6 letters and can't be 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      // Per l'immagine profilo
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// Qui creaiamo una 'virtual property', dati che appartengono ad un'altra collezione ma che sono in collegamento qui. Il primo parametro del metodo 'tasks' è a nostro piacere mentre il secondo è un oggetto dove configuriamo ogni campo individualmente
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  // field dentro il ref che abbiamo specificato da dove si prendono i dati -> foreignfield
  foreignField: "owner",
});

// La differenza tra .methods e .statics è che gli statics possono essere accessibili dal modello invece i methods anche dalle istanze dell'oggetto costruttore
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token: token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  // con questo metodo noi possiamo controllare i dati che mostriamo all'utente (vogliamo nascondere password e dati sensibili)
  const user = this;
  // .toObject è un metodo di mongoose che ci permette di ottenere i dati in che richiediamo in un oggetto raw
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

// Schema.statics crea un metodo che può essere richiamato dal model una volta che abbiamo accesso ad esso: es. User.findByCredentials()
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Unable to login. Check your credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// .pre viene usato per far fare qualcosa allo schema in questo caso prima che l'utente venga salvato. il primo argomento è l'evento a cui ci riferiamo (quindi prima di questo evento) l'altro argomento sono le istruzioni che diamo. IMPORTANTE usare una funzione con sintassi classica al fine di avere uno scope privato -> siccome si tratta di password
userSchema.pre("save", async function (next) {
  // con this ci si riferisce al prodotto del modello mongoose (in questo caso un nuovo utente, o un task)
  const user = this;
  // next è fondamentale -> comunichiamo alla funzione che l'evento è finito è può andare avanti
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Questo è un middleware che nel momento in cui un utente si cancella dalla piattaforma con lui si cancellano anche le sue task
userSchema.pre("remove", async function (next) {
  user = this;

  // Questo cancellerà ogni task che ha come owner quello specificato di seguito
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
