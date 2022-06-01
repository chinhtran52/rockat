import { FC, lazy, LazyExoticComponent } from 'react';

import { addAction } from '../../../client/views/room/lib/Toolbox';

addAction('chatbot-showcase', {
	groups: ['channel', 'group', 'direct', 'direct_multiple', 'voip', 'team', 'live'],
	id: 'chatbot-showcase',
	anonymous: true,
	full: true,
	// @ts-ignore
	title: 'chatbot_showcase',
	icon: 'cube',
	template: lazy(() => import('../../../client/views/room/contextualBar/ChatbotShowcase')) as LazyExoticComponent<FC>,
	order: 0,
});
