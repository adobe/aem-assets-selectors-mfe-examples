/*
 * Copyright 2026 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
 * Content Advisor detail panel customization (`infoPopoverMap`).
 * See ../../docs/content-advisor-detail-panel-customization.md for the full reference.
 *
 * Only takes effect when ALL of these are true:
 *   1. `featureSet` contains 'advisor'
 *   2. the integration's apiKey has been enabled for this capability by Adobe
 *      (this example requires an explicit apiKey supplied at runtime)
 *   3. `infoPopoverMap` is a function
 */

// ---------------------------------------------------------------------------
// Helpers - metadata values can be missing, numbers, strings, or arrays.
// ---------------------------------------------------------------------------
const text = (v) => {
    if (v === null || v === undefined) return '';
    if (Array.isArray(v)) return v.map(text).filter(Boolean).join(', ');
    if (typeof v === 'object') return text(v['@value'] ?? v.value ?? Object.values(v)[0]);
    return String(v);
};

const formatBytes = (bytes, locale) => {
    const n0 = Number(bytes);
    if (!Number.isFinite(n0) || n0 < 0) return '';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let n = n0;
    let i = 0;
    while (n >= 1024 && i < units.length - 1) {
        n /= 1024;
        i += 1;
    }
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n)} ${units[i]}`;
};

const formatDate = (iso, locale) => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
        ? ''
        : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(d);
};

// ---------------------------------------------------------------------------
// The map. Runs in THIS page (not in the Content Advisor iframe). Return only plain,
// serializable objects: { label, value, renderType: 'title' | 'col' | 'row', defaultValue }.
// ---------------------------------------------------------------------------
function detailPanelInfoPopoverMap(metadata = {}, intl) {
    // Uncomment once to discover the keys available for your assets / metadata schema:
    // console.log('[detail-panel example] metadata', metadata);

    const locale = (intl && intl.locale) || navigator.language;
    // Delivery items carry both casings; author items use tiff:ImageWidth / tiff:ImageLength.
    const width = metadata['tiff:ImageWidth'] || metadata['tiff:imageWidth'];
    const height = metadata['tiff:ImageLength'] || metadata['tiff:imageLength'];
    // Delivery repository ids start with "delivery-" (e.g. delivery-p123-e456.adobeaemcloud.com).
    const tier = String(metadata['repo:repositoryId'] || '').startsWith('delivery-') ? 'Delivery' : 'Author';

    return [
        // 'title' -> prominent heading at the top of the tab
        {
            renderType: 'title',
            label: 'CUSTOM LABELS ETC.',
            value: text(metadata['dc:title']) || text(metadata['repo:name']),
        },

        // consecutive 'col' items -> packed two-up grid
        { renderType: 'col', label: 'CUSTOM Format', value: text(metadata['dc:format']), defaultValue: 'Unknown' },
        { renderType: 'col', label: 'CUSTOM Size', value: formatBytes(metadata['repo:size'], locale) },
        { renderType: 'col', label: 'CUSTOM Repository', value: tier },
        {
            renderType: 'col',
            label: 'CUSTOM Dimensions',
            value: width && height ? `${width} × ${height} px` : '',
        },
        { renderType: 'col', label: 'CUSTOM Status', value: text(metadata['dam:assetStatus']), defaultValue: 'Not reviewed' },
        { renderType: 'col', label: 'CUSTOM Created', value: formatDate(metadata['repo:createDate'], locale) },
        { renderType: 'col', label: 'CUSTOM Modified', value: formatDate(metadata['repo:modifyDate'], locale) },

        // 'row' -> full-width label/value (also the default when renderType is omitted)
        {
            renderType: 'row',
            label: 'CUSTOM Description',
            value: text(metadata['dc:description']),
            defaultValue: 'No description provided',
        },
        // Values are plain text with whitespace preserved: '\n' renders a line break.
        { renderType: 'row', label: 'CUSTOM Keywords', value: [].concat(metadata['dc:subject'] || []).map(text).join('\n') },
        { renderType: 'row', label: 'CUSTOM Path', value: text(metadata['repo:path']) },

        // Custom schema field example - replace with a property from your own metadata schema.
        // { renderType: 'row', label: 'Campaign', value: text(metadata['myco:campaignId']) },
    ];
}

// Async variant: enrich the panel with data from your own systems. A spinner shows while pending.
// Swap it in by passing `infoPopoverMap: detailPanelInfoPopoverMapAsync` below.
async function detailPanelInfoPopoverMapAsync(metadata = {}, intl) {
    const base = detailPanelInfoPopoverMap(metadata, intl);
    let usage = '';
    try {
        // Replace with a call to your own API. Always bound remote calls with a timeout.
        await new Promise((resolve) => setTimeout(resolve, 300));
        usage = 'Spring campaign, Homepage hero';
    } catch (e) {
        // Fall through to defaultValue; never let the map reject.
    }
    return [...base, { renderType: 'row', label: 'CUSTOM Used in (from host app)', value: usage, defaultValue: 'Unknown' }];
}

// ---------------------------------------------------------------------------
// Auth + render
// ---------------------------------------------------------------------------
// In order to obtain an imsClientId you will need to raise a support ticket with Adobe.
// Client Id's created via Adobe Developer Console will not work for Content Advisor.
const imsProps = {
    imsClientId: '%%IMS_CLIENT_ID%%',
    imsScope: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
    redirectUrl: window.location.href,
    modalMode: true,
};

// Must be registered before Content Advisor is rendered.
const imsInstance = PureJSSelectors.registerContentAdvisorAuthService(imsProps);

function getRuntimeApiKey() {
    const apiKey = new URLSearchParams(window.location.search).get('apiKey')?.trim() || '';
    document.getElementById('api-key-value').textContent = apiKey || '(not provided)';
    return apiKey;
}

getRuntimeApiKey();

function closeDialog() {
    document.getElementById('content-advisor-dialog').close();
}

function handleSelection(selection) {
    document.getElementById('selection-output').textContent = JSON.stringify(selection, null, 2);
    closeDialog();
}

function renderContentAdvisorWithCustomDetailPanel(useAsyncMap = false) {
    renderCustomDetailPanel(useAsyncMap, false);
}

function renderAssetSelectorWithCustomDetailPanel(useAsyncMap = false) {
    renderCustomDetailPanel(useAsyncMap, true);
}

function renderCustomDetailPanel(useAsyncMap, useAssetSelector) {
    const apiKey = getRuntimeApiKey();
    const error = document.getElementById('detail-panel-error');
    error.hidden = Boolean(apiKey);
    error.textContent = apiKey ? '' : 'Provide an Adobe-enabled apiKey in the URL: ?apiKey=<your-key>.';
    if (!apiKey) return;

    const container = document.getElementById('content-advisor');
    const props = {
        imsOrg: '%%IMS_ORG%%',
        // Match the customer's Asset Selector configuration exactly.
        featureSet: useAssetSelector ? ['advisor'] : ['upload', 'collections', 'advisor'],
        apiKey,
        infoPopoverMap: useAsyncMap ? detailPanelInfoPopoverMapAsync : detailPanelInfoPopoverMap,
        // Delivery (approved/published assets) and author repositories.
        aemTierType: ['delivery', 'author'],
        filterSchema: contentAdvisorFilterSchema,
        filterSchemaSource: contentAdvisorFilterSchemaSource,
        filterSchemaDefaults: contentAdvisorFilterSchemaDefaults,
        onClose: closeDialog,
        handleSelection,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    };
    const onRendered = () => {
        document.getElementById('content-advisor-dialog').showModal();
    };

    if (useAssetSelector) {
        PureJSSelectors.renderAssetSelectorWithAuthFlow(container, props, onRendered);
    } else {
        PureJSSelectors.renderContentAdvisorWithAuthFlow(container, props, onRendered);
    }
}

async function signOut() {
    await imsInstance.signOut();
}
