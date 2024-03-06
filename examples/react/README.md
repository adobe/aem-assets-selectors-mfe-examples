## README

This example showcases how to integrate the AssetSelector in a React app.

### Launching the React Example

:warning: This repository is intended to serve as a supplemental documentation describing the available APIs and usage examples for integrating Assets Selectors. Before attempting to install or use the Assets Selectors, ensure that your organization has been provisioned to access the Assets Selectors as part of the AEM Assets as a Cloud Service (CS) profile. If you have not been provisioned, you will not be able to successfully integrate or use these components. To request provisioning, your program admin should raise a support ticket marked as P2 from Admin Console and include the following information:

- Program ID and Environment ID for the AEM CS instance
- Domain names where the integrating application is hosted

After provisioning, your organization will be provided with an `imsClientId`, `imsScope`, and a `redirectUrl` corresponding to the environment that you request —which are essential for the configuration of Assets Selectors to work end-to-end. Without those valid properties, you will not be able to run this example

---

The React example app in the can be launched using the following steps:

1. Make sure you have `npm` or `yarn` installed on your system.
2. Install the dependencies

   ``` bash
   yarn install
    # OR
   npm install
   ```

3. Start the app:

   ``` bash
   yarn dev --host localhost
    # OR
   npm run dev --host localhost
   ```

   This will start a local HTTP server on port 8080.
4. Open a web browser and navigate to `http://localhost:8080` to view the app.

### Using the Web App

1. Once the app is launched, click on the "+ placeholder" button to launch the AssetSelector dialog with auth flow.
2. If the user is signed in, the AssetSelector dialog will be rendered.
3. If the user is not signed in, the app will open a popup/full page reload to prompt the user to sign in before accessing the AssetSelector dialog.
   - Note: By default, if the user is not signed in, we show a popup for the user to login. However, the popup must be enabled for this to work. Alternatively, you can check if the user's browser popup is disabled and instead trigger the full page reload to sign in. You can control that flow by passing the prop `modalMode: false` to `registerAssetsSelectorsAuthService`.
4. You can now select the desired assets, and the app will render your selected assets in place of the "+ placeholder" icon.

### View Deployed Example

Visit the following URL to test out the deployed example that is showcased in [integration.html][selectors-vanillajs-demo]:

[selectors-vanillajs-demo]: https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/integration/integration.html
