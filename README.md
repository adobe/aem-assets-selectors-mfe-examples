## Assets Selectors - Code Examples

Assets Selectors contains a collection of components such as AssetSelector and DestinationSelector from [Adobe Experience Manager Assets as a Cloud Service][aem-cs-wiki] (AEM CS). These components follow the [Micro Frontend architecture][microfrontend-wiki] and are consumable in your application via convenient JavaScript APIs to search, browse, and retrieve digital assets available in the AEM CS repository.

This repository provides **runnable code examples** for integrating Assets Selectors in various frameworks, including Vanilla JavaScript, React, and Angular. For full API documentation, properties reference, and customization guides, see the [Documentation](#documentation) section below.

## Prerequisites

Before running these examples, ensure that your organization has been provisioned to access Assets Selectors as part of the AEM Assets as a Cloud Service profile. If you have not been provisioned, your program admin should raise a P2 support ticket from Admin Console including:

- Program ID and Environment ID for the AEM CS instance
- Domain names where the integrating application is hosted

After provisioning, your organization will be provided with an `imsClientId`, `imsScope`, and a `redirectUrl` corresponding to the environment you request — which are essential for the configuration of Assets Selectors to work end-to-end. For further details, see the [Asset Selector Overview](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector#prereqs) on Experience League.

## Quick Start

Assets Selectors is distributed via Adobe CDN in two flavors: UMD (global `PureJSSelectors`) and ESM (named exports via importMap). Below are the smallest possible integrations — for framework-specific setup, see the [examples/](./examples/) directory.

### UMD

```html
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>

<script>
  // 1. Register the Assets Selectors Auth Service on page load
  PureJSSelectors.registerAssetsSelectorsAuthService({
    imsClientId: '<IMS_CLIENT_ID>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUri: window.location.href
  });

  // 2. Render the AssetSelector with the built-in auth flow
  PureJSSelectors.renderAssetSelectorWithAuthFlow(
    document.getElementById('asset-selector-container'),
    {
      imsOrg: '<YOUR_IMS_ORG>',
      handleSelection: (assets) => { /* ... */ }
    }
  );
</script>

<div id="asset-selector-container"></div>
```

### ESM (importMap)

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

<script type="module">
  import { registerAssetsSelectorsAuthService, renderAssetSelectorWithAuthFlow } from '@assets/selectors';

  registerAssetsSelectorsAuthService({
    imsClientId: '<IMS_CLIENT_ID>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUri: window.location.href
  });

  renderAssetSelectorWithAuthFlow(
    document.getElementById('asset-selector-container'),
    { imsOrg: '<YOUR_IMS_ORG>', handleSelection: (assets) => { /* ... */ } }
  );
</script>
```

> The same pattern applies to `DestinationSelector` / `renderDestinationSelectorWithAuthFlow` — replace the component name and use `onConfirm` instead of `handleSelection`.

## Documentation

For complete documentation on Assets Selectors, visit the following Experience League pages:

| Topic | What you'll find | Link |
|-------|------------------|------|
| Overview | What Asset Selector is, provisioning prerequisites, architecture | [Micro-Frontend Asset Selector Overview](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector) |
| Properties Reference | Full prop tables for `AssetSelector`, `DestinationSelector`, and `ImsAuthProps` | [Asset Selector Properties](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-properties) |
| Customizations | Filters, i18n, theming, feature flags, repository switching | [Asset Selector Customizations](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-customization) |
| Usage Examples | Additional framework- and scenario-specific snippets | [Asset Selector Examples](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-examples) |
| Dynamic Media OpenAPI | Integrating with Dynamic Media Open APIs | [Integrate with Dynamic Media Open APIs](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-integration/integrate-asset-selector-dynamic-media-open-api) |

## Running the Examples

Each example directory contains a self-contained project with its own instructions:

- **[Vanilla JavaScript](./examples/vanilla-js/)** — Plain HTML/CSS/JS using the UMD build from Adobe CDN
- **[React](./examples/react/)** — React 18 + Vite application
- **[Angular](./examples/angular/)** — Angular 14 application

## Migration Note

Standalone prop-reference documents previously under `docs/` (`AssetSelectorProps.md`, `DestinationSelectorProps.md`, `FilterSchema.md`, `FilterFormProps.md`, `ImsAuthProps.md`, `ImsAuthService.md`, `SelectedAssetType.md`, `SelectedDestinationType.md`) have been consolidated into the Experience League pages linked in the [Documentation](#documentation) table above.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

<!-- links -->
[aem-cs-wiki]: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/assets/home.html
[microfrontend-wiki]: https://en.wikipedia.org/wiki/Microfrontend
