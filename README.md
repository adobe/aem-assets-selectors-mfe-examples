## Assets Selectors - Code Examples

Assets Selectors contains a collection of components such as AssetSelector and DestinationSelector from [Adobe Experience Manager Assets as a Cloud Service][aem-cs-wiki] (AEM CS). These components follow the [Micro Frontend architecture][microfrontend-wiki] and are consumable in your application via convenient JavaScript APIs to search, browse, and retrieve digital assets available in the AEM CS repository.

The _AssetSelector_ component allows you to select and retrieve assets, while the _DestinationSelector_ component enables you to choose a destination to save or move assets to.

This repository provides **runnable code examples** for integrating Assets Selectors in various frameworks, including Vanilla JavaScript, React, and Angular. For full API documentation, properties reference, and customization guides, see the [Documentation](#documentation) section below.

## Contents

- [Prerequisites](#prerequisites)
- [Distribution](#distribution)
- [Runnable Demos](#runnable-demos)
- [Documentation](#documentation)
- [Framework Examples](#framework-examples)
  - [JavaScript - UMD](#example---javascript-umd)
  - [JavaScript - ESM (importMap)](#example---javascript-esm-importmap)
  - [React (importMap via ESM CDN)](#example---react-importmap-via-esm-cdn)
  - [Angular](#example---angular)
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

## Framework Examples

Minimal snippets showing the shape of integration in each framework. Every snippet follows the same two-step pattern: **(1)** register the auth service on page/component load, then **(2)** render the selector with the built-in auth flow. The full runnable projects in [`examples/`](./examples) show the same APIs with a richer UI shell around them.

> **About `imsOrg`** — Setting `imsOrg: "your-aem-assets-repository-ims-org"` pins the selector to a specific org. Omitting it (or passing `null`) lets the repository switcher show all orgs the authenticated user belongs to — the runnable examples in this repo default to `null` so they work out of the box without additional environment variables. Swap in your org ID for a single-tenant integration.
>
> For the full prop reference including `AssetSelectorProps`, `DestinationSelectorProps`, and `ImsAuthProps`, see the [Documentation](#documentation) table above.

### Example - JavaScript UMD

UMD exposes the API on a global `PureJSSelectors`. Full example: [`examples/vanilla-js/`](./examples/vanilla-js).

```html
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>
<div id="asset-selector-container"></div>

<script>
  PureJSSelectors.registerAssetsSelectorsAuthService({
    imsClientId: '<IMS_CLIENT_ID>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUrl: window.location.href,
  });

  PureJSSelectors.renderAssetSelectorWithAuthFlow(
    document.getElementById('asset-selector-container'),
    {
      imsOrg: null, // or "your-aem-assets-repository-ims-org" to pin to a single org
      handleSelection: (assets) => { /* ... */ },
    }
  );
</script>
```

For `DestinationSelector`, swap `renderAssetSelectorWithAuthFlow` → `renderDestinationSelectorWithAuthFlow` and `handleSelection` → `onConfirm`.

### Example - JavaScript ESM (importMap)

ESM exposes the same functions as named exports via an [importMap][import-maps-wiki]. Your project must resolve React and ReactDOM; the map below pulls them from esm.sh.

```html
<script type="importmap">
{
  "imports": {
    "@assets/selectors": "https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/@assets/selectors/index.js",
    "react": "https://esm.sh/react@18.2.0",
    "react-dom": "https://esm.sh/react-dom@18.2.0"
  }
}
</script>
<div id="asset-selector-container"></div>

<script type="module">
  import { registerAssetsSelectorsAuthService, renderAssetSelectorWithAuthFlow } from '@assets/selectors';

  registerAssetsSelectorsAuthService({
    imsClientId: '<IMS_CLIENT_ID>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUrl: window.location.href,
  });

  renderAssetSelectorWithAuthFlow(
    document.getElementById('asset-selector-container'),
    {
      imsOrg: null, // or "your-aem-assets-repository-ims-org" to pin to a single org
      handleSelection: (assets) => { /* ... */ },
    }
  );
</script>
```

### Example - React (importMap via ESM CDN)

ESM also exports React components: `AssetSelector`, `AssetSelectorWithAuthFlow`, `DestinationSelector`, `DestinationSelectorWithAuthFlow`. Full example: [`examples/react/`](./examples/react).

**Using the built-in auth flow** — the most common path:

```jsx
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { AssetSelectorWithAuthFlow, registerAssetsSelectorsAuthService } from '@assets/selectors';

const App = () => {
  useEffect(() => {
    registerAssetsSelectorsAuthService({
      imsClientId: '<IMS_CLIENT_ID>',
      imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
      redirectUrl: window.location.href,
    });
  }, []);

  return (
    <AssetSelectorWithAuthFlow
      imsOrg={null} // or "your-aem-assets-repository-ims-org" to pin to a single org
      handleSelection={(assets) => { /* ... */ }}
    />
  );
};

createRoot(document.getElementById('root')).render(<App />);
```

**Bring your own `imsToken`** — use the plain `<AssetSelector />` when your app already has a valid token:

```jsx
import { AssetSelector } from '@assets/selectors';

<AssetSelector
  imsOrg={null}
  imsToken="<YOUR_VALID_IMS_TOKEN>"
  handleSelection={(assets) => { /* ... */ }}
/>
```

### Example - Angular

Angular consumes the UMD build via a `<script>` in `index.html` and the global `PureJSSelectors`. Full example: [`examples/angular/`](./examples/angular).

```ts
declare const PureJSSelectors: any;

@Component({
  selector: 'asset-selector',
  template: '<div id="asset-selector" style="height: 100vh"></div>',
})
export class AssetSelectorComponent implements OnInit, AfterViewInit {
  ngOnInit() {
    PureJSSelectors.registerAssetsSelectorsAuthService({
      imsClientId: '<IMS_CLIENT_ID>',
      imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
      redirectUrl: window.location.href,
    });
  }

  ngAfterViewInit() {
    PureJSSelectors.renderAssetSelectorWithAuthFlow(
      document.getElementById('asset-selector'),
      {
        imsOrg: null, // or "your-aem-assets-repository-ims-org" to pin to a single org
        handleSelection: (assets: unknown) => { /* ... */ },
      }
    );
  }
}
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

<!-- links -->
[aem-cs-wiki]: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/assets/home.html
[microfrontend-wiki]: https://en.wikipedia.org/wiki/Microfrontend
[import-maps-wiki]: https://github.com/WICG/import-maps
