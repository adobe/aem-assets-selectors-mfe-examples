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

import React, { useState, useEffect } from "react";
import {
    Grid,
    Flex,
    View,
    Divider,
    Text,
    Header,
    Heading,
    Well,
    DialogTrigger,
    TextField,
    ActionButton,
    Button,
    ActionGroup,
    Item,
    TextArea,
    Image,
    TabList,
    TabPanels,
    Tabs,
    Dialog,
    Content,
    IllustratedMessage,
    Link
} from "@adobe/react-spectrum";

import Properties from "@spectrum-icons/workflow/Properties";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import Desktop from "@spectrum-icons/workflow/DeviceDesktop";
import Mobile from "@spectrum-icons/workflow/DevicePhone";
import TextBold from "@spectrum-icons/workflow/TextBold";
import Visibility from "@spectrum-icons/workflow/Visibility";
import BeakerCheck from "@spectrum-icons/workflow/BeakerCheck";
import Edit from "@spectrum-icons/workflow/Edit";
import AssetIcon from "@spectrum-icons/workflow/Asset";
import Contrast from "@spectrum-icons/workflow/Contrast";
import Code from "@spectrum-icons/workflow/Code";
import "./App.css";
import DesignPlaceholder from "./svg/Placeholder.js";
import { AssetSelectorWrapper } from "./AssetSelectorWrapper";
import { getAssetRenditionLinks, getOptimalRenditionLink, getRenditionBlob } from "./utils";
import { Guide } from './Guide'

import { Settings } from './Settings'

const DesignPlaceholderSvg = (props) => (
    <Image src={DesignPlaceholder} alt="demo design placeholder image" {...props} />
);

