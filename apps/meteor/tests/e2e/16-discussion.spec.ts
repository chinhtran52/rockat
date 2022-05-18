import { test, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

import Discussion from './utils/pageobjects/Discussion';
import LoginPage from './utils/pageobjects/LoginPage';
import SideNav from './utils/pageobjects/SideNav';
import MainContent from './utils/pageobjects/MainContent';
import { adminLogin } from './utils/mocks/userAndPasswordMock';

test.describe('[Discussion]', () => {
	let page: Page;
	let loginPage: LoginPage;
	let discussion: Discussion;
	let sideNav: SideNav;
	let mainContent: MainContent;

	let discussionName: string;
	let message: string;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		loginPage = new LoginPage(page);
		discussion = new Discussion(page);
		sideNav = new SideNav(page);
		mainContent = new MainContent(page);
		await loginPage.goto('/');
		await loginPage.login(adminLogin);
	});

	test.describe('[Create discussion from screen]', () => {
		test('expect discussion is created', async () => {
			discussionName = faker.animal.type();
			message = faker.animal.type();
			await sideNav.newChannelBtnToolbar().click();
			await discussion.createDiscussion('public channel', discussionName, message);
		});
	});

	test.describe('[Create discussion from context menu]', () => {
		test.beforeAll(async () => {
			discussionName = `${faker.animal.type()}`;
			message = `${faker.animal.type()}`;
			await sideNav.findForChat('general');
			await mainContent.sendMessage(message);
		});

		test('expect show a dialog for starting a discussion', async () => {
			await mainContent.openMessageActionMenu();
			await discussion.createDiscussionInContext(message);
		});
	});
});
