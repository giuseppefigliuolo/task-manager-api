const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    // Qui usiamo lo spread operator che copierà tutte le proprietà da req.body in questo oggetto
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get /tasks?completed=false
// Get /tasks?limit=10&skip=0
// Get /tasks?sortBy=createdAt:asc
router.get("/tasks", auth, async (req, res) => {
  // questo match conterrà il filtro per i tasks -> se vogliamo solo completed o false o tutti
  const match = {};
  const sort = {};

  if (req.query.completed) {
    // questo darà un valore booleano a match.completed, infatti 'req.query.completed' può essere uguale o meno a 'true' e avremo either false o true
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match: match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id: _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every(el => allowedUpdates.includes(el));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update parameter" });
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    // const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    updates.forEach(el => (task[el] = req.body[el]));
    await task.save();

    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      res.status(404).send("Task not found.");
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
