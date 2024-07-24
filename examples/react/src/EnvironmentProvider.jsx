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

import React, { useEffect, useState } from 'react';

import { registerAssetsSelectorsAuthService } from './AssetSelectorWrapper';

export const EnvironmentContext = React.createContext({});

const stageImsClientId = '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>';
const stageImsOrg = '9D0725C05E44FE1A0A49411C@AdobeOrg';

const prodImsClientId = '<IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_AEM_ASSETS_REPOSITORY>';
const prodImsOrg = '999F6D0B617C10B80A495E2E@AdobeOrg';

const initImsAuthInfo = {
  env: 'prod',
  imsClientId: prodImsClientId,
  imsScope:
    'AdobeID,openid,read_organizations,additional_info.projectedProductContext',
  redirectUrl: window.location.href,
  imsOrg: prodImsOrg,
  imsAuthService: undefined,
};

export const EnvironmentProvider = ({ children }) => {
  const [environment, setEnvironment] = useState('prod');
  const [imsAuthInfo, setImsAuthInfo] = useState(initImsAuthInfo);

  const applyImsAuthChange = (props) => {
    // update the token service
    // you can also access the tokenService from window.assetsSelectorsAuthService
    const tokenService = registerAssetsSelectorsAuthService(
      {
        ...imsAuthInfo,
        ...props,
      },
      true
    );
    setImsAuthInfo((prevInfo) => {
      return {
        ...prevInfo,
        ...props,
        imsAuthService: tokenService,
      };
    });
  };

  const cancelImsAuthChange = () => {
    setImsAuthInfo({
      ...initImsAuthInfo,
    });
    setEnvironment('prod');
  };

  const signOut = () => {
    const tokenService =
      imsAuthInfo?.imsAuthService || window.assetsSelectorsAuthService;
    tokenService.signOut();
  };

  useEffect(() => {
    setImsAuthInfo((prevInfo) => {
      if (environment === 'stage') {
        return {
          ...prevInfo,
          env: 'stage',
          imsClientId: stageImsClientId,
          imsOrg: stageImsOrg,
        };
      }
      return initImsAuthInfo;
    });
  }, [environment]);

  // you must register the token service before using the asset selector
  useEffect(() => {
    // you can also access the tokenService from window.assetsSelectorsAuthService
    const tokenService = registerAssetsSelectorsAuthService(imsAuthInfo);
    setImsAuthInfo((prevInfo) => {
      return {
        ...prevInfo,
        imsAuthService: tokenService,
      };
    });
  }, []);

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        imsAuthInfo,
        setImsAuthInfo,
        cancelImsAuthChange,
        applyImsAuthChange,
        signOut,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
};

export default EnvironmentProvider;
