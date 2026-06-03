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

const IMS_SCOPE =
  'AdobeID,openid,additional_info.projectedProductContext,read_organizations';

@Component({
  selector: 'content-advisor',
  template: `
    <div class="ca-launcher">
      <button class="ca-btn" (click)="openDialog()" [disabled]="!imsConfigured">
        Open Content Advisor
      </button>

      <div class="ca-result" *ngIf="selectedAssetName">
        <span class="ca-result-label">Last selected:</span>
        <span class="ca-result-name">{{ selectedAssetName }}</span>
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
      width: min(90vw, 1200px);
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

  readonly imsConfigured = !!environment.imsClientId?.trim();
  selectedAssetName: string | null = null;
  private rendered = false;

  ngOnInit() {
    if (!this.imsConfigured) return;
    PureJSSelectors.registerContentAdvisorAuthService({
      imsClientId: environment.imsClientId,
      imsScope: IMS_SCOPE,
      redirectUrl: window.location.href,
    });
  }

  openDialog() {
    if (!this.imsConfigured) return;
    if (!this.rendered) {
      PureJSSelectors.renderContentAdvisorWithAuthFlow(
        this.mountRef.nativeElement,
        {
          imsOrg: environment.imsOrg,
          onClose: () => this.closeDialog(),
          handleSelection: (assets: any[]) => this.handleSelection(assets),
          aemTierType: ['delivery', 'author'],
        }
      );
      this.rendered = true;
    }
    this.dialogRef.nativeElement.showModal();
  }

  closeDialog() {
    this.dialogRef.nativeElement.close();
  }

  handleSelection(assets: any[]) {
    const asset = assets?.[0];
    const name = asset?.['repo:name'] ?? asset?.name ?? 'unknown';
    console.log('Selected asset name:', name);
    this.selectedAssetName = name;
    this.closeDialog();
  }
}
