import React from 'react';
import './showcase.css';

const Showcase = ({ service, senderId }) => {
	console.log(process.env);
	if (!service || !senderId) {
		return <iframe className='chatbot-showcase' src='http://localhost:3002' />;
	}
	return <iframe className='chatbot-showcase' src={`http://localhost:3002/service/${service}/sender/${senderId}`} />;
};

export default Showcase;
