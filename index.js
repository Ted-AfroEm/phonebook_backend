const express = require("express");
const app = express();
//HTTP request logger middleware
const morgan = require("morgan");

const cors = require("cors");

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path: ", request.path);
//   console.log("Body: ", request.body);
//   console.log("---");
//   next();
// };

// app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people <br/> ${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons.filter((person) => person.id !== id);
  console.log(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const newPerson = request.body;
  if (!newPerson.name || !newPerson.number) {
    return response
      .status(400)
      .json({ error: "The name or number is misssing" });
  }
  let nameExist = persons.find((person) => person.name === newPerson.name);
  if (nameExist) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(newPerson);
  response.json(newPerson);
});
// The name or number is missing
// The name already exists in the phonebook

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
