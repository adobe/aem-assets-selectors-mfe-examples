## JavaScript Example

This example showcases how to integrate the AssetSelector in a JavaScript app.

### Launching the JavaScript App

The JavaScript app includes two different examples that you can launch:

1. `index.html` - showcases a simple version of the AssetSelector example.
2. `integration.html` - showcases a complex end-to-end example of the AssetSelector.

To launch the JavaScript app, follow these steps:

1. Make sure you have `npx` or `python` installed on your system.
2. Run the following command in your command line interface:

   ``` bash
   npx http-server -a localhost -p 8080
    
    # OR
   python -m http.server 8080
   ```

   This will start a local HTTP server on port 8080.

3. Open a web browser and navigate to `localhost:8080` to view the app.

### Using simple example (index.html)

1. Once the app is launched, click on the "Select Assets with Ims Flow" button to launch the AssetSelector dialog with built in auth flow.
2. If the user is signed in, the AssetSelector dialog will be rendered.
3. If the user is not signed in, the app will open a popup/full page reload to prompt the user to sign in before accessing the AssetSelectors dialog.
   - Note: By default, if the user is not signed in, we show a popup for the user to login. However, the popup must be enabled for this to work. Alternatively, you can check if the user's browser popup is disabled and instead trigger the full page reload to sign in. You can control that flow by passing the prop `modalMode: false` to `registerAssetsSelectorsAuthService`.
4. You can now select the desired assets, and the app will save your selected assets.

### Using complex example (integration.html)

1. Once the app is launched, navigate to [`integration.html`](https://localhost:8080:integration.html) to view the end-to-end integration example.
2. Click on the "+ placeholder" button to launch the AssetSelector dialog with built in auth flow.
3. If the user is signed in, the AssetSelector dialog will be rendered with assets.
4. When you select an asset, the app will render the selected asset.

Visit the following URL to test out the deployed example that is showcased in [integration.html][selectors-vanillajs-demo]

[selectors-vanillajs-demo]: https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/integration/integration.html
