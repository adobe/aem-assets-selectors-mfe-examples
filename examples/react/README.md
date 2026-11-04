## React Example

This example showcases how to integrate the Content Advisor in a React app.

> **Prerequisites:** Your organization must be provisioned for Content Advisor. See [Prerequisites](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-advisor/content-advisor-properties#prereqs) on Experience League.

### Configuration

IMS values are read from a local **`.env`** file (not committed). Copy the example and set your client ID:

```bash
cp .env.example .env
```

- **`VITE_IMS_CLIENT_ID`** (required) — your provisioned IMS client ID.
- **`VITE_IMS_ORG`** (optional) — pin to a single IMS org; if omitted or empty, **`imsOrg` is `null`** and the repository selector is shown.

> In order to obtain an `IMS_CLIENT_ID` you will need to raise a support ticket with Adobe. Client Id's created via Adobe Developer Console will **not** work for Content Advisor.

Vite exposes these to the app via `import.meta.env`.

#### Optional: customized detail panel (`infoPopoverMap`)

> **Limited availability:** this only takes effect for integrations whose `apiKey` Adobe has enabled for detail panel customization.

- **`VITE_ENABLE_DETAIL_PANEL_CUSTOMIZATION=true`** — turns on advisor mode and passes the example map in [`src/detailPanelInfoPopoverMap.js`](./src/detailPanelInfoPopoverMap.js) to `<ContentAdvisorWithAuthFlow />`.
- **`VITE_API_KEY`** (optional) — set this only if Adobe gave you an `apiKey` that differs from `VITE_IMS_CLIENT_ID`.

Open an asset's details in Content Advisor to see the customized **Info** tab. See the [detail panel customization guide](../../docs/content-advisor-detail-panel-customization.md) for the full reference.

#### Optional: customized filter panel (`filterSchema`)

- **`VITE_ENABLE_FILTER_SCHEMA_CUSTOMIZATION=true`**: passes `filterSchema`, `filterSchemaSource` and `filterSchemaDefaults` from [`src/contentAdvisorFilterSchema.js`](./src/contentAdvisorFilterSchema.js). Works for every integration; no `apiKey` enablement is needed. Content Advisor opens pre-filtered to images. See [Customizing the filter panel](../../docs/content-advisor-detail-panel-customization.md#customizing-the-filter-panel).

### Launching the React App

1. Make sure you have `npm` or `yarn` installed on your system.
2. Install the dependencies:

   ``` bash
   yarn install
    # OR
   npm install
   ```

3. Create `.env` from `.env.example` and set **`VITE_IMS_CLIENT_ID`** (see [Configuration](#configuration) above).

4. Start the app:

   ``` bash
   yarn dev
    # OR
   npm run dev
   ```

   This will start a local HTTP server on port 8080.

5. Open a web browser and navigate to `http://localhost:8080` to view the app.

### Using the Web App

1. Once the app is launched, click on the "+ placeholder" button to launch the Content Advisor dialog with auth flow.
2. If the user is signed in, the Content Advisor dialog will be rendered.
3. If the user is not signed in, the app will open a popup/full page reload to prompt the user to sign in before accessing the Content Advisor dialog.
   - Note: By default, if the user is not signed in, we show a popup for the user to login. However, the popup must be enabled for this to work. Alternatively, you can check if the user's browser popup is disabled and instead trigger the full page reload to sign in. You can control that flow by passing the prop `modalMode: false` to `registerContentAdvisorAuthService`.
4. You can now select the desired assets, and the app will render your selected assets in place of the "+ placeholder" icon.

### View Deployed Example

Visit the following URL to test out the deployed example that is showcased in [integration.html][selectors-vanillajs-demo].

[selectors-vanillajs-demo]: https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/integration/integration.html
