import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ msg: "Home Page" })
});

app.get("/todos", async (req, res) => {
    try {
        const todos = await db.query("SELECT * FROM todo_table")
        res.json(todos.rows);
    } catch (error) {
        res.json(error)
    }
});

app.post("/todos", async (req, res) => {
    try {
        const { desc, completed } = req.body
        console.log(desc, completed)
        const newTodo = await db.query("INSERT INTO todo_table (todo_desc, todo_completed) VALUES($1, $2)",
            [desc, completed]
        );
        res.json({ newTodo, msg: "Todo Added", success: true })
    } catch (error) {
        res.json(error)
    }
})

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const todos = await db.query("SELECT * FROM todo_table WHERE todo_id = $1",
            [id]
        );
        res.json(todos.rows);
    } catch (error) {
        res.json(error)
    }
})

app.put("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { desc, completed } = req.body
        const todos = await db.query("UPDATE todo_table SET todo_desc = $1, todo_completed = $2 WHERE todo_id = $3",
            [desc, completed, id]
        );
        res.json({ msg: "Todo Updated", success: true })
    } catch (error) {
        res.json(error)
    }
})

app.delete("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const delTodo = await db.query(
            "DELETE FROM todo_table WHERE todo_id = $1",
            [id]
        );
        res.json({ msg: "Todo Deleted", success: true })
    } catch (error) {
        res.json(error)
    }
})

app.delete("/todos", async (req, res) => {
    try {
        const delAllTodos = await db.query(
            "DELETE FROM todo_table"
        );
        res.json({ msg: "All todos deleted", success: true })
    } catch (error) {
        res.json(error)
    }
})

app.listen(PORT, () => {
    console.log(`App Running on http://localhost:${PORT}`)
})