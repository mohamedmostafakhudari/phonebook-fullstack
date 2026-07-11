const PersonForm = ({ newEntry, onSubmit, onInputChange }) => {
	return (
		<form onSubmit={onSubmit}>
			<div>
				name:{" "}
				<input
					required
					name="name"
					value={newEntry.name}
					onChange={onInputChange}
				/>
			</div>
			<div>
				number:{" "}
				<input
					required
					name="phoneNumber"
					value={newEntry.phoneNumber}
					onChange={onInputChange}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

export default PersonForm;
