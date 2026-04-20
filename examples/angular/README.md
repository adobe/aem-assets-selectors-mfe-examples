## Angular Example

This example showcases how to integrate the AssetSelector in an Angular app. The project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.

> **Prerequisites:** Your organization must be provisioned for Assets Selectors. See [Prerequisites](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector#prereqs) on Experience League.

### Configuration

IMS values are read from a local **`.env`** file (not committed). Copy the example and set your client ID:

```bash
cp .env.example .env
```

- **`ASSET_SELECTOR_IMS_CLIENT_ID`** (required) — same idea as `VITE_ASSET_SELECTOR_IMS_CLIENT_ID` in the React example.
- **`ASSET_SELECTOR_IMS_ORG`** (optional) — same as `VITE_ASSET_SELECTOR_IMS_ORG` in React; if omitted or empty, **`imsOrg` is `null`** in the app.

Running **`npm start`** or **`npm run build`** runs **`set-env.mjs`**, which writes **`src/environments/environment.ts`** and **`environment.prod.ts`** from **`.env`**. Those two files are **gitignored** so IMS values are not committed; see **`src/environments/environment.example.ts`** for the expected shape.

After **`npm install`**, **`prepare`** creates empty **`environment.ts`** / **`environment.prod.ts`** if they are missing (both are **gitignored**), then runs **`set-env.mjs`** when **`.env`** exists. Add **`.env`** and run **`node set-env.mjs`** (or **`npm start`**) to fill in your IMS client id.

### Launching the Angular App

1. Make sure you have the [Angular CLI](https://angular.io/cli) installed.
2. Install the dependencies:

   ``` bash
   npm install
   ```

3. Create `.env` from `.env.example` and set **`ASSET_SELECTOR_IMS_CLIENT_ID`** (see above).

4. Start the dev server:

   ``` bash
   npm start
   ```

5. Open a web browser and navigate to `http://localhost:8080/` to view the app.
