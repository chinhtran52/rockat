import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

import { hasPermission } from '../../../authorization';
import { clean } from '../lib/cleanQuery';
import { API } from '../api';

const pathAllowConf = {
	'/api/v1/users.list': ['$or', '$regex', '$and'],
	'def': ['$or', '$and', '$regex'],
};

API.helperMethods.set('parseJsonQuery', function _parseJsonQuery() {
	let sort;
	if (this.queryParams.sort) {
		try {
			sort = JSON.parse(this.queryParams.sort);
			Object.entries(sort).forEach(([key, value]) => {
				if (value !== 1 && value !== -1) {
					throw new Meteor.Error('error-invalid-sort-parameter', `Invalid sort parameter: ${key}`, {
						helperMethod: 'parseJsonQuery',
					});
				}
			});
		} catch (e) {
			this.logger.warn(`Invalid sort parameter provided "${this.queryParams.sort}":`, e);
			throw new Meteor.Error('error-invalid-sort', `Invalid sort parameter provided: "${this.queryParams.sort}"`, {
				helperMethod: 'parseJsonQuery',
			});
		}
	}

	let fields;
	if (this.queryParams.fields) {
		try {
			fields = JSON.parse(this.queryParams.fields);

			Object.entries(fields).forEach(([key, value]) => {
				if (value !== 1 && value !== 0) {
					throw new Meteor.Error('error-invalid-sort-parameter', `Invalid fields parameter: ${key}`, {
						helperMethod: 'parseJsonQuery',
					});
				}
			});
		} catch (e) {
			this.logger.warn(`Invalid fields parameter provided "${this.queryParams.fields}":`, e);
			throw new Meteor.Error('error-invalid-fields', `Invalid fields parameter provided: "${this.queryParams.fields}"`, {
				helperMethod: 'parseJsonQuery',
			});
		}
	}

	// Verify the user's selected fields only contains ones which their role allows
	if (typeof fields === 'object') {
		let nonSelectableFields = Object.keys(API.v1.defaultFieldsToExclude);
		if (this.request.route.includes('/v1/users.')) {
			const getFields = () =>
				Object.keys(
					hasPermission(this.userId, 'view-full-other-user-info')
						? API.v1.limitedUserFieldsToExcludeIfIsPrivilegedUser
						: API.v1.limitedUserFieldsToExclude,
				);
			nonSelectableFields = nonSelectableFields.concat(getFields());
		}

		Object.keys(fields).forEach((k) => {
			if (nonSelectableFields.includes(k) || nonSelectableFields.includes(k.split(API.v1.fieldSeparator)[0])) {
				delete fields[k];
			}
		});
	}

	// Limit the fields by default
	fields = Object.assign({}, fields, API.v1.defaultFieldsToExclude);
	if (this.request.route.includes('/v1/users.')) {
		if (hasPermission(this.userId, 'view-full-other-user-info')) {
			fields = Object.assign(fields, API.v1.limitedUserFieldsToExcludeIfIsPrivilegedUser);
		} else {
			fields = Object.assign(fields, API.v1.limitedUserFieldsToExclude);
		}
	}

	let query = {};
	if (this.queryParams.query) {
		try {
			query = EJSON.parse(this.queryParams.query);
			query = clean(query, pathAllowConf[this.request.route] || pathAllowConf.def);
		} catch (e) {
			this.logger.warn(`Invalid query parameter provided "${this.queryParams.query}":`, e);
			throw new Meteor.Error('error-invalid-query', `Invalid query parameter provided: "${this.queryParams.query}"`, {
				helperMethod: 'parseJsonQuery',
			});
		}
	}

	// Verify the user has permission to query the fields they are
	if (typeof query === 'object') {
		let nonQueryableFields = Object.keys(API.v1.defaultFieldsToExclude);
		if (this.request.route.includes('/v1/users.')) {
			if (hasPermission(this.userId, 'view-full-other-user-info')) {
				nonQueryableFields = nonQueryableFields.concat(Object.keys(API.v1.limitedUserFieldsToExcludeIfIsPrivilegedUser));
			} else {
				nonQueryableFields = nonQueryableFields.concat(Object.keys(API.v1.limitedUserFieldsToExclude));
			}
		}

		Object.keys(query).forEach((k) => {
			if (nonQueryableFields.includes(k) || nonQueryableFields.includes(k.split(API.v1.fieldSeparator)[0])) {
				delete query[k];
			}
		});
	}

	return {
		sort,
		fields,
		query,
	};
});
