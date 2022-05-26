import { Box } from '@rocket.chat/fuselage';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React from 'react';

import VerticalBar from '../../../../components/VerticalBar';
import { useTabBarClose } from '../../providers/ToolboxProvider';
import { Showcase } from './components';

const ChatbotShowcase = () => {
	const onClickClose = useTabBarClose();
	const t = useTranslation();

	return (
		<>
			<VerticalBar.Header>
				<VerticalBar.Icon name='discussion' />
				<Box flexShrink={1} flexGrow={1} withTruncatedText mi='x8'>
					{t('chatbot_showcase')}
				</Box>
				<VerticalBar.Close onClick={onClickClose} />
			</VerticalBar.Header>
			<VerticalBar.Content paddingInline={0}>
				<Showcase />
			</VerticalBar.Content>
		</>
	);
};

export default ChatbotShowcase;
