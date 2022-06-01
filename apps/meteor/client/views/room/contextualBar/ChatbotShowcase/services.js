import { indexOf } from 'underscore';

const getRoomTokenInfo = (roomToken, dividerPattern = ':') => {
	try {
		const dividerIndex = indexOf(roomToken, dividerPattern);
		const service = roomToken.slice(0, dividerIndex);
		const senderId = roomToken.slice(dividerIndex + 1);
		return {
			service,
			senderId,
		};
	} catch {
		return null;
	}
};

export default getRoomTokenInfo;
