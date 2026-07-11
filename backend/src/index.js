require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const utils = require("./utils.js");
const errorHandler = require("./middlewares/errorHandler.js");
const requestLogger = require("./middlewares/requestLogger.js");
const db = require("./lib/db.js");
const Person = require("./models/person.js");
const app = express();

app.use(express.static(path.join(__dirname, "../dist")));

app.use(
	express.json({
		verify: (req, res, buf, encoding) => {
			req.rawBody = buf.toString(encoding || "utf8");
		},
	}),
);

app.use(requestLogger());

app.get("/api/info", (req, res) => {
	Person.countDocuments()
		.then((count) => {
			const pageContent = [
				`Phonebook has info for ${count} people`,
				String(new Date()),
			].join("\n");

			res.json(pageContent);
		})
		.catch((error) => next(error));
});

app.get("/api/persons", (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons);
		})
		.catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
	const personId = req.params.id;

	// 1. Check if the string matches MongoDB's ObjectId structure
	// 2. Double-check that casting it back doesn't change the string
	const isValid =
		mongoose.Types.ObjectId.isValid(personId) &&
		new mongoose.Types.ObjectId(personId).toString() === personId;

	if (!isValid) {
		return res.status(400).json({ error: "Invalid MongoDB ObjectId format" });
	}

	Person.findById(personId)
		.then((foundPerson) => {
			if (!foundPerson) {
				res.statusMessage = `A person with ID ${personId} is not found`;
				res.status(404).end();
				return;
			}
			res.json(foundPerson);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
	const personId = req.params.id;

	// 1. Check if the string matches MongoDB's ObjectId structure
	// 2. Double-check that casting it back doesn't change the string
	const isValid =
		mongoose.Types.ObjectId.isValid(personId) &&
		new mongoose.Types.ObjectId(personId).toString() === personId;

	if (!isValid) {
		return res.status(400).json({ error: "Invalid MongoDB ObjectId format" });
	}

	Person.findByIdAndDelete(personId)
		.then(() => {
			res.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	if (!body.name || !body.phoneNumber) {
		res.status(400).json({
			message: "missing required data [ name, phoneNumber ]",
		});
		return;
	}

	Person.findOne({ name: body.name })
		.then((foundPerson) => {
			if (foundPerson) {
				res.status(400).json({
					message: "name must be unique",
				});

				return null;
			}

			const newPerson = new Person({
				name: body.name,
				phoneNumber: body.phoneNumber,
			});

			return newPerson.save();
		})
		.then((savedPerson) => {
			if (savedPerson) {
				res.json(savedPerson);
			}
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
	const personId = req.params.id;
	const body = req.body;

	if (!body.name || !body.phoneNumber) {
		res.status(400).json({
			message: "missing required data [ name, phoneNumber ]",
		});
		return;
	}

	// 1. Check if the string matches MongoDB's ObjectId structure
	// 2. Double-check that casting it back doesn't change the string
	const isValid =
		mongoose.Types.ObjectId.isValid(personId) &&
		new mongoose.Types.ObjectId(personId).toString() === personId;

	if (!isValid) {
		return res.status(400).json({ error: "Invalid MongoDB ObjectId format" });
	}

	Person.findById(personId)
		.then((foundPerson) => {
			if (!foundPerson) {
				return res.status(404).end();
			}

			foundPerson.name = body.name;
			foundPerson.phoneNumber = body.phoneNumber;

			return foundPerson.save().then((updatedPerson) => {
				res.json(updatedPerson);
			});
		})
		.catch((err) => {
			res.status(500).json({ error: err.message });
		});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

db.connect().then(() => {
	app.listen(PORT, "0.0.0.0", () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
