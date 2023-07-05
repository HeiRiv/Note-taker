const express = require("express");
const path = require("path");
const fs = require("fs");
const { stringify } = require("querystring");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received to get notes`);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read notes" });
    } else {
      const notes = JSON.parse(data);
      res.status(200).json(notes);
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const newNote = {
    id: Math.floor(Math.random() * 9999),
    title: req.body.title,
    text: req.body.text,
  };
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile("./db/db.json", JSON.stringify(notes), (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully updated reviews!")
      );
      res.json(notes);
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data) || [];
      notes = notes.filter((singlenote) => singlenote.id != req.params.id);

      fs.writeFile("./db/db.json", JSON.stringify(notes), (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully updated reviews!")
      );
      res.json(notes);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
