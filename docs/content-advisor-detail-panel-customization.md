# Customizing the Content Advisor Detail Panel (`infoPopoverMap`)

> **Limited availability.** This capability is enabled by Adobe on a per-integration basis. It only takes
> effect once Adobe has enabled it for your integration's `apiKey`. If your integration has not been enabled,
> the prop is silently ignored and Content Advisor renders the standard detail panel. Contact your Adobe
> representative before you build on it.

Content Advisor shows a **detail panel** when a user opens an asset with the info (ⓘ) action. By default the
panel shows tabs defined by your **Assets view metadata forms** (for example *Basic*, *Product*, *Tags*), plus
a **Dynamic Media** tab when licensed.

The `infoPopoverMap` property lets your application **replace the first tab of the detail panel** with an
**Info** tab you define. Your code chooses which metadata fields appear, the labels, how values are formatted,
and the layout (heading, two-column, or full-width).

## Contents

- [Requirements](#requirements)
- [Quick start](#quick-start)
- [API reference](#api-reference)
  - [Signature](#signature)
  - [Returned item shape](#returned-item-shape)
  - [Render types](#render-types)
  - [Empty values and fallbacks](#empty-values-and-fallbacks)
- [The `metadata` argument](#the-metadata-argument)
  - [Delivery vs. author repositories](#delivery-vs-author-repositories)
- [Synchronous vs. asynchronous maps](#synchronous-vs-asynchronous-maps)
- [Where your function runs (important)](#where-your-function-runs-important)
- [Tab placement behavior](#tab-placement-behavior)
- [Recipes](#recipes)
- [Customizing the filter panel](#customizing-the-filter-panel)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)
- [Runnable examples](#runnable-examples)

## Requirements

All three conditions must be true for the custom **Info** tab to render:

| # | Requirement | How to satisfy it |
|---|-------------|-------------------|
| 1 | **Content Advisor (advisor) mode is on** | Pass `featureSet` with `'advisor'` in it, for example `featureSet: ['upload', 'collections', 'advisor']`. If you pass `featureSet`, it replaces the default (`['upload', 'collections']`), so list every feature you want. |
| 2 | **Adobe has enabled your `apiKey`** | Adobe enables the capability for a specific `apiKey`. With `renderContentAdvisorWithAuthFlow` / `<ContentAdvisorWithAuthFlow />`, `apiKey` defaults to your `imsClientId`. If Adobe gave you a different `apiKey`, pass it explicitly. If you pass your own `imsToken` to `renderContentAdvisor` / `<ContentAdvisor />`, **always pass `apiKey` explicitly**. |
| 3 | **`infoPopoverMap` is a function** | Pass a function (see [Signature](#signature)). Any other value is ignored. |

There is one more pre-condition. The detail panel needs a metadata form to resolve for the asset. On
**delivery** repositories the panel always uses Adobe's bundled default forms, so this is satisfied
automatically. On **author** repositories it uses the Assets view metadata form for the asset; if none
resolves, the panel shows *"No metadata form available"* and the Info tab is not shown.

The usual Content Advisor provisioning prerequisites also apply (HTTPS host, allowlisted redirect URL,
provisioned `imsClientId`). See [Content Advisor prerequisites][ca-prereqs].

## Quick start

**UMD (vanilla JavaScript)**

```html
<script src="https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js"></script>
<div id="content-advisor" style="height: 100vh"></div>
<script>
  PureJSSelectors.registerContentAdvisorAuthService({
    imsClientId: '<YOUR_IMS_CLIENT_ID>',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUrl: window.location.href,
  });

  // (metadata, intl) => Array<{ label, value, renderType, defaultValue }>
  function infoPopoverMap(metadata) {
    return [
      { renderType: 'title', label: 'Asset', value: metadata['dc:title'] || metadata['repo:name'] },
      { renderType: 'col', label: 'Format', value: metadata['dc:format'] },
      { renderType: 'col', label: 'Size', value: metadata['repo:size'] ? `${Math.round(metadata['repo:size'] / 1024)} KB` : '' },
      { renderType: 'row', label: 'Description', value: metadata['dc:description'], defaultValue: 'No description' },
    ];
  }

  PureJSSelectors.renderContentAdvisorWithAuthFlow(document.getElementById('content-advisor'), {
    imsOrg: null,
    featureSet: ['upload', 'collections', 'advisor'],
    aemTierType: ['delivery', 'author'], // delivery = approved/published assets
    // apiKey: '<YOUR_ENABLED_API_KEY>', // only if Adobe gave you an apiKey different from your imsClientId
    infoPopoverMap,
    handleSelection: (assets) => console.log(assets),
  });
</script>
```

**React (ESM)**

```jsx
import { ContentAdvisorWithAuthFlow } from '@assets/selectors';

// Define the map OUTSIDE the component (or memoize it) so its identity is stable.
// The panel re-runs the map whenever the function reference changes.
const infoPopoverMap = (metadata) => [
  { renderType: 'title', label: 'Asset', value: metadata['dc:title'] || metadata['repo:name'] },
  { renderType: 'col', label: 'Format', value: metadata['dc:format'] },
  { renderType: 'row', label: 'Path', value: metadata['repo:path'] },
];

export const Picker = () => (
  <ContentAdvisorWithAuthFlow
    imsOrg={null}
    featureSet={['upload', 'collections', 'advisor']}
    aemTierType={['delivery', 'author']}
    infoPopoverMap={infoPopoverMap}
    handleSelection={(assets) => console.log(assets)}
  />
);
```

## API reference

### Signature

```ts
type InfoPopoverMap = (
  metadata: Record<string, unknown>,
  intl: IntlLike
) => InfoItem[] | Promise<InfoItem[]>;
```

| Argument | Description |
|----------|-------------|
| `metadata` | A flattened metadata object for the asset currently open in the detail panel. See [The `metadata` argument](#the-metadata-argument). |
| `intl` | A *subset* of Content Advisor's internal `react-intl` object: `locale`, `defaultLocale`, `messages`, and `format*` helpers (`formatDate`, `formatNumber`, `formatMessage`, …). When you use the CDN/UMD build, the helpers are proxied across an iframe and **return Promises**. For predictable results, use your own `Intl.*` / `toLocaleString` APIs and use `intl.locale` only to choose the locale. |

The function is called each time a different asset opens in the detail panel. It is also called again if the
function reference or the locale changes.

### Returned item shape

Return an **array** of plain objects. Anything other than an array is treated as an empty list.

```ts
type InfoItem = {
  label?: string;                 // field label (rendered small, above the value)
  value?: string | number;        // field value (rendered as plain text)
  renderType?: 'title' | 'col' | 'row'; // layout; defaults to 'row'
  defaultValue?: string;          // shown when `value` is empty
};
```

### Render types

| `renderType` | Rendering |
|--------------|-----------|
| `'title'` | A prominent heading. `label` (if set) appears as a small caption above it. Use this once at the top. |
| `'col'` | Consecutive `col` items are packed into a responsive grid. It shows **two columns** in a normal panel and collapses to one column when narrow (for example in `rail` mode). Any non-`col` item ends the group. |
| `'row'` | A full-width label/value block. This is also used for a missing or unknown `renderType`. |

Items render **in the order you return them**.

Values render as **plain text** (no HTML or JSX), and whitespace is preserved, so `\n` produces a line break.
Long values wrap.

### Empty values and fallbacks

The displayed value is resolved in this order:

1. `value`
2. `defaultValue`
3. `-`

The check is **truthy**, so `0`, `''`, `null`, `undefined` and `false` all fall through. To display a literal
zero, pass it as a string: `value: String(count)`.

## The `metadata` argument

`metadata` is a single flat object that merges the asset's repository fields, its embedded **asset
metadata**, and its embedded **application metadata**. Keys keep their namespaced names. For example:

| Key | Example meaning |
|-----|-----------------|
| `repo:name` | File name |
| `repo:path` | Repository path |
| `repo:size` | Size in bytes (number) |
| `repo:createDate`, `repo:modifyDate` | ISO 8601 timestamps |
| `repo:id`, `repo:assetId` | Asset identifiers |
| `repo:repositoryId` | AEM host the asset belongs to. Delivery hosts start with `delivery-` |
| `dc:format` | MIME type, for example `image/jpeg` |
| `dc:title`, `dc:description` | Title / description (may be a string **or** an array, depending on the schema) |
| `dam:assetStatus` | Approval status, for example `approved` |
| `tiff:ImageWidth`, `tiff:ImageLength` | Pixel dimensions. Delivery items also carry `tiff:imageWidth` / `tiff:imageLength` |
| `xmp:Rating` | Rating |
| *custom* | Any custom properties in your metadata schema (for example `myco:campaignId`) |

The exact keys depend on the asset type, your AEM metadata schema, and the repository tier. Inspect the
object once during development:

```js
const infoPopoverMap = (metadata) => {
  console.log('detail panel metadata', metadata); // runs in YOUR page - see below
  return [];
};
```

Write the map defensively. Treat every key as optional, and normalize values that may be arrays or
language-alternative objects:

```js
const text = (v) => (Array.isArray(v) ? v.filter(Boolean).join(', ') : v == null ? '' : String(v));
```

### Delivery vs. author repositories

Content Advisor can browse **delivery** repositories (approved, published assets), **author**
repositories, or both, as set by `aemTierType`, for example `aemTierType: ['delivery', 'author']`. The
custom Info tab works the same on both, but a few details differ on delivery:

- **Metadata comes from the Delivery API.** The asset's `repositoryMetadata` and `assetMetadata` are
  flattened into `metadata`. You get the same `repo:*`, `dc:*`, `dam:*` and `tiff:*` keys, plus any custom
  properties that the Delivery API returns for the asset.
- **Dimension keys appear in two casings.** Delivery items carry `tiff:ImageWidth` / `tiff:ImageLength`
  and also `tiff:imageWidth` / `tiff:imageLength`. Read both:
  `m['tiff:ImageWidth'] || m['tiff:imageWidth']`.
- **You can tell the tier from `repo:repositoryId`.** Delivery hosts start with `delivery-`, for example
  `delivery-p123-e456.adobeaemcloud.com`.
- **No metadata-form setup is needed.** Delivery uses Adobe's bundled default forms, so *"No metadata form
  available"* does not occur there.

```js
const tier = String(m['repo:repositoryId'] || '').startsWith('delivery-') ? 'Delivery' : 'Author';
// { renderType: 'col', label: 'Repository', value: tier }
```

## Synchronous vs. asynchronous maps

The function may return an array **or a Promise of an array**. While a Promise is pending, the Info tab shows
a loading indicator. This lets you enrich the panel with data from your own systems:

```js
async function infoPopoverMap(metadata) {
  const assetId = metadata['repo:assetId'] || metadata['repo:id'];
  let usage = '';
  try {
    const res = await fetch(`/api/asset-usage?id=${encodeURIComponent(assetId)}`);
    usage = res.ok ? String((await res.json()).count) : '';
  } catch { /* fall back to defaultValue */ }
  return [
    { renderType: 'title', label: 'Asset', value: metadata['repo:name'] },
    { renderType: 'row', label: 'Used in campaigns', value: usage, defaultValue: 'Unknown' },
  ];
}
```

If the Promise rejects (or the function throws), the Info tab renders empty and an error is logged to the
browser console with the prefix `[Assets Selectors] infoPopoverMap threw:`. It is good practice to catch
errors yourself and return fallback items.

## Where your function runs (important)

Content Advisor runs inside an Adobe-hosted iframe. **Your `infoPopoverMap` runs in your own page**, not in
the iframe. Arguments and return values are passed between the two with `postMessage`. As a result:

- **Return only serializable data**: plain objects, strings, and numbers. Do not return DOM nodes, React
  elements, class instances, or functions; they will not survive the transfer.
- **You can use your page's context**: your own state, `fetch` with your cookies/headers, feature flags, and
  so on.
- **`intl.format*` helpers are asynchronous proxies** when you use the CDN build. Prefer native `Intl`.
- **Keep the function reference stable.** In React, define it outside the component, or wrap it in
  `useCallback`/`useMemo`. A new function on every render re-triggers the map.

## Tab placement behavior

When the custom Info tab is active:

1. Your **Info** tab is inserted as the **first** tab and is selected by default. Its label is
   the localized string "Info".
2. It **replaces the first tab** of the metadata form configured in Assets view, which is usually *Basic*.
3. **All other metadata-form tabs** (for example *Product*, *Campaign*, *Tags*) still follow, in their
   configured order.
4. The **Dynamic Media** tab, when available, is kept and remains last.

If you need the content of the replaced first tab, include those fields in your map.

## Recipes

### Human-readable size and dates in the user's locale

```js
const formatBytes = (bytes, locale) => {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0; let n = Number(bytes);
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i += 1; }
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n)} ${units[i]}`;
};
const formatDate = (iso, locale) =>
  iso ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '';

const infoPopoverMap = (m, intl) => {
  const locale = intl?.locale || navigator.language;
  return [
    { renderType: 'col', label: 'Size', value: formatBytes(m['repo:size'], locale) },
    { renderType: 'col', label: 'Modified', value: formatDate(m['repo:modifyDate'], locale) },
  ];
};
```

### Dimensions and status side by side

```js
{ renderType: 'col', label: 'Dimensions',
  // author: tiff:ImageWidth/ImageLength; delivery items also carry tiff:imageWidth/imageLength
  value: (() => {
    const w = m['tiff:ImageWidth'] || m['tiff:imageWidth'];
    const h = m['tiff:ImageLength'] || m['tiff:imageLength'];
    return w && h ? `${w} × ${h} px` : '';
  })() },
{ renderType: 'col', label: 'Status', value: m['dam:assetStatus'], defaultValue: 'Not reviewed' },
```

### Multi-line values

```js
{ renderType: 'row', label: 'Keywords', value: [].concat(m['dc:subject'] || []).join('\n') },
```

### Your own labels (localization)

Labels are rendered as-is, so localize them yourself, for example by using `intl.locale` to pick from your
own message bundle.

## Customizing the filter panel

The examples also customize the filter panel, which complements a customized detail panel. Unlike
`infoPopoverMap`, these props are **generally available**: they work for every integration and need no
`apiKey` enablement. The `filterSchema` format is documented on Experience League under
[Customize filter panel][ca-filter-panel].

| Prop | Type | Purpose |
|------|------|---------|
| `filterSchema` | `FilterGroup[]` | The groups and fields rendered in the filter panel. |
| `filterSchemaSource` | `'saved'` (default) \| `'custom'` \| `'hybrid-merge-deep'` | How `filterSchema` combines with the author repository's saved search form. |
| `filterSchemaDefaults` | `{ name, defaultValue }[]` | The filters applied when Content Advisor opens. |

```js
filterSchema: [
    {
        header: 'File Type',
        groupKey: 'FileTypeGroup',
        fields: [{
            element: 'checkbox',
            name: 'type',
            options: [
                { label: 'Images', value: 'image/*' },
                { label: 'Documents', value: 'text/*,application/*' },
                { label: 'Videos', value: 'video/*' },
            ],
        }],
    },
    {
        header: 'Image Size',
        groupKey: 'SizeGroup',
        fields: [
            { element: 'Number', name: 'property=tiff:imageWidth', label: 'Width', range: true },
            { element: 'Number', name: 'property=tiff:imageLength', label: 'Height', range: true },
        ],
    },
],
filterSchemaSource: 'custom',
filterSchemaDefaults: [{ name: 'type', defaultValue: ['image/*'] }],
```

**Groups and fields.** Each group (`header`, a unique `groupKey`, `fields`) renders as one collapsible
section. The field `element`s used in the examples are `'checkbox'` (with `options` and an optional
`columns`), `'Number'` with `range: true`, and `'DateRange'`. A field's `name` is the search predicate:

- `type`: the broad file type, such as `image/*`. One option value can hold several comma-separated MIME types, with no spaces.
- `dc:format`: an exact MIME type.
- `property=<metadata key>`: a metadata property, for example `property=tiff:imageWidth`,
  `property=repo:size` or `property=pur:expirationDate`.

On **delivery** repositories, Content Advisor rewrites these predicates for delivery search:
`type`, `dc:format`, `tiff:imageWidth`, `tiff:imageLength`, `repo:size`, `repo:createDate`,
`repo:modifyDate` and `pur:expirationDate`. Fields on other custom metadata properties, such as
`property=metadata.application.xcm:keywords.value`, are designed for **author** repositories. Test them on
delivery before relying on them there.

**Options.** On a checkbox option, `readOnly: true` makes the option checked and locked when it is also a
default. On the field, `readOnly: true` locks the entire field. Use either to enforce a filter the user cannot
remove.

**`filterSchemaSource`**

- `'custom'` (recommended): always render your `filterSchema`.
- `'hybrid-merge-deep'`: merge your `filterSchema` with the author repository's saved search form, matching
  fields by property name.
  - On a field both define, your settings win (default value, read-only), and options missing from yours are
    added from the saved form.
  - Faceted fields keep the saved form's live options and label.
  - Fields that exist only in the saved form are added after your groups.
  - If no saved form is available, your schema is used as-is.
- `'saved'` (default): your `filterSchema` is used if you pass one; otherwise the saved search form (author) or
  Content Advisor's default filters (delivery). Set `'custom'` explicitly for predictable results.

**`filterSchemaDefaults`** sets initial filter values without restating the schema. It works with any
`filterSchemaSource`, including filters that come from a saved search form.

- `name`: the field's property name. The plain form (`tiff:imageWidth`) and the `property=` form
  (`property=tiff:imageWidth`) both work.
- `defaultValue`: the same shape as a field's own `defaultValue`.
  - Checkboxes: `['image/*']`.
  - Number ranges: `[{ min: 1000, max: 2000 }]`. The array is required; a bare `{ min, max }` is silently ignored.
  - Date ranges: `{ start, end }`.
- On conflicts, a value here wins over the schema's own `defaultValue`.
- Entries for fields that aren't rendered are ignored.

## Troubleshooting

| Symptom | Likely cause / fix |
|---------|--------------------|
| The standard detail panel shows and there is no custom Info tab | One of the [requirements](#requirements) is not met. Check: (1) `featureSet` includes `'advisor'`; (2) the `apiKey` in use is the one Adobe enabled (in DevTools → Network, check the `x-api-key` request header from Content Advisor); (3) `infoPopoverMap` is a function. |
| Content Advisor shows the classic Asset Selector UI (no advisor features) | Advisor mode is not on. Add `'advisor'` to `featureSet`, and confirm your org is provisioned for Content Advisor. |
| "No metadata form available" | Author repositories only: no Assets view metadata form resolves for this asset. Configure a metadata form in Assets view. (Delivery repositories use bundled default forms.) |
| No delivery repository in the repository picker | Include `'delivery'` in `aemTierType`, and confirm the environment has delivery (approved) assets your user can access. |
| The Info tab shows a spinner forever | Your function returned a Promise that never settles. Add timeouts to your `fetch` calls. |
| The Info tab is empty | Your function returned a non-array, an empty array, or threw. Check the console for `[Assets Selectors] infoPopoverMap threw:`. |
| Every field shows `-` | The keys you read do not exist on this asset. Log `metadata` once to see the available keys. |
| `0` shows as `-` | Values are checked for truthiness. Pass `String(0)`. |
| The map runs repeatedly | The function reference changes on each render. Hoist or memoize it. |
| Your `filterSchema` is not shown (saved search form or default filters instead) | Set `filterSchemaSource: 'custom'`. Also check that `filterSchema` is a non-empty array of groups. |
| A `filterSchemaDefaults` number range is not applied | Wrap the value in an array: `[{ min, max }]`. A bare `{ min, max }` is ignored. |
| A filter returns no results on delivery | The predicate is not one delivery search supports. See [Customizing the filter panel](#customizing-the-filter-panel). |

## Limitations

- Plain-text values only: no links, images, icons, or custom components.
- One custom tab. It always takes the first-tab position and is always labeled "Info".
- Read-only. It cannot edit metadata.
- Applies to the Content Advisor (advisor) detail panel. In the classic Asset Selector UI, the same function
  powers the legacy info popover.
- This capability is not part of the public Experience League property reference. Its behavior may change,
  and it is supported only for integrations Adobe has enabled.

## Runnable examples

- **Vanilla JavaScript**: [`examples/vanilla-js/detail-panel.html`](../examples/vanilla-js/detail-panel.html)
  plus [`detail-panel.js`](../examples/vanilla-js/detail-panel.js) and, for the filter panel,
  [`filter-schema.js`](../examples/vanilla-js/filter-schema.js). Run `node serve.mjs` in
  `examples/vanilla-js` and open `http://localhost:8080/detail-panel.html`.
- **React**: [`examples/react/src/detailPanelInfoPopoverMap.js`](../examples/react/src/detailPanelInfoPopoverMap.js)
  and [`examples/react/src/contentAdvisorFilterSchema.js`](../examples/react/src/contentAdvisorFilterSchema.js).
  Set `VITE_ENABLE_DETAIL_PANEL_CUSTOMIZATION=true` (and optionally `VITE_API_KEY`) and
  `VITE_ENABLE_FILTER_SCHEMA_CUSTOMIZATION=true` in `examples/react/.env`.

[ca-prereqs]: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-advisor/content-advisor-properties#prereqs
[ca-filter-panel]: https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/content-advisor/content-advisor-customization#customize-filter-panel
