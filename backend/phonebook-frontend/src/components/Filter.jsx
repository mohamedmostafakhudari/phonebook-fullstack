import React from "react";
import useFilter from "../hooks/useFilter";

const Filter = ({ searchTerm, setSearchTerm }) => {
	return (
		<div>
			<span>filter shown with</span>
			&nbsp;
			<input
				name="search"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
		</div>
	);
};

export default Filter;
