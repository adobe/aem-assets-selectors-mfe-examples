## Assets Selectors - Code Examples

Assets Selectors contains a collection of components such as AssetSelector and DestinationSelector from [Adobe Experience Manager Assets as a Cloud Service][aem-cs-wiki] (AEM CS). These components follow the [Micro Frontend architecture][microfrontend-wiki] and are consumable in your application via convenient JavaScript APIs to search, browse, and retrieve digital assets available in the AEM CS repository.

This repository provides **runnable code examples** for integrating Assets Selectors in various frameworks, including Vanilla JavaScript, React, and Angular. For full API documentation, properties reference, and customization guides, see the [Documentation](#documentation) section below.

## Prerequisites

Before running these examples, ensure that your organization has been provisioned to access Assets Selectors as part of the AEM Assets as a Cloud Service profile. After provisioning, you will receive an `imsClientId`, `imsScope`, and `redirectUrl` that are required for authentication.

For full details on prerequisites and provisioning, see the [Asset Selector Overview](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector#prereqs) on Experience League.

## Documentation

For complete documentation on Assets Selectors, visit the following Experience League pages:

| Topic | Link |
|-------|------|
| Overview | [Micro-Frontend Asset Selector Overview](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/overview-asset-selector) |
| Properties Reference | [Asset Selector Properties](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-properties) |
| Customizations | [Asset Selector Customizations](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-customization) |
| Usage Examples | [Asset Selector Examples](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-examples) |
| Upload | [Asset Selector Upload](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-upload) |
| Collections | [Asset Selector Collections](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-collections) |
| Integration (Vanilla JS) | [Integrate Asset Selector using Vanilla JS](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-integration/integrate-asset-selector) |
| Integration (Adobe apps) | [Integrate with Adobe Applications](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-integration/integrate-asset-selector-adobe-app) |
| Integration (non-Adobe) | [Integrate with Non-Adobe Applications](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-integration/integrate-asset-selector-non-adobe-app) |
| Dynamic Media OpenAPI | [Integrate with Dynamic Media Open APIs](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/asset-selector/asset-selector-integration/integrate-asset-selector-dynamic-media-open-api) |

## Running the Examples

Each example directory contains a self-contained project with its own instructions:

- **[Vanilla JavaScript](./examples/vanilla-js/)** - Plain HTML/CSS/JS using the UMD build from Adobe CDN
- **[React](./examples/react/)** - React 18 + Vite application
- **[Angular](./examples/angular/)** - Angular 14 application

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

<!-- links -->
[aem-cs-wiki]: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/assets/home.html
[microfrontend-wiki]: https://en.wikipedia.org/wiki/Microfrontend
