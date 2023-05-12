
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

import React, {useContext } from "react";

import { useDialogContainer } from "@adobe/react-spectrum";
import { registerAssetsSelectorsAuthService as registerAssetsSelectorsAuthServiceInternal, AssetSelectorWithAuthFlow} from "@assets/selectors";
import { EnvironmentContext } from "./EnvironmentProvider";

export const registerAssetsSelectorsAuthService = (imsAuthProps, changeEnvironment = false) => {
    if(imsAuthProps){
        return registerAssetsSelectorsAuthServiceInternal(imsAuthProps, changeEnvironment);
    }
};

export const AssetSelectorWrapper = (props) => {
    const dialog = useDialogContainer();
    const { imsAuthInfo} = useContext(EnvironmentContext);

    const assetsSelectorsProps = {
        ...props,
        onClose: () => {
            dialog.dismiss?.();
        },
        handleSelection: (assets) => {
            props?.handleSelection(assets);
        },
        env: imsAuthInfo.env,
        imsOrg: imsAuthInfo.imsOrg,
    }

    // AssetSelectorWithAuthFlow adds authentication flow to AssetSelector
    // If you already have an imsToken, you can use AssetSelector directly instead
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <AssetSelectorWithAuthFlow {...assetsSelectorsProps} ></AssetSelectorWithAuthFlow>
        </div>
    );
};
