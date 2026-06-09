function init() {
    renderContentAdvisorWithAuthFlow();
    function renderContentAdvisorWithAuthFlow(props) {
        const defaultImsAuthInfo = window['assetsSelectorsAuthService'];
        const contentAdvisorProps = {
            onClose: onClose,
            handleSelection: handleSelection,
            env: defaultImsAuthInfo.env === 'stg1' ? 'stage' : 'prod',
            imsOrg: defaultImsAuthInfo.imsOrg || null,
            aemTierType: ['delivery', 'author'],
            // Match the host page's active theme (toggle override, else OS preference).
            colorScheme: window.getActiveColorScheme
                ? window.getActiveColorScheme()
                : window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light',
        };

        const container = document.getElementById(
            'content-advisor-dialog-content'
        );

        PureJSSelectors.renderContentAdvisorWithAuthFlow(
            container,
            contentAdvisorProps,
            () => {
                // callback invoked after Content Advisor is rendered
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
