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

function init(){
    
    const environmentProperties = document.getElementById('environment-radio-group');
    const environmentPropertiesButtonSignOut = document.getElementById('environment-properties-button-signOut');
    const environmentPropertiesButtonConfirm = document.getElementById('environment-properties-button-confirm');
    const environmentPropertiesButtonCancel = document.getElementById('environment-properties-button-cancel');

    environmentProperties.addEventListener('change', onEnvironmentPropertiesChange);
    environmentPropertiesButtonSignOut.addEventListener('click', onSignOutClick);
    environmentPropertiesButtonConfirm.addEventListener('click', onConfirmClick);
    environmentPropertiesButtonCancel.addEventListener('click', onCancelClick);
}


function onEnvironmentPropertiesChange(event) {

    const stageImsClientId = "<ADOBE_PROVIDED_IMS_CLIENT_ID>";
    const stageImsOrg = "9D0725C05E44FE1A0A49411C@AdobeOrg";

    const prodImsClientId = "<ADOBE_PROVIDED_IMS_CLIENT_ID>";
    const prodImsOrg = "999F6D0B617C10B80A495E2E@AdobeOrg";

    const environmentPropertiesInputImsClientId = document.getElementById('environment-properties-input-ims-client-id');
    const environmentPropertiesInputImsOrgId = document.getElementById('environment-properties-input-ims-org-id');
    const environmentRadioItemProd = document.getElementById("environment-radio-group-prod");
    const environmentRadioItemStage = document.getElementById("environment-radio-group-stage");

    if(event.target.value === 'stage') {
        environmentPropertiesInputImsClientId.value = stageImsClientId;
        environmentPropertiesInputImsOrgId.value = stageImsOrg;
        environmentRadioItemStage.checked = true;
    } else {
        environmentRadioItemProd.checked = true;
        environmentPropertiesInputImsClientId.value = prodImsClientId;
        environmentPropertiesInputImsOrgId.value = prodImsOrg;
    };
};

function onConfirmClick() {
    const environmentPropertiesInputImsClientId = document.getElementById('environment-properties-input-ims-client-id');
    const environmentPropertiesInputImsOrgId = document.getElementById('environment-properties-input-ims-org-id');
    const environmentRadioItemStage = document.getElementById("environment-radio-group-stage");

    const initImsAuthInfo = {
        env: environmentRadioItemStage.checked ? "stage" : "prod",
        imsClientId: environmentPropertiesInputImsClientId.value,
        imsScope:
            "AdobeID,openid,read_organizations,additional_info.projectedProductContext",
        redirectUrl: window.location.href,
        imsOrg: environmentPropertiesInputImsOrgId.value,
        imsTokenService: undefined,
    };

    const environmentPropertiesEvent = new CustomEvent('environmentProperties', {
        detail: initImsAuthInfo
    });

    window.dispatchEvent(environmentPropertiesEvent);
    onCancelClick();
}

function onCancelClick() {
    const integrationPropertiesGuideDialog = document.getElementById('integration-properties-guide-dialog');
    integrationPropertiesGuideDialog.close();
};

function onSignOutClick() {
    window.assetsSelectorsAuthService && window.assetsSelectorsAuthService.signOut();
    onCancelClick();
};

init();