const DesignerView = (props) => {
    const [subjectLineText, setSubjectLineText] = useState(
        'Discover. Select. Integrate. Power of Assets Selectors for Seamless Integration.'
    );

    const sloganText = `Take your application to the next level with Assets Selectors. Our highly configurable, accessible, and localized tool makes it easy for your users to discover, select, and add assets quickly and easily. 📸`;

    const [selectionString, setSelectionString] = useState('');
    const [selectedAssetMetadata, setSelectedAssetMetadata] = useState(null);
    const [assetImagePreview, setAssetImagePreview] = useState(null);
    const [optimalRendition, setOptimalRendition] = useState(null);

    const applyAssets = () => {
        setPlaceholderAsset(selectedAssetMetadata);
    };

    const generatePreviewImage = async (assets) => {
        const renditionLinks = getAssetRenditionLinks(assets);
        const optimalRenditionLink = getOptimalRenditionLink(renditionLinks);
        setOptimalRendition(optimalRenditionLink);
        return await getRenditionBlob(optimalRenditionLink?.href);
    }

    const handleOnConfirm = async (assets) => {
        setSelectedAssetMetadata(assets[0]);

        const previewImage = await generatePreviewImage(assets);
        setAssetImagePreview(previewImage);
    };

    useEffect(() => {
        if (selectedAssetMetadata) {
            setSelectionString(`${selectedAssetMetadata.name} -- (${selectedAssetMetadata.type})`);
        }
    }, [selectedAssetMetadata]);

    const sizeMedium = 'size-500';
    const sizeSmall = 'size-300';

    const commonTextStyles = {
        textAlign: 'center',
        color: '#6e6e6e',
        display: 'block',
    };

    const StyledHeader = (styleProps) => (
        <Text
            marginBottom="size-10"
            UNSAFE_style={{
                color: '#6e6e6e',
                display: 'block',
            }}
            {...styleProps}
        />
    );


    const renderPreviewImage = (src) => {
        return (
            <Flex marginBottom="5px" maxHeight="100%" maxWidth="100%">
                <Image src={src} alt="placeholder image" objectFit="cover" />
            </Flex>
        );
    }

    const renderAssetSelector = () => {
        return (
            <DialogTrigger type="fullscreen" isDismissable>
                <ActionButton height={optimalRendition?.height || 108} maxHeight={300} isQuiet={true} aria-label="Asset Selector Button">
                    <View>
                        {assetImagePreview ? renderPreviewImage(assetImagePreview) : <DesignPlaceholderSvg />}
                    </View>
                </ActionButton>
                <AssetSelectorWrapper {...props} handleSelection={handleOnConfirm} />
            </DialogTrigger>
        );
    };

    const renderSidePanel = () => {
        return (
            <View
                width={{ base: '100%', S: 'size-4600' }}
                borderEndWidth="thick"
                borderEndColor="gray-300"
                paddingBottom={sizeMedium}
                backgroundColor="gray-100"
            >
                <View paddingX={sizeMedium}>
                    <Heading level={2}>Email</Heading>
                </View>
                <Divider size="M" />
                <View
                    width={{ base: '100%', S: 'size-4600' }}
                    borderEndWidth="thick"
                    borderEndColor="gray-300"
                    paddingBottom={sizeSmall}
                >
                    <Heading marginX={sizeMedium} level={3}>
                        Header
                    </Heading>
                    <View paddingX={sizeMedium}>
                        <StyledHeader>From email</StyledHeader>
                        <Text
                            UNSAFE_style={{
                                color: '#4B4B4B',
                            }}
                        >
                            assetselector@adobe.com
                        </Text>
                    </View>
                    <View paddingX={sizeMedium} paddingTop={sizeSmall}>
                        <StyledHeader>From name</StyledHeader>
                        <Text
                            UNSAFE_style={{
                                color: '#4B4B4B',
                            }}
                        >
                            AssetSelector Team
                        </Text>
                    </View>
                    <View paddingX={sizeMedium} paddingTop={sizeSmall}>
                        <StyledHeader>Subject line</StyledHeader>
                        <TextArea
                            UNSAFE_style={{
                                color: '#4B4B4B',
                            }}
                            defaultValue={subjectLineText}
                            onChange={setSubjectLineText}
                            minHeight="size-1200"
                            width={{
                                base: '100%',
                                L: 'size-3600',
                            }}
                        />
                    </View>
                </View>
                <Divider size="M" />
                <View>
                    <Heading marginX={sizeMedium} level={3}>
                        Body
                    </Heading>
                    <View paddingX={sizeMedium}>
                        <Content>{sloganText}</Content>
                    </View>
                </View>
                <View paddingX={sizeMedium} paddingTop={sizeSmall}>
                    <StyledHeader marginBottom="size-100">Selected Asset</StyledHeader>
                    <Flex>
                        <TextField
                            width="100%"
                            value={selectionString}
                            isReadOnly={true}
                            placeholder="No assets selected"
                        />
                        <DialogTrigger type="fullscreen">
                            <ActionButton
                                UNSAFE_style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                marginStart="-5px"
                            >
                                <AssetIcon />
                            </ActionButton>
                            <AssetSelectorWrapper {...props} handleSelection={handleOnConfirm} />
                        </DialogTrigger>
                    </Flex>
                    {selectedAssetMetadata && (
                        <View height="150px" overflow="scroll" marginY="size-100">
                            <Well>
                                <pre style={{ whiteSpace: 'pre-wrap', margin: `-5px 0` }}>
                                    {JSON.stringify(selectedAssetMetadata, undefined, 2)}
                                </pre>
                            </Well>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const renderEmailDisplay = () => {
        return (
            <View flex="1" backgroundColor="gray-300" padding={sizeMedium}>
                <Flex alignItems="center" direction="column">
                    <View
                        minHeight="size-3000"
                        height="100%"
                        width="100%"
                        maxWidth="size-6000"
                        overflow="auto"
                        backgroundColor="gray-50"
                        borderRadius="medium"
                    >
                        <View padding="size-450">
                            <Flex alignItems="start" justifyContent="space-between">
                                <Flex alignItems="center" direction="row">
                                    <View
                                        backgroundColor="notice"
                                        width="size-600"
                                        height="size-600"
                                        marginEnd="size-125"
                                        UNSAFE_style={{
                                            borderRadius: '100%',
                                        }}
                                    >
                                        <Flex alignItems="center" justifyContent="center">
                                            <Text
                                                UNSAFE_style={{
                                                    fontSize: '28px',
                                                    color: 'white',
                                                }}
                                            >
                                                A
                                            </Text>
                                        </Flex>
                                    </View>
                                    <Header>
                                        <Heading
                                            margin={0}
                                            padding={0}
                                            UNSAFE_style={{
                                                color: '#2680eb',
                                                fontSize: '16px',
                                            }}
                                        >
                                            AssetSelector Team
                                        </Heading>
                                        <Text>From:</Text>
                                        <Text
                                            UNSAFE_style={{
                                                paddingLeft: '3px',
                                                color: '#6e6e6e',
                                            }}
                                        >
                                            assetselector@adobe.com
                                        </Text>
                                    </Header>
                                </Flex>
                                <Edit />
                            </Flex>
                            <Divider size="S" marginY="size-150" />
                            <Flex direction="column">
                                <Heading level={4} marginTop={0}>
                                    {subjectLineText}
                                </Heading>

                                <View width="100%" height="100%">
                                    <Text>{sloganText}</Text>
                                </View>
                                <Grid
                                    marginTop="size-200"
                                    justifyContent="center"
                                    gap="size-300"
                                    columns="repeat(1, 1fr)"
                                >
                                    <View margin={assetImagePreview ? 0 : 'size-400'}>
                                        <Flex alignItems="center" direction="column">
                                            <IllustratedMessage>
                                                <Heading>
                                                    {renderAssetSelector()}
                                                </Heading>
                                                {!selectedAssetMetadata && (<Content UNSAFE_style={{ ...commonTextStyles, marginTop: 100 }}>
                                                    See for yourself how easy it is to use Assets Selectors! Click on the placeholder icon in this email template to see it in action.
                                                </Content>)}
                                            </IllustratedMessage>

                                        </Flex>
                                    </View>
                                    <View>
                                        <Flex alignItems="center" direction="column">
                                            <View width="100%" height="100%" margin={0}>
                                                <Text>With Assets Selectors integration, you can add your assets from Experience Manager anywhere in your application.</Text>
                                            </View>
                                            <Link marginTop={10}>
                                                <a href="https://git.corp.adobe.com/CQ/assets-selectors/tree/main/packages/%40assets/selectors/examples" target="_blank">
                                                    Get started integrating AssetsSelectors quickly and confidently, browse our collection of code examples for use with frameworks like React, Vanilla JavaScript, and others.
                                                </a>
                                            </Link>
                                        </Flex>
                                    </View>
                                </Grid>
                            </Flex>
                        </View>
                    </View>
                </Flex>
            </View>
        );
    };

    return (
        <Flex direction="column">
            <View padding="size-125" borderBottomColor="gray-300" borderBottomWidth="thick">
                <Flex justifyContent="space-between" alignItems="center" direction={{ base: 'column', S: 'row' }}>
                    <Flex
                        direction="row"
                        alignItems="center"
                        marginBottom={{
                            base: 'size-200',
                        }}
                    >
                        <ChevronLeft />
                        <Header marginX="size-100">
                            <Heading marginTop={0} marginBottom={5}>
                                Assets Selectors from Adobe Experience Manager
                            </Heading>
                            <Text>Elevate Your Users Experience with Assets Selectors</Text>
                        </Header>
                    </Flex>
                    <Flex>
                        <ActionGroup density="compact" selectedKeys={'desktop'}>
                            <Item key="desktop" aria-label="Desktop icon">
                                <Desktop />
                            </Item>
                            <Item key="mobile" aria-label="Mobile icon">
                                <Mobile />
                            </Item>
                            <Item key="text" aria-label="Text icon">
                                <TextBold />
                            </Item>
                            <Item key="preview" aria-label="Visibility icon">
                                <Visibility />
                            </Item>
                        </ActionGroup>
                        <ActionButton
                            marginX="size-200"
                            variant="primary"
                            isDisabled={!selectedAssetMetadata}
                            onPress={applyAssets}
                        >
                            <BeakerCheck color="positive" />
                            <Text>Preview & Test</Text>
                        </ActionButton>
                        <Divider orientation="vertical" size="M" />
                        <Button variant="cta" marginX="size-200">
                            <Text>Save</Text>
                        </Button>
                    </Flex>
                </Flex>
            </View>
            <Flex minHeight="100vh" direction={{ base: 'column-reverse', S: 'row' }}>
                {renderEmailDisplay()}
                {renderSidePanel()}
                <View padding="size-100" isHidden={{ base: true, S: false }}>
                    <Flex direction={{ base: 'row', S: 'column' }}>
                        <DialogTrigger>
                            <ActionButton marginBottom="size-100">
                                <Properties />
                            </ActionButton>
                            <Settings />
                        </DialogTrigger>
                        <DialogTrigger>
                            <ActionButton isQuiet={true} marginBottom="size-100">
                                <Code  />
                            </ActionButton>
                            <Guide />
                        </DialogTrigger>
                        <ActionButton isQuiet={true} marginBottom="size-100" onPress={props.onThemeChange}>
                            <Contrast  />
                        </ActionButton>
                    </Flex>
                </View>
            </Flex>
        </Flex>
    );
};

export default DesignerView;
