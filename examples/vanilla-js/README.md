## JavaScript Example

This example showcases how to integrate the Content Advisor in a JavaScript app.

> **Prerequisites:** Your organization must be provisioned for Content Advisor. See [Prerequisites](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-advisor/content-advisor-properties#prereqs) on Experience League.

### Launching the JavaScript App

The JavaScript app includes two different examples that you can use:

1. `index.html` - showcases a simple version of the Content Advisor example.
2. `integration.html` - showcases a complex end-to-end example of the Content Advisor.

To launch the JavaScript app, follow these steps:

1. Make sure you have Node.js installed on your system.
2. Copy `.env.example` to `.env` and add your IMS Client ID:

   ```bash
   cp .env.example .env
   # edit .env and set IMS_CLIENT_ID
   ```

   > In order to obtain an `IMS_CLIENT_ID` you will need to raise a support ticket with Adobe. Client Id's created via Adobe Developer Console will **not** work for Content Advisor.

3. Start the dev server:

   ```bash
   node serve.mjs
   ```

   This will start a local HTTP server on port 8080 and inject your Client ID into the examples.

4. Open a web browser and navigate to `http://localhost:8080` to view the app.

### Using simple example (index.html)

1. Once the app is launched, click on the "Select Assets with Ims Flow" button to launch the Content Advisor dialog with built in auth flow.
2. If the user is signed in, the Content Advisor dialog will be rendered.
3. If the user is not signed in, the app will open a popup/full page reload to prompt the user to sign in before accessing the Content Advisors dialog.
   - Note: By default, if the user is not signed in, we show a popup for the user to login. However, the popup must be enabled for this to work. Alternatively, you can check if the user's browser popup is disabled and instead trigger the full page reload to sign in. You can control that flow by passing the prop `modalMode: false` to `registerContentAdvisorAuthService`.
4. You can now select the desired assets, and the app will save your selected assets.

### Using complex example (integration.html)

1. Once the app is launched, navigate to [`integration.html`](http://localhost:8080/integration.html) to view the end-to-end integration example.
2. Click on the "+ placeholder" button to launch the Content Advisor dialog with built in auth flow.
3. If the user is signed in, the Content Advisor dialog will be rendered with assets.
4. When you select an asset, the app will render the selected asset.

### Detail panel customization example (detail-panel.html)

> **Limited availability:** this only takes effect for integrations whose `apiKey` Adobe has enabled for detail panel customization.

1. Once the app is launched, navigate to `http://localhost:8080/detail-panel.html?apiKey=<your-key>` with an Adobe-enabled key supplied at runtime. The page displays the key in use; neither mode falls back to the IMS client ID. Do not hardcode the key in source.
2. Choose Content Advisor (`renderContentAdvisorWithAuthFlow`) or Asset Selector (`renderAssetSelectorWithAuthFlow`), each with sync and async map buttons. Asset Selector uses exactly `featureSet: ['advisor']` to match the customer configuration.
3. Open an asset's details (info action). The first **Info** tab is rendered by `detailPanelInfoPopoverMap` in [`detail-panel.js`](./detail-panel.js).
4. The filter panel is customized by [`filter-schema.js`](./filter-schema.js) (`filterSchema`, `filterSchemaSource`, `filterSchemaDefaults`), and Content Advisor opens pre-filtered to images. Filter panel customization works for every integration.

See the [detail panel customization guide](../../docs/content-advisor-detail-panel-customization.md) for the full `infoPopoverMap` reference.

Visit the following URL to test out the deployed example that is showcased in [integration.html][selectors-vanillajs-demo].

[selectors-vanillajs-demo]: https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/integration/integration.html
