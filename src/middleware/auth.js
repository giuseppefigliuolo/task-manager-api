const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Qui ad app.use si passa un middleware che ha questo comportamento: new request -> do something -> run route handler
// Questo middleware ci servirà per l'autenticazione -> questo perchè il middleware può fare un check prima di inizializzare la route (quindi controlla le credenziali)
const auth = async (req, res, next) => {
  try {
    // ricordiamo che nell'header è conservato il token di autenticazione a cui accediamo tramite req.header. 'Authorization è la key (come abbiamo visto su postman)
    // Con replace estraiamo la stringa senza Bearer, così ci serve per verificarla con la password grazie a jwt
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }

    // siccome abbiamo già fetchat l'user e i suoi dati, che serviranno dopo, li salviamo così dopo non c'è bisogno di rifetcharli
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate correctly." });
  }
};

module.exports = auth;
