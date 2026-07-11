const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

function connect() {
	return mongoose
		.connect(url, { family: 4 })
		.then((result) => {
			console.log(`connected to MongoDB`);
		})
		.catch((error) => {
			console.log("error connecting to MongoDB:", error.message);
		});
}

module.exports = {
	connect,
};
