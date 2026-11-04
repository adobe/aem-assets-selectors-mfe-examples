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
 * Content Advisor filter panel customization (`filterSchema`, `filterSchemaSource`,
 * `filterSchemaDefaults`). Used by ContentAdvisorWrapper.jsx when VITE_ENABLE_FILTER_SCHEMA_CUSTOMIZATION=true.
 * Reference: ../../../docs/content-advisor-detail-panel-customization.md#customizing-the-filter-panel
 *
 * Every field below works on both delivery and author repositories.
 */

// An array of groups. Each group renders as one collapsible section in the filter panel.
export const contentAdvisorFilterSchema = [
    {
        header: 'File Type',
        groupKey: 'FileTypeGroup',
        fields: [
            {
                element: 'checkbox',
                name: 'type',
                options: [
                    { label: 'Images', value: 'image/*' },
                    { label: 'Documents', value: 'text/*,application/*' },
                    { label: 'Videos', value: 'video/*' },
                ],
                orientation: 'vertical',
            },
        ],
    },
    {
        header: 'MIME Type',
        groupKey: 'MimeTypeGroup',
        fields: [
            {
                element: 'checkbox',
                name: 'dc:format',
                options: [
                    { label: 'JPG', value: 'image/jpeg' },
                    { label: 'PNG', value: 'image/png' },
                    { label: 'TIFF', value: 'image/tiff' },
                    { label: 'GIF', value: 'image/gif' },
                    { label: 'MP4', value: 'video/mp4' },
                    { label: 'PDF', value: 'application/pdf' },
                ],
                columns: 3,
            },
        ],
    },
    {
        header: 'Image Size',
        groupKey: 'SizeGroup',
        fields: [
            {
                element: 'Number',
                name: 'property=tiff:imageWidth',
                label: 'Width',
                range: true,
                orientation: 'horizontal',
                columns: 2,
            },
            {
                element: 'Number',
                name: 'property=tiff:imageLength',
                label: 'Height',
                range: true,
                orientation: 'horizontal',
                columns: 2,
            },
        ],
    },
    {
        header: 'File Size',
        groupKey: 'FileSizeGroup',
        fields: [
            {
                element: 'Number',
                name: 'property=repo:size',
                label: 'File Size (bytes)',
                range: true,
                orientation: 'horizontal',
            },
        ],
    },
    {
        header: 'Expiration',
        groupKey: 'ExpirationGroup',
        fields: [
            {
                element: 'DateRange',
                name: 'property=pur:expirationDate',
                label: 'Expiration Date',
                orientation: 'horizontal',
            },
        ],
    },
];

// 'custom': always render contentAdvisorFilterSchema (recommended; explicit and predictable).
// 'hybrid-merge-deep': merge it with the author repository's saved search form, matching fields by
//   property name. On a shared field this schema wins (default value, read-only), and missing
//   options are added from the saved form. Faceted fields keep the saved form's live options and
//   label. Fields only in the saved form are added after this schema's groups. If no saved form is
//   available, this schema is used as-is.
// 'saved' (the default): use this schema if one is passed, otherwise the author's saved search form.
//   A few integrations are pinned to saved forms under 'saved'; 'custom' avoids that.
export const contentAdvisorFilterSchemaSource = 'custom';

// Initial filter values, keyed by field name. Plain ('tiff:imageWidth') and 'property=' names both
// work. The value has the same shape as a field's defaultValue: ['...'] for checkboxes,
// [{ min, max }] for number ranges (the array is required), { start, end } for date ranges.
// These win over any defaultValue in the schema. Entries for fields that aren't rendered are ignored.
export const contentAdvisorFilterSchemaDefaults = [{ name: 'type', defaultValue: ['image/*'] }];

export const getFilterSchemaCustomizationProps = () => ({
    filterSchema: contentAdvisorFilterSchema,
    filterSchemaSource: contentAdvisorFilterSchemaSource,
    filterSchemaDefaults: contentAdvisorFilterSchemaDefaults,
});
