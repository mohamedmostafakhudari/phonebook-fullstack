import { useState } from "react";

const useFilter = (persons) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredPersons = persons.filter((p) =>
		p.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return [searchTerm, setSearchTerm, filteredPersons];
};

export default useFilter;
