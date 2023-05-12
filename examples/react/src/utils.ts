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

export const doFetch = (url, token = null, method = "GET") => {
    const header = new Headers();
    if(!token) {
        // get the bearer token either from window/wherever you are storing it from registerAssetsSelectorsAuthService
        header.append("Authorization", `Bearer ${window['assetsSelectorsAuthService'].imsToken}`);
    }
    const requestOptions = {
        method: method,
        headers: header,
    };
    return fetch(url, requestOptions);
};

// fetch the asset rendition and return the blob url
export const getRenditionBlob = async (renditionUrl) => {
    const response = await doFetch(renditionUrl);
    const buffer = await response.arrayBuffer();
    return URL.createObjectURL(new Blob([new Uint8Array(buffer)]));
};

// Very basic way to get the optimal rendition link based on the height x width
export const getOptimalRenditionLink = (renditions) => {
    return renditions.reduce((optimalRendition, currentRendition) => {
        const optimalResolution = optimalRendition.width * optimalRendition.height;
        const currentResolution = currentRendition.width * currentRendition.height;
        return currentResolution > optimalResolution ? currentRendition : optimalRendition;
      });
}

export const getAssetRenditionLinks = (selectedAssets) => {
    const asset = selectedAssets?.[0];
    return asset?._links?.['http://ns.adobe.com/adobecloud/rel/rendition'];
};