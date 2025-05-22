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

import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'asset-selector',
  template: '<div style="height: 100vh" id="asset-selector"></div>'
})
export class AssetSelectorComponent implements OnInit, AfterViewInit {
  ngOnInit() {
      // 1. Register the Assets Selectors Auth Service on component load
      // Note: it is recommended that you call registerAssetsSelectorsAuthService before calling renderAssetSelectorWithAuthFlow

      const imsAuthProps = {
          imsClientId: '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>',
          imsScope: 'additional_info.projectedProductContext,openid,read_organizations',
          redirectUri: window.location.href
      };
      // @ts-ignore
      // make sure to add `declare const PureJSSelectors: any;` to your type declaration file 
      PureJSSelectors.registerAssetsSelectorsAuthService(imsAuthProps);   
  }

  handleSelection(assets) {
      console.log("Selected assets", assets)
  }

  ngAfterViewInit() {
      // 2. Render the AssetSelector component with built in auth flow
      const props = {
          imsOrg: "9D0725C05E44FE1A0A49411C@AdobeOrg",
          handleSelection: this.handleSelection,
      }
      // @ts-ignore
      PureJSSelectors.renderAssetSelectorWithAuthFlow(document.getElementById('asset-selector'), props);
  }
}