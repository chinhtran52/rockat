import { check } from 'meteor/check';

import { API } from '../../../../api/server';
import { findLivechatBusinessHour } from '../../../server/api/lib/businessHours';

API.v1.addRoute(
	'livechat/business-hour',
	{ authRequired: true, permissionsRequired: ['view-livechat-business-hours'] },
	{
		async get() {
			check(this.queryParams, {
				_id: String,
				type: String,
			});

			const { _id, type } = this.queryParams;
			const { businessHour } = await findLivechatBusinessHour(_id, type);
			return API.v1.success({
				businessHour,
			});
		},
	},
);
