import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";
import { ucsbDiningCommonsMenuItemsFixtures } from 'fixtures/ucsbDiningCommonsMenuItemsFixtures';

export default {
    title: 'pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage',
    component: UCSBDiningCommonsMenuItemsEditPage
};

const Template = () => <UCSBDiningCommonsMenuItemsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbdiningcommonsmenuitems', (_req, res, ctx) => {
            return res(ctx.json(ucsbDiningCommonsMenuItemsFixtures.threeItems[0]));
        }),
        rest.put('/api/ucsbdiningcommonsmenuitems', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



