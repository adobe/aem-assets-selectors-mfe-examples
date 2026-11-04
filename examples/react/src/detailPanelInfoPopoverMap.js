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
 * Full reference: ../../../docs/content-advisor-detail-panel-customization.md
 *
 * Defined at module scope on purpose: the detail panel re-runs the map whenever the
 * function reference changes, so keep it stable (module scope, useCallback or useMemo).
 */

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

/**
 * (metadata, intl) => Array<{ label, value, renderType: 'title' | 'col' | 'row', defaultValue }>
 * Runs in the host page; return only plain, serializable objects (no JSX).
 */
export const detailPanelInfoPopoverMap = (metadata = {}, intl) => {
    const locale = intl?.locale || navigator.language;
    const width = metadata['tiff:ImageWidth'] || metadata['tiff:imageWidth'];
    const height = metadata['tiff:ImageLength'] || metadata['tiff:imageLength'];
    const tier = String(metadata['repo:repositoryId'] || '').startsWith('delivery-') ? 'Delivery' : 'Author';

    return [
        { renderType: 'title', label: 'Asset', value: text(metadata['dc:title']) || text(metadata['repo:name']) },
        { renderType: 'col', label: 'Format', value: text(metadata['dc:format']), defaultValue: 'Unknown' },
        { renderType: 'col', label: 'Size', value: formatBytes(metadata['repo:size'], locale) },
        { renderType: 'col', label: 'Repository', value: tier },
        { renderType: 'col', label: 'Dimensions', value: width && height ? `${width} × ${height} px` : '' },
        { renderType: 'col', label: 'Status', value: text(metadata['dam:assetStatus']), defaultValue: 'Not reviewed' },
        { renderType: 'col', label: 'Created', value: formatDate(metadata['repo:createDate'], locale) },
        { renderType: 'col', label: 'Modified', value: formatDate(metadata['repo:modifyDate'], locale) },
        {
            renderType: 'row',
            label: 'Description',
            value: text(metadata['dc:description']),
            defaultValue: 'No description provided',
        },
        { renderType: 'row', label: 'Keywords', value: [].concat(metadata['dc:subject'] || []).map(text).join('\n') },
        { renderType: 'row', label: 'Path', value: text(metadata['repo:path']) },
    ];
};

/**
 * Props to spread onto <ContentAdvisor /> / <ContentAdvisorWithAuthFlow /> to turn on the
 * customized detail panel. `apiKey` is only needed when Adobe enabled an apiKey that differs from
 * your imsClientId (with the auth flow, apiKey defaults to imsClientId).
 */
export const getDetailPanelCustomizationProps = ({ apiKey } = {}) => ({
    // Passing featureSet replaces the default ['upload', 'collections'], so keep the defaults.
    featureSet: ['upload', 'collections', 'advisor'],
    ...(apiKey ? { apiKey } : {}),
    infoPopoverMap: detailPanelInfoPopoverMap,
});
