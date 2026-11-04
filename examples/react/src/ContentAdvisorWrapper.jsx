
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

import React, { useContext } from "react";

import { useDialogContainer } from "@adobe/react-spectrum";
import { registerContentAdvisorAuthService as registerContentAdvisorAuthServiceInternal, ContentAdvisorWithAuthFlow } from "@assets/selectors";
import { EnvironmentContext } from "./EnvironmentProvider";
import { getDetailPanelCustomizationProps } from "./detailPanelInfoPopoverMap";
import { getFilterSchemaCustomizationProps } from "./contentAdvisorFilterSchema";

// Opt-in: customized Content Advisor detail panel (infoPopoverMap). Limited availability - only takes
// effect for an apiKey Adobe has enabled. See docs/content-advisor-detail-panel-customization.md.
const detailPanelCustomizationProps =
    import.meta.env.VITE_ENABLE_DETAIL_PANEL_CUSTOMIZATION === 'true'
        ? getDetailPanelCustomizationProps({ apiKey: import.meta.env.VITE_API_KEY })
        : {};

// Opt-in: customized filter panel (filterSchema, filterSchemaSource, filterSchemaDefaults).
// Available to every integration. See contentAdvisorFilterSchema.js.
const filterSchemaCustomizationProps =
    import.meta.env.VITE_ENABLE_FILTER_SCHEMA_CUSTOMIZATION === 'true' ? getFilterSchemaCustomizationProps() : {};

export const registerContentAdvisorAuthService = (imsAuthProps, changeEnvironment = false) => {
    if (imsAuthProps) {
        return registerContentAdvisorAuthServiceInternal(imsAuthProps, changeEnvironment);
    }
};

export const ContentAdvisorWrapper = (props) => {
    const dialog = useDialogContainer();
    const { imsAuthInfo } = useContext(EnvironmentContext);

    const contentAdvisorProps = {
        ...detailPanelCustomizationProps,
        ...filterSchemaCustomizationProps,
        ...props,
        onClose: () => {
            dialog.dismiss?.();
        },
        handleSelection: (assets) => {
            props?.handleSelection(assets);
        },
        env: imsAuthInfo.env,
        imsOrg: imsAuthInfo.imsOrg,
        aemTierType: ['delivery', 'author']
    }

    // ContentAdvisorWithAuthFlow adds authentication flow to ContentAdvisor
    // If you already have an imsToken, you can use ContentAdvisor directly instead
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
            }}
        >
            <ContentAdvisorWithAuthFlow {...contentAdvisorProps} ></ContentAdvisorWithAuthFlow>
        </div>
    );
};
