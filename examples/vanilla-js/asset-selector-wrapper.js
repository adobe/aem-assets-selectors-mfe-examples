/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

function init() {
    renderAssetSelectorWithAuthFlow();
    function renderAssetSelectorWithAuthFlow(props) {
        const defaultImsAuthInfo = window['assetsSelectorsAuthService'];
        const assetsSelectorsProps = {
            onClose: onClose,
            handleSelection: handleSelection,
            env: defaultImsAuthInfo.env === "stg1" ? 'stage' : 'prod',
            imsOrg: defaultImsAuthInfo.imsOrg || null,
        };

        const container = document.getElementById('asset-selector-dialog-content');

        PureJSSelectors.renderAssetSelectorWithAuthFlow(container, assetsSelectorsProps, () => {
            // callback function to be called after the asset selector is rendered
        });
    }

    function onClose() {
        const integrationPropertiesGuideDialog = document.getElementById('integration-properties-guide-dialog');
        integrationPropertiesGuideDialog.close();
    }

    async function handleSelection(assets) {
        const onAssetsSelectedEvent = new CustomEvent('onAssetsSelectedEvent', {
            detail: assets
        });

        window.dispatchEvent(onAssetsSelectedEvent);
    }
}

init();