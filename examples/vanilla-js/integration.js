/*
 * Color theme controller.
 *
 * Runs immediately (this script is in <head>) so `data-theme` is set on the
 * <html> element before first paint, avoiding a flash of the wrong theme.
 *
 * - On first load the theme syncs to the OS `prefers-color-scheme`.
 * - Toggling stores a local override (localStorage) that wins on later loads.
 * - With no stored override, the page keeps following live OS changes.
 *
 * Exposes window.getActiveColorScheme()/toggleColorScheme() for the rest of
 * the app (e.g. the Content Advisor / Destination Selector `colorScheme` prop).
 */
(function initColorScheme() {
  const STORAGE_KEY = 'ca-example-color-scheme';
  const root = document.documentElement;

  function systemPref() {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function storedOverride() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    window.dispatchEvent(
      new CustomEvent('colorSchemeChange', { detail: root.dataset.theme })
    );
  }

  window.getActiveColorScheme = function () {
    return root.dataset.theme || storedOverride() || systemPref();
  };

  window.setColorScheme = function (theme, persist) {
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* ignore storage failures (e.g. private mode) */
      }
    }
    apply(theme);
  };

  window.toggleColorScheme = function () {
    window.setColorScheme(
      window.getActiveColorScheme() === 'dark' ? 'light' : 'dark',
      true
    );
  };

  // Follow live OS changes only while the user has not set an explicit override.
  if (window.matchMedia) {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (event) {
        if (!storedOverride()) {
          apply(event.matches ? 'dark' : 'light');
        }
      });
  }

  apply(storedOverride() || systemPref());
})();

