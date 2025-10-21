const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Создаём сервер
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Для парсинга JSON

// Подключаемся к базе данных MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todoapp";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDB", err));

// Модель задачи
const Task = mongoose.model("Task", new mongoose.Schema({
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
}));

// Маршруты для работы с задачами
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post("/tasks", async (req, res) => {
    const { text } = req.body;
    const newTask = new Task({ text });
    await newTask.save();
    res.json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { done }, { new: true });
    res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
});

// Запускаем сервер
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
