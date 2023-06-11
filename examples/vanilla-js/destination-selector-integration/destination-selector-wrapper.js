function init() {
    renderDestinationSelectorWithAuthFlow();
    function renderDestinationSelectorWithAuthFlow(props) {
        const defaultImsAuthInfo = window['assetsSelectorsAuthService'];
        const destinationSelectorsProps = {
            onClose: onClose,
            onConfirm: onConfirm,
            env: defaultImsAuthInfo.env === 'stg1' ? 'stage' : 'prod',
            imsOrg: defaultImsAuthInfo.imsOrg || null,
        };

        const container = document.getElementById(
            'destination-selector-dialog-content'
        );

        PureJSSelectors.renderDestinationSelectorWithAuthFlow(
            container,
            destinationSelectorsProps,
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

    async function onConfirm(destination) {
        const event = new CustomEvent('onDestinationSelectedEvent', {
            detail: destination,
        });

        window.dispatchEvent(event);
    }
}

init();
