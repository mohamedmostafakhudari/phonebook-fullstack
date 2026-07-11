const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(`at least password should be provided as argument`);
	process.exit();
}

const [password, name, phoneNumber] = process.argv.slice(2, 5);

const url = `mongodb+srv://mohamedmostafakhudari_db_user:${password}@cluster0.fdgps9m.mongodb.net/phonebookApp?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
	name: String,
	phoneNumber: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && phoneNumber) {
	createNewPerson({ name, phoneNumber }).then(() => {
		mongoose.connection.close();
	});
} else {
	listPeople().then(() => {
		mongoose.connection.close();
	});
}

function createNewPerson({ name, phoneNumber }) {
	const person = new Person({
		name,
		phoneNumber,
	});

	return person.save().then((result) => {
		console.log(
			`added ${result.name} number ${result.phoneNumber} to phonebook`,
		);
	});
}

function listPeople() {
	return Person.find({}).then((result) => {
		console.log("phonebook:");
		result.forEach((person) => {
			console.log(`${person.name} ${person.phoneNumber}`);
		});
	});
}
