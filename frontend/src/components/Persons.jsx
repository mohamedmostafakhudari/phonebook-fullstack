import PersonDetails from "./PersonDetails";

const Persons = ({ persons, onDeletePerson }) => {
	return (
		<ul>
			{persons.map((p) => (
				<li key={p.id}>
					<PersonDetails
						person={p}
						onDeletePerson={() => onDeletePerson(p.id)}
					/>
				</li>
			))}
		</ul>
	);
};

export default Persons;
