const express = require("express");
const cors = require("cors");
const app = express();

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

function requestLogger(req, res, next) {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("----");
  next();
}

function unknownEndpoint(req, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

function generateId() {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => +n.id)) : 0;
  return `${maxId + 1}`;
}

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content not found" });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: Boolean(body.important) || false,
  };

  notes = notes.concat(note);
  res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  notes.filter((notes) => notes.id !== id);
  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
