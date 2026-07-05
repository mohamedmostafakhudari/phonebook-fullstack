const PersonDetails = ({ person, onDeletePerson }) => {
	return (
		<p>
			<span>{person.name}</span>&nbsp;
			<span>{person.phoneNumber}</span>&nbsp;
			<button onClick={onDeletePerson}>delete</button>
		</p>
	);
};

export default PersonDetails;
