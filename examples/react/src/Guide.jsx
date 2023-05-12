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

import React from "react";
import {
    Dialog,
    Heading,
    Content,
    Divider,
    Text,
    View,
} from "@adobe/react-spectrum";

import { CodeBlock, dracula } from "react-code-blocks";


const step1Code = `import { registerAssetsSelectorsAuthService, AssetSelectorWithAuthFlow } from "https://experience.adobe.com/solutions/CQ-assets-selectors/assets/resources/@assets/selectors"`

const step2Code = `const imsAuthProps = {
    imsClientId: IMS_CLIENT_ID_ASSOCIATED_WITH_YOUR_ORG, 
    imsScope: "openid,read_organizations,additional_info.projectedProductContext",
    redirectUrl: window.location.href,
};
// must be called on page load
registerAssetsSelectorsAuthService(imsAuthProps);
`;

const step3Code = `function App() {
  //selectedAssets returned with extensive asset metadata
  const [selectedAssets, setSelectedAssets] = useState([]);

  const onClose = () => {
    // Handle closing the AssetSelectorWithAuthFlow
  };

  return (
    <AssetSelectorWithAuthFlow
        imsOrg={imsOrg}
        onClose={onClose}
        handleSelection={setSelectedAssets}/>
  );
}
`;

export const Guide = () => {
    return (
        <Dialog size="L" isDismissable>
            <Heading>AssetsSelectors Integration Guide</Heading>
            <Divider />
            <Content>
                <View marginBottom="size-200">
                    <View marginBottom={5}>
                        <Text>
                            <strong>Step 1:</strong> Import the ESM library from CDN
                        </Text>
                    </View>
                    <CodeBlock
                        text={step1Code}
                        language="javascript"
                        theme={dracula}
                        wrapLines={false}
                        codeBlock
                        showLineNumbers={false}
                        style={{ whiteSpace: "nowrap", overflowX: "auto" }}
                    />
                </View>

                <View marginBottom="size-200">
                    <View marginBottom={5}>
                        <Text>
                            <strong>Step 2:</strong> Call <strong><code>registerAssetsSelectorsAuthService(...)</code></strong> with imsAuthProps on page load.
                        </Text>
                    </View>
                    <CodeBlock
                        text={step2Code}
                        language="javascript"
                        theme={dracula}
                        wrapLines
                        showLineNumbers={false}
                    />
                </View>
                <View marginBottom="size-200">
                    <View marginBottom={5}>
                        <Text>
                            <strong>Step 3:</strong> Render <strong><code>AssetSelectorWithAuthFlow</code></strong> with AssetSelector props.
                        </Text>
                    </View>
                    <CodeBlock
                        text={step3Code}
                        language="jsx"
                        theme={dracula}
                        wrapLines
                        codeBlock
                        showLineNumbers={false}
                    />
                </View>
            </Content>

        </Dialog>
    );
};

export default Guide;
