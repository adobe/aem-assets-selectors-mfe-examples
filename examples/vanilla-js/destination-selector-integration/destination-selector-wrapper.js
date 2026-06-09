function init() {
    renderDestinationSelectorWithAuthFlow();
    function renderDestinationSelectorWithAuthFlow(props) {
        const defaultImsAuthInfo = window['assetsSelectorsAuthService'];
        const destinationSelectorsProps = {
            onClose: onClose,
            onConfirm: onConfirm,
            env: defaultImsAuthInfo.env === 'stg1' ? 'stage' : 'prod',
            imsOrg: defaultImsAuthInfo.imsOrg || null,
            // Match the host page's active theme (toggle override, else OS preference).
            colorScheme: window.getActiveColorScheme
                ? window.getActiveColorScheme()
                : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light',
        };

        const container = document.getElementById(
            'destination-selector-dialog-content'
        );

        PureJSSelectors.renderDestinationSelectorWithAuthFlow(
            container,
            destinationSelectorsProps,
            () => {
                // callback function to be called after the MFE is rendered
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
