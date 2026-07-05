const generateId = () => {
	return String(Math.floor(Math.random() * 1000000 + 1));
};

module.exports = {
	generateId,
};
