import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createContext, runInContext } from 'node:vm';

function loadExample(search = '?apiKey=runtime-key') {
    const calls = [];
    const elements = new Map();
    const context = createContext({
        URLSearchParams, Intl, setTimeout,
        navigator: { language: 'en-US' },
        window: {
            location: { href: 'http://localhost:8080/detail-panel.html', search },
            matchMedia: () => ({ matches: false }),
        },
        document: {
            getElementById(id) {
                if (!elements.has(id)) {
                    elements.set(id, {
                        textContent: '', hidden: true, open: false,
                        showModal() { this.open = true; },
                        close() { this.open = false; },
                    });
                }
                return elements.get(id);
            },
        },
        PureJSSelectors: {
            registerContentAdvisorAuthService: () => ({}),
            ...Object.fromEntries([
                'renderContentAdvisorWithAuthFlow', 'renderAssetSelectorWithAuthFlow',
            ].map((api) => [api, (container, props, onRendered) => {
                calls.push({ api, container, props });
                onRendered();
            }])),
        },
    });
    for (const file of ['filter-schema.js', 'detail-panel.js']) {
        runInContext(readFileSync(new URL(file, import.meta.url), 'utf8'), context);
    }
    return { context, calls, elements };
}

test('both APIs launch sync and async maps with the current runtime key', async () => {
    const { context, calls, elements } = loadExample();
    assert.equal(elements.get('api-key-value')?.textContent, 'runtime-key');
    const html = readFileSync(new URL('detail-panel.html', import.meta.url), 'utf8');
    const buttons = [...html.matchAll(/<button onclick="([^"]+)">([^<]+)<\/button>/g)];
    for (const [api, features] of [
        ['renderContentAdvisorWithAuthFlow', ['upload', 'collections', 'advisor']],
        ['renderAssetSelectorWithAuthFlow', ['advisor']],
    ]) {
        for (const asyncMap of [false, true]) {
            context.window.location.search = `?apiKey=${api}-${asyncMap}`;
            const label = `${api} (${asyncMap ? 'async' : 'sync'} map)`;
            const button = buttons.find((match) => match[2] === label);
            assert.ok(button, `Missing launch button: ${label}`);
            runInContext(button[1], context);
            const { props, api: actualApi } = calls.at(-1);
            assert.equal(actualApi, api);
            assert.equal(props.apiKey, `${api}-${asyncMap}`);
            assert.equal(elements.get('api-key-value').textContent, props.apiKey);
            assert.deepEqual(Array.from(props.featureSet), features);
            const rows = await props.infoPopoverMap({ 'dc:title': 'Example asset' });
            assert.equal(rows[0].value, 'Example asset');
            assert.equal(rows.some((row) => row.label === 'CUSTOM Used in (from host app)'), asyncMap);
            assert.equal(elements.get('content-advisor-dialog').open, true);
            props.handleSelection([{ id: 'selected-asset' }]);
            assert.equal(elements.get('content-advisor-dialog').open, false);
            assert.deepEqual(JSON.parse(elements.get('selection-output').textContent), [{ id: 'selected-asset' }]);
        }
    }
});

test('missing or blank runtime keys block both APIs with a visible error', () => {
    for (const search of ['', '?apiKey=', '?apiKey=%20%20']) {
        const { context, calls, elements } = loadExample(search);
        runInContext('renderContentAdvisorWithCustomDetailPanel()', context);
        assert.equal(calls.length, 0);
        runInContext('renderAssetSelectorWithCustomDetailPanel()', context);
        assert.equal(calls.length, 0);
        assert.equal(elements.get('detail-panel-error').hidden, false);
        assert.match(elements.get('detail-panel-error').textContent, /apiKey/);
        context.window.location.search = '?apiKey=provided-at-runtime';
        runInContext('renderAssetSelectorWithCustomDetailPanel()', context);
        assert.equal(calls.at(-1).props.apiKey, 'provided-at-runtime');
        assert.equal(elements.get('detail-panel-error').hidden, true);
    }
});
