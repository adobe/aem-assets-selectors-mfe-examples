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

import React, { useContext, useState, useEffect } from 'react';
import {
  useDialogContainer,
  Dialog,
  Heading,
  Content,
  ButtonGroup,
  Button,
  Divider,
  RadioGroup,
  Radio,
  Form,
  TextField,
  Footer,
} from '@adobe/react-spectrum';

import { EnvironmentContext } from './EnvironmentProvider';

export const Settings = () => {
  const dialog = useDialogContainer();

  const {
    environment,
    setEnvironment,
    imsAuthInfo,
    applyImsAuthChange,
    cancelImsAuthChange,
    signOut,
  } = useContext(EnvironmentContext);
  const [imsClientId, setImsClientId] = useState(imsAuthInfo.imsClientId);
  const [imsOrg, setImsOrg] = useState(imsAuthInfo.imsOrg);

  useEffect(() => {
    setImsClientId(imsAuthInfo.imsClientId);
    setImsOrg(imsAuthInfo.imsOrg);
  }, [imsAuthInfo]);

  const handleOnConfirm = () => {
    applyImsAuthChange({
      imsOrg,
      imsClientId,
    });
    dialog.dismiss();
  };

  const handleOnCancel = () => {
    cancelImsAuthChange();
    dialog.dismiss();
  };

  const handleSignOut = () => {
    signOut();
    dialog.dismiss();
  };

  return (
    <Dialog size="M">
      <Heading>Environment settings</Heading>
      <Divider />
      <Content>
        <RadioGroup
          label="AssetsSelectors environment"
          value={environment}
          onChange={setEnvironment}
          defaultValue={environment}
          orientation="horizontal"
          labelPosition="side"
          labelAlign="end"
          isEmphasized
        >
          <Radio value="prod">Production</Radio>
          <Radio value="stage">Stage</Radio>
        </RadioGroup>
        <Form>
          <TextField
            label="IMS Client ID"
            value={imsClientId}
            onChange={setImsClientId}
          />
          <TextField label="Ims Org" value={imsOrg} onChange={setImsOrg} />
        </Form>
      </Content>
      {imsAuthInfo.imsAuthService && imsAuthInfo.imsAuthService.imsToken && (
        <Footer>
          <Button variant="negative" onPress={handleSignOut}>
            Sign out
          </Button>
        </Footer>
      )}
      <ButtonGroup>
        <Button variant="secondary" onPress={handleOnCancel}>
          Cancel
        </Button>
        <Button variant="accent" onPress={handleOnConfirm}>
          Confirm
        </Button>
      </ButtonGroup>
    </Dialog>
  );
};

export default Settings;
