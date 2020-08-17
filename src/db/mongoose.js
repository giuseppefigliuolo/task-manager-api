const mongoose = require("mongoose");

// il setup di mongoose è quasi identico a quello di mongodb
// Una differenza è che all'interno dell'url al database specifichiamo anche il database a cui vogliamo accedere, in questo caso 'task-manager'
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  // 2) siccome ci era uscito "collection.findAndModify is deprecated. Use findOneAndUpdate" (dentro task-manager/playground) scriviamo:
  useFindAndModify: false,
});
