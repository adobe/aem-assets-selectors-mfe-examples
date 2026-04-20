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
import { environment } from '../../environments/environment';

declare const PureJSSelectors: any;

const IMS_SCOPE =
  'AdobeID,openid,additional_info.projectedProductContext,read_organizations';

@Component({
  selector: 'asset-selector',
  template: '<div style="height: 100vh" id="asset-selector"></div>',
})
export class AssetSelectorComponent implements OnInit, AfterViewInit {
  private readonly imsConfigured = !!environment.imsClientId?.trim();

  ngOnInit() {
    if (!this.imsConfigured) {
      console.error(
        '[asset-selector] Missing imsClientId. Copy examples/angular/.env.example to .env, set ASSET_SELECTOR_IMS_CLIENT_ID, then run: node set-env.mjs\n' +
        'Tip: use npm start (not ng serve alone) so the env file is applied before the dev server starts.'
      );
      return;
    }
    const imsAuthProps = {
      imsClientId: environment.imsClientId,
      imsScope: IMS_SCOPE,
      redirectUrl: window.location.href,
    };
    PureJSSelectors.registerAssetsSelectorsAuthService(imsAuthProps);
  }

  handleSelection(assets: unknown) {
    console.log('Selected assets', assets);
  }

  ngAfterViewInit() {
    const host = document.getElementById('asset-selector');
    if (!this.imsConfigured) {
      if (host) {
        host.textContent =
          'Missing ASSET_SELECTOR_IMS_CLIENT_ID. Add .env (see .env.example), run: node set-env.mjs, then reload. Or use: npm start';
      }
      return;
    }
    const props = {
      imsOrg: environment.imsOrg,
      handleSelection: (assets: unknown) => this.handleSelection(assets),
      aemTierType: ['delivery', 'author']
    };
    PureJSSelectors.renderAssetSelectorWithAuthFlow(host, props);
  }
}
