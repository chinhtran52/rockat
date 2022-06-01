import { Box } from '@rocket.chat/fuselage';
import { useTranslation, useUserRoom } from '@rocket.chat/ui-contexts';
import React, { useMemo } from 'react';

import VerticalBar from '../../../../components/VerticalBar';
import { useTabBarClose } from '../../providers/ToolboxProvider';
import { Showcase } from './components';
import getRoomTokenInfo from './services';

const ChatbotShowcase = ({ rid }) => {
	const onClickClose = useTabBarClose();
	const t = useTranslation();
	const room = useUserRoom(rid);
	const roomInfo = useMemo(() => {
		const token = room?.v?.token;
		return getRoomTokenInfo(token);
	}, [room]);
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
				<Showcase {...roomInfo} />
			</VerticalBar.Content>
		</>
	);
};

export default ChatbotShowcase;
