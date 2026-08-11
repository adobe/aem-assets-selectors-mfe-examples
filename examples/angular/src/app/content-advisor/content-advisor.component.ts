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

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../environments/environment';

declare const PureJSSelectors: any;
declare const UploadCoordinator: any;

const IMS_SCOPE =
  'AdobeID,openid,additional_info.projectedProductContext,read_organizations';

@Component({
  selector: 'content-advisor',
  template: `
    <div class="ca-launcher">
      <button class="ca-btn" (click)="openDialog()" [disabled]="!imsConfigured">
        Select Upload Destination
      </button>

      <div class="ca-result" *ngIf="targetUploadPath">
        <span class="ca-result-label">Uploading to:</span>
        <span class="ca-result-name">{{ targetUploadPath }}</span>
      </div>

      <p class="ca-error" *ngIf="!imsConfigured">
        Missing <code>IMS_CLIENT_ID</code> — copy
        <code>.env.example</code> to <code>.env</code> and run <code>npm start</code>.
      </p>
    </div>

    <dialog #selectorDialog class="ca-dialog">
      <div #mountPoint class="ca-mount"></div>
    </dialog>
  `,
  styles: [`
    .ca-launcher {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .ca-btn {
      padding: 10px 22px;
      font-size: 15px;
      font-family: system-ui, Arial, sans-serif;
      background: #1473e6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .ca-btn:hover:not([disabled]) {
      background: #0d66d0;
    }

    .ca-btn[disabled] {
      background: #ccc;
      cursor: not-allowed;
    }

    .ca-result {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-family: system-ui, Arial, sans-serif;
      font-size: 14px;
    }

    .ca-result-label { color: #666; }

    .ca-result-name {
      font-weight: 600;
      color: #222;
    }

    .ca-error {
      font-family: system-ui, Arial, sans-serif;
      font-size: 13px;
      color: #c00;
      margin: 0;
    }

    .ca-dialog {
      border: 0;
      border-radius: 8px;
      padding: 0;
      width: min(90vw, 640px);
      height: min(88vh, 900px);
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
    }

    .ca-mount {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ContentAdvisorComponent implements OnInit {
  @ViewChild('selectorDialog') dialogRef!: ElementRef<HTMLDialogElement>;
  @ViewChild('mountPoint') mountRef!: ElementRef<HTMLDivElement>;

  // In order to obtain an imsClientId you will need to raise a support ticket with Adobe.
  // Client Id's created via Adobe Developer Console will not work for Content Advisor.
  readonly imsConfigured = !!environment.imsClientId?.trim();
  targetUploadPath: string | null = null;
  private accessToken: string | null = null;
  private destinationSelectorRendered = false;

  ngOnInit() {
    if (!this.imsConfigured) return;
    PureJSSelectors.registerContentAdvisorAuthService({
      imsClientId: environment.imsClientId,
      imsScope: IMS_SCOPE,
      redirectUrl: window.location.href,
      onAccessTokenReceived: (accessToken: { token: string }) => {
        this.accessToken = accessToken.token;
      },
    });
  }

  openDialog() {
    if (!this.imsConfigured) return;
    if (!this.destinationSelectorRendered) {
      PureJSSelectors.renderDestinationSelectorWithAuthFlow(
        this.mountRef.nativeElement,
        {
          imsOrg: environment.imsOrg,
          onClose: () => this.closeDialog(),
          initRepoId: environment.repositoryId,
          onConfirm: (destination: any) => this.handleDestinationSelected(destination),
          aemTierType: ['delivery', 'author'],
        }
      );
      this.destinationSelectorRendered = true;
    }
    this.dialogRef.nativeElement.showModal();
  }

  closeDialog() {
    this.dialogRef.nativeElement.close();
  }

  handleDestinationSelected(destination: any) {
    const path = destination?.['repo:path'] ?? destination?.path ?? null;

    if (!this.accessToken || !path) return;
    this.targetUploadPath = path;
    this.renderUpload(this.accessToken, path);
  }

  private renderUpload(apiToken: string, targetUploadPath: string) {
    UploadCoordinator.renderAllInOneUpload(
      this.mountRef.nativeElement,
      {
        env: 'PROD',
        // Adobe IMS bearer token used to authenticate with the AEM as a Cloud Service repository.
        apiToken: apiToken,
        // AEM as a Cloud Service author host to upload assets to.
        repositoryId: environment.repositoryId,
        // DAM path assets will be uploaded to.
        targetUploadPath,
      }
    );
  }
}
