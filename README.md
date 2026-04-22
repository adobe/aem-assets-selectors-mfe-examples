## Assets Selectors - Code Examples

Assets Selectors contains a collection of components such as AssetSelector and DestinationSelector from [Adobe Experience Manager Assets as a Cloud Service][aem-cs-wiki] (AEM CS). These components follow the [Micro Frontend architecture][microfrontend-wiki] and are consumable in your application via convenient JavaScript APIs to search, browse, and retrieve digital assets available in the AEM CS repository.

The _AssetSelector_ component allows you to select and retrieve assets, while the _DestinationSelector_ component enables you to choose a destination to save or move assets to.

This repository provides **runnable code examples** for integrating Assets Selectors in various frameworks, including Vanilla JavaScript, React, and Angular. For full API documentation, properties reference, and customization guides, see the [Documentation](#documentation) section below.

## Contents

- [Prerequisites](#prerequisites)
- [Distribution](#distribution)
- [Examples](#examples)
  - [JavaScript - UMD](#example---javascript-umd)
  - [JavaScript - ESM (importMap)](#example---javascript-esm-importmap)
  - [React with importMap via ESM CDN](#example---react-with-importmap-via-esm-cdn)
  - [Angular](#example---angular)
- [Runnable Demos](#runnable-demos)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Licensing](#licensing)

## Prerequisites

Before running these examples, ensure that your organization has been provisioned to access Assets Selectors as part of the AEM Assets as a Cloud Service profile. If you have not been provisioned, your program admin should raise a P2 support ticket from Admin Console including:

- Program ID and Environment ID for the AEM CS instance
- Domain names where the integrating application is hosted

After provisioning, your organization will be provided with an `imsClientId`, `imsScope`, and a `redirectUrl` corresponding to the environment you request — which are essential for the configuration of Assets Selectors to work end-to-end. For further details, see the [Asset Selector Overview](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector#prereqs) on Experience League.

## Distribution

Assets Selectors is available via both ESM CDN (think esm.sh/skypack) and UMD version.

In browsers using UMD version:

```html
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>

<script>
  const { renderAssetSelector } = PureJSSelectors;
</script>
```

In browsers with [`importMap`][import-maps-wiki] support using ESM CDN version:

```html
<script type="module">
  import { AssetSelector } from 'https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js'
</script>
```

In Deno/Webpack Module Federation using ESM CDN version:

```js
import { AssetSelector } from 'https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js'
```

## Examples

Assets Selectors allows you to integrate the AssetSelector and DestinationSelector components into your application using vanilla JavaScript, React, Angular, and other frameworks. Below are some examples of how you can make use of these components in your application.

### Example - JavaScript UMD

Assets Selectors UMD version exposes a global variable `PureJSSelectors` which exposes the Asset Selector and Destination Selector APIs. Below is an example of how you can use the Asset Selector and Destination Selector components in your application using the built-in auth flow. For a more complete and runnable code, refer to the [Vanilla JavaScript demo](./examples/vanilla-js).

#### AssetSelector Usage

```js
// 1. Include the CDN link in your script tag
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>

// 2. Register the Assets Selectors Auth Service on document load
// Note: it is recommended that you call registerAssetsSelectorsAuthService before you call renderAssetSelectorWithAuthFlow
PureJSSelectors.registerAssetsSelectorsAuthService({
    imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUri: window.location.href
});

// 3. Render the AssetSelector component with built in auth flow
const props = {
    imsOrg: "your-aem-assets-repository-ims-org",
    handleSelection: (assets) => {
        ...
    }
}

PureJSSelectors.renderAssetSelectorWithAuthFlow(document.getElementById('asset-selector-container'), props);
```

#### DestinationSelector Usage

```js
// 1. Include the CDN link in your script tag
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>

// 2. Register the Assets Selectors Auth Service on document load
// Note: it is recommended that you call registerAssetsSelectorsAuthService before you call renderDestinationSelectorWithAuthFlow
PureJSSelectors.registerAssetsSelectorsAuthService({
    imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUri: window.location.href
});

// 3. Render the DestinationSelector component with built in auth flow
const props = {
    imsOrg: "your-aem-assets-repository-ims-org",
    onConfirm: (selectedDestination) => {
        ...
    }
}

PureJSSelectors.renderDestinationSelectorWithAuthFlow(document.getElementById('destination-selector-container'), props);
```

```html
<!-- In your HTML file where AssetSelector or DestinationSelector will be rendered on to the container element -->
<div id="asset-selector-container"></div>
<div id="destination-selector-container"></div>
```

### Example - JavaScript ESM (importMap)

Assets Selectors ESM CDN version exposes `PureJSSelectors` as a named export, as well as React JSX components for Asset Selector and Destination Selector APIs. It takes advantage of the browser's [importMap][import-maps-wiki] feature, which allows you to define a mapping of import names to URLs — similar to a package manager like npm or yarn, but without the need for a build step.

> Note: if your project does not have React as a dependency, you will need to include React and ReactDOM in your importMap.

#### AssetSelector Usage

```js
// 1. Supply the browser with importMap specifier
<script type="importmap">
  {
    "imports": {
      "@assets/selectors": "https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js",
      "react": "https://esm.sh/react@18.2.0",
      "react-dom": "https://esm.sh/react-dom@18.2.0"
    }
  }
</script>

<script type="module">
  // 2. Import the Assets Selectors components from the alias
  import { registerAssetsSelectorsAuthService, renderAssetSelectorWithAuthFlow } from '@assets/selectors';

  // 3. Register the Assets Selectors Auth Service
  // Note: it is recommended that you call registerAssetsSelectorsAuthService before you call renderAssetSelectorWithAuthFlow
  registerAssetsSelectorsAuthService({
      imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
      imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
      redirectUri: window.location.href
  });

  // 4. Render the AssetSelector component with built in auth flow
  const props = {
      imsOrg: "your-aem-assets-repository-ims-org",
      handleSelection: (assets) => {
          ...
      }
  }
  renderAssetSelectorWithAuthFlow(document.getElementById('asset-selector-container'), props);
</script>
```

#### DestinationSelector Usage

```js
// 1. Supply the browser with importMap specifier
<script type="importmap">
  {
    "imports": {
      "@assets/selectors": "https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js",
      "react": "https://esm.sh/react@18.2.0",
      "react-dom": "https://esm.sh/react-dom@18.2.0"
    }
  }
</script>

<script type="module">
  // 2. Import the Assets Selectors components from the alias
  import { registerAssetsSelectorsAuthService, renderDestinationSelectorWithAuthFlow } from '@assets/selectors';

  // 3. Register the Assets Selectors Auth Service
  // Note: it is recommended that you call registerAssetsSelectorsAuthService before you call renderDestinationSelectorWithAuthFlow
  registerAssetsSelectorsAuthService({
      imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
      imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
      redirectUri: window.location.href
  });

  // 4. Render the DestinationSelector component with built in auth flow
  const props = {
      imsOrg: "your-aem-assets-repository-ims-org",
      onConfirm: (selectedDestination) => {
          ...
      }
  }
  renderDestinationSelectorWithAuthFlow(document.getElementById('destination-selector-container'), props);
</script>
```

### Example - React with importMap via ESM CDN

Assets Selectors ESM CDN version also exposes `AssetSelector`, `AssetSelectorWithAuthFlow`, `DestinationSelector`, `DestinationSelectorWithAuthFlow`, and `registerAssetsSelectorsAuthService` as React JSX components.

> Note: if your project does not have React as a dependency, you will need to include React and ReactDOM in your importMap. For a more complete and runnable code, refer to the [React demo](./examples/react).

#### AssetSelector Usage (simple — you already have an `imsToken`)

Use the plain `<AssetSelector />` component when you've already obtained a valid `imsToken` through your own auth flow. This is the most lightweight integration.

```jsx
// 1. Supply the browser with importMap specifier
<script type="importmap">
  {
    "imports": {
      "@assets/selectors": "https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js",
      "react": "https://esm.sh/react@18.2.0",
      "react-dom": "https://esm.sh/react-dom@18.2.0"
    }
  }
</script>

<script type="module">
  import React from 'react';
  import { createRoot } from 'react-dom/client';

  // 2. Import the AssetSelector component from the alias
  import { AssetSelector } from '@assets/selectors';

  const App = () => {
    // 3. Provide your existing imsToken and other props
    const props = {
        imsOrg: "your-aem-assets-repository-ims-org",
        imsToken: "<YOUR_VALID_IMS_TOKEN>",
        handleSelection: (assets) => {
            ...
        }
    }

    return <AssetSelector {...props} />;
  }

  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

#### AssetSelector Usage (with built-in auth flow)

Use `<AssetSelectorWithAuthFlow />` when you want the component to handle the Adobe login flow for you.

```jsx
// 1. Supply the browser with importMap specifier
<script type="importmap">
  {
    "imports": {
      "@assets/selectors": "https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js",
      "react": "https://esm.sh/react@18.2.0",
      "react-dom": "https://esm.sh/react-dom@18.2.0"
    }
  }
</script>

<script type="module">
  import React, { useEffect } from 'react';
  import { createRoot } from 'react-dom/client';

  // 2. Import the Assets Selectors components from the alias
  import { AssetSelectorWithAuthFlow, registerAssetsSelectorsAuthService } from '@assets/selectors';

  const App = () => {
    // 3. Register the Assets Selectors Auth Service on component load
    // Note: it is recommended that you call registerAssetsSelectorsAuthService before rendering AssetSelectorWithAuthFlow
    const imsAuthProps = {
        imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
        imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
        redirectUri: window.location.href
    };

    useEffect(() => {
        registerAssetsSelectorsAuthService(imsAuthProps);
    }, []);

    // 4. Return and render the AssetSelector component with built in auth flow
    const props = {
        imsOrg: "your-aem-assets-repository-ims-org",
        handleSelection: (assets) => {
            ...
        }
    }

    return <AssetSelectorWithAuthFlow {...props} />;
  }

  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

#### DestinationSelector Usage

```jsx
// 1. Supply the browser with importMap specifier
<script type="importmap">
  {
    "imports": {
      "@assets/selectors": "https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js",
      "react": "https://esm.sh/react@18.2.0",
      "react-dom": "https://esm.sh/react-dom@18.2.0"
    }
  }
</script>

<script type="module">
  import React, { useEffect } from 'react';
  import { createRoot } from 'react-dom/client';

  // 2. Import the Assets Selectors components from the alias
  import { DestinationSelectorWithAuthFlow, registerAssetsSelectorsAuthService } from '@assets/selectors';

  const App = () => {
    // 3. Register the Assets Selectors Auth Service on component load
    // Note: it is recommended that you call registerAssetsSelectorsAuthService before rendering DestinationSelectorWithAuthFlow
    const imsAuthProps = {
        imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
        imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
        redirectUri: window.location.href
    };

    useEffect(() => {
        registerAssetsSelectorsAuthService(imsAuthProps);
    }, []);

    // 4. Return and render the DestinationSelector component with built in auth flow
    const props = {
        imsOrg: "your-aem-assets-repository-ims-org",
        onConfirm: (selectedDestination) => {
            ...
        }
    }

    return <DestinationSelectorWithAuthFlow {...props} />;
  }

  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

### Example - Angular

You can use the Assets Selectors ESM CDN/UMD version in your Angular application. The following example shows how to use the Assets Selectors in Angular.

> Note: Assets Selectors depend on React, so you must resolve React as a dependency before you can use the Assets Selectors in your Angular application. For a more complete and runnable code, refer to the [Angular demo](./examples/angular).

#### AssetSelector Usage

```ts
// 1. Include the CDN link in your index.html script tag
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>

// component code
@Component({
  selector: 'asset-selector',
  template: '<div id="asset-selector"></div>'
})

export class AssetSelectorComponent implements OnInit, AfterViewInit {
  ngOnInit() {
      // 2. Register the Assets Selectors Auth Service on component load
      // Note: it is recommended that you call registerAssetsSelectorsAuthService before calling renderAssetSelectorWithAuthFlow
      const imsAuthProps = {
          imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
          imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
          redirectUri: window.location.href
      };
      PureJSSelectors.registerAssetsSelectorsAuthService(imsAuthProps);
  }

  ngAfterViewInit() {
      // 3. Render the AssetSelector component with built in auth flow
      const props = {
          imsOrg: "your-aem-assets-repository-ims-org",
          handleSelection: (assets) => {
              ...
          }
      }
      PureJSSelectors.renderAssetSelectorWithAuthFlow(document.getElementById('asset-selector'), props);
  }
}
```

#### DestinationSelector Usage

```ts
// 1. Include the CDN link in your index.html script tag
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>

// component code
@Component({
  selector: 'destination-selector',
  template: '<div id="destination-selector"></div>'
})

export class DestinationSelectorComponent implements OnInit, AfterViewInit {
  ngOnInit() {
      // 2. Register the Assets Selectors Auth Service on component load
      // Note: it is recommended that you call registerAssetsSelectorsAuthService before calling renderDestinationSelectorWithAuthFlow
      const imsAuthProps = {
          imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
          imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
          redirectUri: window.location.href
      };
      PureJSSelectors.registerAssetsSelectorsAuthService(imsAuthProps);
  }

  ngAfterViewInit() {
      // 3. Render the DestinationSelector component with built in auth flow
      const props = {
          imsOrg: "your-aem-assets-repository-ims-org",
          onConfirm: (selectedDestination) => {
              ...
          }
      }
      PureJSSelectors.renderDestinationSelectorWithAuthFlow(document.getElementById('destination-selector'), props);
  }
}
```

```html
<!-- In your template, AssetSelector/DestinationSelector will be rendered anywhere you're using this selector -->
<asset-selector></asset-selector>
<destination-selector></destination-selector>
```

## Runnable Demos

Each example directory contains a self-contained project with its own instructions:

- **[Vanilla JavaScript](./examples/vanilla-js/)** — Plain HTML/CSS/JS using the UMD build from Adobe CDN
- **[React](./examples/react/)** — React 18 + Vite application
- **[Angular](./examples/angular/)** — Angular 14 application

## Documentation

For complete documentation on Assets Selectors — including full property reference, `ImsAuthProps`, customization guides, and scenario-specific examples — visit the following Experience League pages:

| Topic | What you'll find | Link |
|-------|------------------|------|
| Overview | What Asset Selector is, provisioning prerequisites, architecture | [Micro-Frontend Asset Selector Overview](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector) |
| Properties Reference | Full prop tables for `AssetSelector`, `DestinationSelector`, and `ImsAuthProps` | [Asset Selector Properties](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-properties) |
| Customizations | Filters, i18n, theming, feature flags, repository switching | [Asset Selector Customizations](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-customization) |
| Usage Examples | Additional framework- and scenario-specific snippets | [Asset Selector Examples](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-examples) |
| Dynamic Media OpenAPI | Integrating with Dynamic Media Open APIs | [Integrate with Dynamic Media Open APIs](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-integration/integrate-asset-selector-dynamic-media-open-api) |

### Usage Data

By default, Assets Selectors collect usage data to help improve the product. If you wish to opt out of any usage data collection, you can do so by setting the `disableTracking` property to `true` in the AssetSelector or DestinationSelector props. See the [Properties Reference](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-properties) for details.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

<!-- links -->
[aem-cs-wiki]: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/assets/home.html
[microfrontend-wiki]: https://en.wikipedia.org/wiki/Microfrontend
[import-maps-wiki]: https://github.com/WICG/import-maps
