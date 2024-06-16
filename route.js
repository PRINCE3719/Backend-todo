const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {ObjectId} = mongoose.Types;


// Helper function to get the MongoDB collection
const getCollection = () => {
  const db = mongoose.connection.db;
  return db.collection("todos");
};

// GET endpoint to fetch all tasks
router.get("/get", async (req, res) => {
  try {
    const collection = getCollection();
    const tasks = await collection.find({}).toArray();
    res.json(tasks);
  } catch (error) {
    console.error("Error in fetching tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint to create a new task
router.post("/post", async (req, res) => {
  try {
    const collection = getCollection();
    let { data } = req.body;

    if (!data) {
      return res.status(400).json({ msg: "Error: No data found" });
    }

    data = (typeof data === 'string') ? data: JSON.stringify(data);

    const taskEntry = await collection.insertOne({ data, status: false });
    res.status(201).json({ data, status: false, _id: taskEntry.insertedId });
  } catch (error) {
    console.error("Error in creating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE endpoint to delete a task by ID
router.delete("/delete/:id", async (req, res) => {
    try {
      const id = req.params.id;
  
      // Validate if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId" });
      }
  
      const _id = new ObjectId(id);
      const collection = getCollection();
      const deleteTodo = await collection.deleteOne({ _id });
  
      if (deleteTodo.deletedCount === 0) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error in deleting task:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  


router.put("/update/:id", async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const collection = getCollection();
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });
    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Error in updating task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
