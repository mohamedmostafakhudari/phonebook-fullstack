import { useEffect, useState } from "react";
import Persons from "./components/Persons";
import useFilter from "./hooks/useFilter";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import infoService from "./services/info";
import Notification from "./components/Notification";

const App = () => {
	const [info, setInfo] = useState(null);
	const [persons, setPersons] = useState([]);
	const [newEntry, setNewEntry] = useState({
		name: "",
		phoneNumber: "",
	});
	const [infoMessage, setInfoMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [searchTerm, setSearchTerm, filteredPersons] = useFilter(persons);

	const handleAddPerson = (e) => {
		e.preventDefault();
		const { name, phoneNumber } = newEntry;

		// here we assume that people names can't be repeated in this phonebook
		const foundPerson = persons.find(
			(p) => p.name.toLowerCase() === name.toLowerCase(),
		);

		if (foundPerson) {
			if (foundPerson.phoneNumber === phoneNumber) {
				setInfoMessage(
					`${foundPerson.name} is already added to your phone book with the same phone number used`,
				);
				setTimeout(() => {
					setInfoMessage("");
				}, 5000);
			} else {
				const updateNumberConfirmed = confirm(
					`${foundPerson.name} is already added to your phone book but with a different phone number, would you like to replace the old number with the new one?`,
				);

				if (updateNumberConfirmed) {
					updatePhoneNumber(foundPerson.id, phoneNumber);
				}
			}
			return;
		}

		const newPerson = { name, phoneNumber };

		personService
			.create(newPerson)
			.then((returnedPerson) => {
				setPersons(persons.concat(returnedPerson));

				setSuccessMessage(`Added ${returnedPerson.name}`);
				setTimeout(() => {
					setSuccessMessage("");
				}, 5000);
			})
			.catch((error) => {
				setErrorMessage(error.response.data.error);
				setTimeout(() => {
					setErrorMessage("");
				}, 5000);
			});

		setNewEntry({
			name: "",
			phoneNumber: "",
		});
	};

	const updatePhoneNumber = (id, newPhoneNumber) => {
		const person = persons.find((p) => p.id === id);

		const updatedPerson = { name: person.name, phoneNumber: newPhoneNumber };

		personService
			.update(id, updatedPerson)
			.then((returnedPerson) => {
				setPersons(persons.map((p) => (p.id === id ? returnedPerson : p)));

				setSuccessMessage(`Updated ${returnedPerson.name}'s Phone Number`);
				setTimeout(() => {
					setSuccessMessage("");
				}, 5000);
			})
			.catch((error) => {
				setErrorMessage(
					`couldn't update person's phone number, ${person.name} has already been removed`,
				);
				setTimeout(() => {
					setErrorMessage("");
				}, 5000);

				setPersons(persons.filter((p) => p.id !== person.id));
			});

		setNewEntry({
			name: "",
			phoneNumber: "",
		});
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewEntry({
			...newEntry,
			[name]: value,
		});
	};

	const handleDeletePerson = (id) => {
		const personToDelete = persons.find((p) => p.id === id);

		if (!personToDelete) return;

		const deleteConfirmed = confirm(`Delete ${personToDelete.name} ?`);

		if (deleteConfirmed) {
			personService
				.deleteOne(id)
				.then((responseStatus) => {
					if (responseStatus === 204) {
						setPersons(persons.filter((p) => p.id !== id));

						setSuccessMessage(`Deleted ${personToDelete.name}`);
						setTimeout(() => {
							setSuccessMessage("");
						}, 5000);
					}
				})
				.catch((error) => {
					setErrorMessage(
						`couldn't delete person, ${personToDelete.name} has already been removed`,
					);
					setTimeout(() => {
						setErrorMessage("");
					}, 5000);

					setPersons(persons.filter((p) => p.id !== personToDelete.id));
				});
		}
	};

	useEffect(() => {
		personService
			.getAll()
			.then((initialPersons) => {
				setPersons(initialPersons);
			})
			.catch((error) => {
				setErrorMessage(`couldn't fetch persons data, ${error.message}`);
				setTimeout(() => {
					setErrorMessage("");
				}, 5000);
			});
	}, []);

	useEffect(() => {
		infoService
			.getInfo()
			.then((initialInfo) => {
				setInfo(initialInfo);
			})
			.catch((error) => {
				setErrorMessage(`couldn't fetch persons data, ${error.message}`);
				setTimeout(() => {
					setErrorMessage("");
				}, 5000);
			});
	}, [persons]);
	return (
		<div>
			<section>
				<h1>Phonebook</h1>
				<pre>{info}</pre>
				<Notification message={infoMessage} />
				<Notification
					message={successMessage}
					variation="success"
				/>
				<Notification
					message={errorMessage}
					variation="error"
				/>
			</section>
			<section>
				<Filter
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			</section>
			<section>
				<h2>add a new</h2>
				<PersonForm
					newEntry={newEntry}
					onSubmit={handleAddPerson}
					onInputChange={handleInputChange}
				/>
			</section>
			<section>
				<h2>Numbers</h2>
				<Persons
					persons={filteredPersons}
					onDeletePerson={handleDeletePerson}
				/>
			</section>
		</div>
	);
};

export default App;
