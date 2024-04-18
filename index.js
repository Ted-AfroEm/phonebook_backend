require("dotenv").config();
const express = require("express");
const app = express();
//HTTP request logger middleware
const morgan = require("morgan");

const cors = require("cors");
const Phonebook = require("./models/phonebook");

app.use(cors());

morgan.token("datasent", function dataSent(req) {
  return JSON.stringify(req.body);
});

app.use(express.json());

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :datasent"
  )
);

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Phonebook.find({}).then((phoneBooks) => {
    console.log("phoneBooks");
    // console.log(response);
    response.json(phoneBooks);
  });
});

app.get("/api/info", (request, response) => {
  response
    .send
    // `<p>Phonebook has info for ${persons.length} people <br/> ${new Date()}</p>`
    ();
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then((deletedPerson) => {
      console.log(deletedPerson);
      if (deletedPerson) {
        response.json(deletedPerson);
      } else {
        response.status(404).json({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;
  if (!newPerson.name || !newPerson.number) {
    return response
      .status(400)
      .json({ error: "The name or number is misssing" });
  }

  // persons = persons.concat(newPerson);
  const person = new Phonebook({
    name: newPerson.name,
    number: newPerson.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });

  // response.json(newPerson);
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Phonebook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else {
    return response.status(500).json({ error: "Internal Server Error" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
