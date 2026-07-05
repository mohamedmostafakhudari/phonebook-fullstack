const express = require("express");
const morgan = require("morgan");
const utils = require("./utils.js");

const app = express();

app.use(
	express.json({
		verify: (req, res, buf, encoding) => {
			req.rawBody = buf.toString(encoding || "utf8");
		},
	}),
);

morgan.token("raw-body", function (req) {
	if (!req.rawBody) return "No body";

	return req.rawBody
		.replace(/[\r\n]+/g, " ") // Replace all newlines with a single space
		.replace(/\s+/g, " ") // Collapse multiple spaces into one single space
		.trim(); // Remove leading/trailing spaces
});

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :raw-body",
	),
);

app.use(express.static("dist"));

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		phoneNumber: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		phoneNumber: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		phoneNumber: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		phoneNumber: "39-23-6423122",
	},
];

app.get("/", (req, res) => {
	res.send(`<h1>Hello World!</h1>`);
});

app.get("/info", (req, res) => {
	const pageContent = [
		`Phonebook has info for ${persons.length} people`,
		String(new Date()),
	].join("\n");

	res.send(pageContent);
});

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const personId = req.params.id;

	const person = persons.find((p) => p.id === personId);
	if (!person) {
		res.statusMessage = `A person with ID ${personId} is not found`;
		res.status(404).end();
		return;
	}

	res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
	const personId = req.params.id;

	persons = persons.filter((p) => p.id !== personId);
	res.status(204).end();
});

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.phoneNumber) {
		res.status(400).json({
			message: "missing required data [ name, phoneNumber ]",
		});
		return;
	}

	const personExists = persons.find((p) => p.name === body.name);
	if (personExists) {
		res.status(400).json({
			message: "name must be unique",
		});
		return;
	}

	const newPerson = {
		name: body.name,
		phoneNumber: body.phoneNumber,
		id: utils.generateId(),
	};

	persons = persons.concat(newPerson);

	res.json(newPerson);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
