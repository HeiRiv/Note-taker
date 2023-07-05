const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.status(200).json(`${req.method} request received to get notes`);
  console.info(`${req.method} request received to get notes`);
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const newNote = req.body;

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
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
