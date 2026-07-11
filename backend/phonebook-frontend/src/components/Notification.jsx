const notificationStyles = {
	marginBottom: "1rem",
	padding: "0.8rem",
	border: "3px solid",
	borderRadius: 5,
	fontWeight: "500",
};

const defaultStyles = {
	backgroundColor: "hsl(197, 81%, 86%)",
	borderColor: "hsl(204, 53%, 42%)",
	color: "hsl(204, 53%, 42%)",
};
const successStyles = {
	backgroundColor: "hsl(120, 81%, 86%)",
	borderColor: "hsl(120, 50%, 31%)",
	color: "hsl(120, 50%, 31%)",
};
const errorStyles = {
	backgroundColor: "hsl(0, 81%, 86%)",
	borderColor: "hsl(0, 64%, 42%)",
	color: "hsl(0, 64%, 42%)",
};

const variations = {
	default: defaultStyles,
	success: successStyles,
	error: errorStyles,
};

const Notification = ({ message, variation = "default" }) => {
	if (!message) return null;

	return (
		<div
			style={{
				...notificationStyles,
				...variations[variation],
			}}
		>
			{message}
		</div>
	);
};

export default Notification;
