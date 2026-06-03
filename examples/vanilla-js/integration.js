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
