const morgan = require("morgan");

morgan.token("raw-body", function (req) {
	if (!req.rawBody) return "No body";

	return req.rawBody
		.replace(/[\r\n]+/g, " ") // Replace all newlines with a single space
		.replace(/\s+/g, " ") // Collapse multiple spaces into one single space
		.trim(); // Remove leading/trailing spaces
});

const requestLogger = () =>
	morgan(
		":method :url :status :res[content-length] - :response-time ms :raw-body",
	);

module.exports = requestLogger;
