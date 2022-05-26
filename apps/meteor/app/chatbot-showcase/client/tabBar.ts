import { FC, lazy, LazyExoticComponent } from 'react';

import { addAction } from '../../../client/views/room/lib/Toolbox';

addAction('chatbot-showcase', {
	groups: ['channel', 'group'],
	id: 'chatbot-showcase',
	anonymous: true,
	full: true,
	title: 'chatbot_showcase',
	icon: 'cube',
	template: lazy(() => import('../../../client/views/room/contextualBar/ChatbotShowcase')) as LazyExoticComponent<FC>,
	order: 1,
});