document.addEventListener('DOMContentLoaded', function () {
  const propertiesButton = document.getElementById(
    'environment-properties-button'
  );
  const integrationGuideButton = document.getElementById(
    'integration-guide-button'
  );
  const assetSelectorPreviewButton = document.getElementById(
    'content-advisor-preview-button'
  );
  const integrationPropertiesGuideDialog = document.getElementById(
    'integration-properties-guide-dialog'
  );
  const assetSelectorPreviewedImage = document.getElementById(
    'content-advisor-preview-image'
  );

  const destinationSelectorOpenButton = document.getElementById(
    'destination-selector-open-button'
  );

  const destinationSelectorSaveButton = document.getElementById(
    'destination-selector-save-button'
  );

  propertiesButton.addEventListener('click', function () {
    openEnvironmentPropertiesDialog();
  });

  integrationGuideButton.addEventListener('click', function () {
    openIntegrationGuideDialog();
  });

  assetSelectorPreviewButton.addEventListener(
    'click',
    openContentAdvisorPreviewDialog
  );

  assetSelectorPreviewedImage.addEventListener(
    'click',
    openContentAdvisorPreviewDialog
  );

  destinationSelectorOpenButton.addEventListener(
    'click',
    openDestinationSelectorDialog
  );

  destinationSelectorSaveButton.addEventListener(
    'click',
    openDestinationSelectorDialog
  );

  const colorSchemeSwitchButton = document.getElementById(
    'color-scheme-switch-button'
  );

  const SUN_ICON =
    '<svg viewBox="0 0 24 24" class="spectrum-Icon_368b34 spectrum-Icon--sizeS_368b34 spectrum-Icon_e2d99e" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true" role="img"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>';

  const MOON_ICON =
    '<svg viewBox="0 0 24 24" class="spectrum-Icon_368b34 spectrum-Icon--sizeS_368b34 spectrum-Icon_e2d99e" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true" role="img"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  function renderColorSchemeIcon() {
    const isDark = window.getActiveColorScheme() === 'dark';
    colorSchemeSwitchButton.innerHTML = isDark ? MOON_ICON : SUN_ICON;
    colorSchemeSwitchButton.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
    colorSchemeSwitchButton.setAttribute(
      'title',
      isDark ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  colorSchemeSwitchButton.addEventListener('click', window.toggleColorScheme);
  window.addEventListener('colorSchemeChange', renderColorSchemeIcon);
  renderColorSchemeIcon();

  // re-register Content Advisor Auth Service
  window.addEventListener('environmentProperties', (args) => {
    registerContentAdvisorAuthService(args.detail, true);
  });

  window.addEventListener('onAssetsSelectedEvent', onAssetsSelected);

  window.addEventListener('onDestinationSelectedEvent', onDestinationSelected);

  registerContentAdvisorAuthService();

  // must be registered on page load before Content Advisor is rendered
  function registerContentAdvisorAuthService(
    props = {},
    changeEnvironment = false
  ) {
    // In order to obtain an IMS_CLIENT_ID you will need to raise a support ticket with Adobe.
    // Client Id's created via Adobe Developer Console will not work for Content Advisor.
    const prodImsClientId = '%%IMS_CLIENT_ID%%';
    const prodImsOrg = '%%IMS_ORG%%';

    const initImsAuthInfo = {
      env: 'prod',
      imsClientId: prodImsClientId,
      imsScope:
        'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
      redirectUrl: window.location.href,
      imsOrg: prodImsOrg,
      imsAuthService: undefined,
      ...props,
    };

    if (PureJSSelectors) {
      return PureJSSelectors.registerContentAdvisorAuthService(
        initImsAuthInfo,
        changeEnvironment
      );
    }
  }

  async function onAssetsSelected({ detail }) {
    const asset = detail[0];

    const assetSelectorSelectedItemWell = document.getElementById(
      'content-advisor-selected-item-well'
    );
    assetSelectorSelectedItemWell.style.display = 'block';

    const assetSelectorSelectedItemPre = document.getElementById(
      'content-advisor-selected-item-pre'
    );

    assetSelectorSelectedItemPre.innerText = JSON.stringify(asset, null, 2);

    const previewImage = await generatePreviewImage(detail);
    showPreviewImage(previewImage);
  }

  function onDestinationSelected({ detail }) {
    const destinationPath = detail['repo:path'];

    const input = document.getElementById(
      'destination-selector-selected-item-input'
    );

    input.value = destinationPath;

    integrationPropertiesGuideDialog.close();
  }

  async function fetchDialogContent(dialog, url) {
    try {
      // easy way to dynamically append dialog content instead of creating multiple dialogs manually
      const response = await fetch(url);
      const content = await response.text();

      // Clear the dialog content and append the new content
      while (dialog.firstChild) {
        dialog.removeChild(dialog.firstChild);
      }

      const template = document.createElement('template');
      template.innerHTML = content;

      // Extract script tags from the content
      const scriptTags = Array.from(
        template.content.querySelectorAll('script')
      );

      scriptTags.forEach((script) => {
        script.remove();
      });

      dialog.appendChild(document.importNode(template.content, true));

      // Create and append new script elements for each extracted script tag
      const addedScripts = [];
      scriptTags.forEach((script) => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        dialog.appendChild(newScript);
        addedScripts.push(newScript);
      });

      // Clear the content ans scripts when the dialog is closed
      const onDialogClose = () => {
        while (dialog.firstChild) {
          dialog.removeChild(dialog.firstChild);
        }
        dialog.removeEventListener('close', onDialogClose);
      };

      dialog.addEventListener('close', onDialogClose);
      dialog.showModal();
    } catch (error) {
      console.error('Error fetching dialog content:', error);
    }
  }

  async function openEnvironmentPropertiesDialog() {
    await fetchDialogContent(
      integrationPropertiesGuideDialog,
      'environment.html'
    );
  }

  async function openIntegrationGuideDialog() {
    await fetchDialogContent(integrationPropertiesGuideDialog, 'guide.html');
  }

  async function openContentAdvisorPreviewDialog() {
    await fetchDialogContent(
      integrationPropertiesGuideDialog,
      './content-advisor-integration/content-advisor-wrapper.html'
    );
  }

  async function openDestinationSelectorDialog() {
    console.log('openDestinationSelectorDialog');
    await fetchDialogContent(
      integrationPropertiesGuideDialog,
      './destination-selector-integration/destination-selector-wrapper.html'
    );
  }

  // get preview image blob
  const generatePreviewImage = async (assets) => {
    const renditionLinks = getAssetRenditionLinks(assets);
    const optimalRenditionLink = getOptimalRenditionLink(renditionLinks);
    return await getRenditionBlob(optimalRenditionLink?.href);
  };

  const getAssetRenditionLinks = (selectedAssets) => {
    const asset = selectedAssets?.[0];
    return asset?._links?.['http://ns.adobe.com/adobecloud/rel/rendition'];
  };

  // Very basic way to get the optimal rendition link based on the height x width
  const getOptimalRenditionLink = (renditions) => {
    return renditions.reduce((optimalRendition, currentRendition) => {
      const optimalResolution =
        optimalRendition.width * optimalRendition.height;
      const currentResolution =
        currentRendition.width * currentRendition.height;
      return currentResolution > optimalResolution
        ? currentRendition
        : optimalRendition;
    });
  };

  // fetch the asset rendition and return the blob url
  const getRenditionBlob = async (renditionUrl) => {
    const response = await doFetch(renditionUrl);
    const buffer = await response.arrayBuffer();
    return URL.createObjectURL(new Blob([new Uint8Array(buffer)]));
  };

  // fetch rendition
  const doFetch = (url, token = null, method = 'GET') => {
    const header = new Headers();
    if (!token) {
      // get the bearer token either from window/wherever you are storing it from registerContentAdvisorAuthService
      header.append(
        'Authorization',
        `Bearer ${window['assetsSelectorsAuthService'].imsToken}`
      );
    }
    const requestOptions = {
      method: method,
      headers: header,
    };
    return fetch(url, requestOptions);
  };

  function removeAllChildren(element) {
    while (element.firstChild.tagName !== 'IMG') {
      element.removeChild(element.firstChild);
    }
  }

  // insert preview image to the dom
  function showPreviewImage(src) {
    const imageElementId = 'content-advisor-preview-image-rendered';
    const divElement = document.getElementById('content-advisor-preview-image');
    const imageElement = document.getElementById(imageElementId);

    if (divElement) {
      divElement.style.margin = '0';
      const img = imageElement || document.createElement('img');
      const loadedImage = new Image();
      img.id = imageElementId;
      img.className = 'spectrum-Image-img_fdc794';
      img.alt = 'Content Advisor preview image';
      divElement.appendChild(img);
      // remove all children except the image
      removeAllChildren(divElement);
      // load the image
      loadedImage.onload = () => {
        img.src = loadedImage.src;
      };
      loadedImage.src = src;
    }
  }
});
