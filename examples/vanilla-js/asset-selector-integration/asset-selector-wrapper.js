function init() {
    renderAssetSelectorWithAuthFlow();
    function renderAssetSelectorWithAuthFlow(props) {
        const defaultImsAuthInfo = window['assetsSelectorsAuthService'];
        const assetsSelectorsProps = {
            onClose: onClose,
            handleSelection: handleSelection,
            env: defaultImsAuthInfo.env === 'stg1' ? 'stage' : 'prod',
            imsOrg: defaultImsAuthInfo.imsOrg || null,
        };

        const container = document.getElementById(
            'asset-selector-dialog-content'
        );

        PureJSSelectors.renderAssetSelectorWithAuthFlow(
            container,
            assetsSelectorsProps,
            () => {
                // callback function to be called after the asset selector is rendered
            }
        );
    }

    function onClose() {
        const integrationPropertiesGuideDialog = document.getElementById(
            'integration-properties-guide-dialog'
        );
        integrationPropertiesGuideDialog.close();
    }

    async function handleSelection(assets) {
        const onAssetsSelectedEvent = new CustomEvent('onAssetsSelectedEvent', {
            detail: assets,
        });

        window.dispatchEvent(onAssetsSelectedEvent);
    }
}

init();
