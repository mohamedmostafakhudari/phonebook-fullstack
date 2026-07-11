import axios from "axios";

const baseUrl = `/api/info`;

const getInfo = () => {
	return axios.get(`${baseUrl}`).then((response) => response.data);
};

export default {
	getInfo,
};
