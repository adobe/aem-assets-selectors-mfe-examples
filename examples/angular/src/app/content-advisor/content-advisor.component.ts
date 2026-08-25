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

/**
 * Chaining the Destination Selector + Assets Upload micro-frontends.
 *
 * Provide an IMS token and a target repository, then "Upload to AEM":
 *   1. create a host-generated image (see generated-image.ts);
 *   2. mount the Upload MFE early (into the still-closed modal) so its repository
 *      discovery warms up while the user chooses a folder — otherwise the first
 *      upload fails on a cold start because path resolution runs before the
 *      discovery links are loaded;
 *   3. the Destination Selector returns the chosen folder as `repo:path`;
 *   4. open the Upload modal and commit that folder; on the resulting
 *      `onPropsCommitted` start the upload with `UploadCoordinator.initiateUpload`.
 *
 * Both MFEs use the token directly (`imsToken` / `apiToken`) — no sign-in. The
 * token + repository are remembered in localStorage for convenience.
 */

import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { createGeneratedImageFile } from './generated-image';

// Globals from the two Adobe-hosted UMD bundles loaded in index.html.
declare const PureJSSelectors: any;
declare const UploadCoordinator: any;

const UPLOAD_IFRAME_ID = '@assets/upload/AllInOneUpload';
const DEFAULT_REPO_ID = 'author-p149891-e1546481.adobeaemcloud.com'; // replace with your AEM author host

type Phase = 'idle' | 'generating' | 'selecting' | 'uploading' | 'done';

@Component({
  selector: 'content-advisor',
  template: `
    <div class="mfe">
      <div class="row">
        <input #tok type="password" autocomplete="off" placeholder="IMS access token" [disabled]="!!token" />
        <button (click)="useToken(tok)" [disabled]="!!token">Use token</button>
        <button *ngIf="token" class="ghost" (click)="clearToken()">Clear token</button>
        <span *ngIf="token" class="ok">token set ✓</span>
      </div>

      <input class="repo" type="text" [value]="repoId" (input)="setRepo($event)"
             placeholder="author-pXXXXX-eYYYYY.adobeaemcloud.com" />

      <div class="row">
        <button (click)="startFlow()" [disabled]="!token || !repoId || running">
          Upload generated image to AEM
        </button>
        <button class="ghost" (click)="restart()" [disabled]="phase === 'idle'">Restart</button>
      </div>

      <ol class="steps" *ngIf="phase !== 'idle'">
        <li [class.active]="phase === 'generating'" [class.done]="isDone(1)">Generate image</li>
        <li [class.active]="phase === 'selecting'" [class.done]="isDone(2)">Select destination</li>
        <li [class.active]="phase === 'uploading'" [class.done]="isDone(3)">Upload to AEM</li>
      </ol>

      <p *ngIf="status" class="status">{{ status }}</p>

      <!-- Destination Selector MFE -->
      <dialog #destDialog class="dialog"><div #destMount class="mount"></div></dialog>

      <!-- Assets Upload MFE (mounted early to warm discovery, shown on confirm) -->
      <dialog #uploadDialog class="dialog dialog--upload">
        <div class="head"><span>Upload to AEM</span><button class="ghost" (click)="closeUpload()">Close</button></div>
        <div #uploadMount class="mount"></div>
      </dialog>
    </div>
  `,
  styles: [`
    .mfe { display: flex; flex-direction: column; gap: 12px; align-items: flex-start;
      font-family: system-ui, Arial, sans-serif; max-width: 640px; }
    .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    input { padding: 8px 10px; border: 1px solid #ccc; border-radius: 6px;
      font-family: ui-monospace, monospace; font-size: 13px; }
    input:not(.repo) { min-width: 280px; }
    .repo { width: 360px; }
    button { padding: 8px 16px; border: 0; border-radius: 6px; background: #1473e6;
      color: #fff; font-size: 14px; cursor: pointer; }
    button[disabled] { background: #ccc; cursor: not-allowed; }
    button.ghost { background: #f0f0f0; color: #333; }
    .ok { color: #256029; font-size: 13px; }
    .steps { margin: 0; padding-left: 20px; font-size: 14px; color: #999; }
    .steps li { margin: 2px 0; }
    .steps li.active { color: #1473e6; font-weight: 600; }
    .steps li.done { color: #256029; }
    .steps li.done::marker { content: '✓ '; }
    .status { margin: 0; font-size: 13px; color: #444; }
    .dialog { border: 0; border-radius: 8px; padding: 0; width: min(90vw, 640px);
      height: min(88vh, 900px); box-shadow: 0 8px 32px rgba(0,0,0,.24); }
    .dialog .mount { width: 100%; height: 100%; }
    .dialog--upload[open] { display: flex; flex-direction: column; }
    .dialog--upload .head { display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px; border-bottom: 1px solid #eee; font-weight: 600; font-size: 14px; }
    .dialog--upload .mount { flex: 1; height: auto; }
  `]
})
export class ContentAdvisorComponent {
  @ViewChild('destDialog') destDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('destMount') destMount!: ElementRef<HTMLDivElement>;
  @ViewChild('uploadDialog') uploadDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('uploadMount') uploadMount!: ElementRef<HTMLDivElement>;

  token: string | null = localStorage.getItem('mfe.token');
  repoId = localStorage.getItem('mfe.repoId') || DEFAULT_REPO_ID;
  phase: Phase = 'idle';
  status = '';

  private file: File | null = null;
  private uploadStarted = false;
  private uploadEl: HTMLElement | null = null;

  // MFE callbacks fire outside Angular's zone (across the iframe), so re-enter it.
  constructor(private zone: NgZone) {}

  get running(): boolean {
    return this.phase === 'generating' || this.phase === 'selecting' || this.phase === 'uploading';
  }

  isDone(step: number): boolean {
    const order: Phase[] = ['idle', 'generating', 'selecting', 'uploading', 'done'];
    return order.indexOf(this.phase) > step; // step 1..3 map to generating..uploading
  }

  useToken(input: HTMLInputElement): void {
    const t = input.value.trim();
    if (!t) return;
    this.token = t;
    localStorage.setItem('mfe.token', t);
    input.value = '';
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('mfe.token');
  }

  setRepo(e: Event): void {
    this.repoId = (e.target as HTMLInputElement).value.trim();
    localStorage.setItem('mfe.repoId', this.repoId);
  }

  async startFlow(): Promise<void> {
    if (!this.token || !this.repoId) return;
    this.uploadStarted = false;
    this.phase = 'generating';
    this.status = 'Generating image…';
    this.file = await createGeneratedImageFile();

    // Render each MFE into a FRESH child element per run. Re-rendering an MFE into a
    // container it was previously mounted in (or one cleared with innerHTML) can leave
    // the selector blank on the next run; a new element gives it a clean mount.
    this.uploadEl = this.freshMount(this.uploadMount.nativeElement);

    // Warm the Upload MFE (kicks off repository discovery) into the still-closed
    // modal, so it is ready by the time the user confirms a folder.
    this.renderUpload(null);

    this.phase = 'selecting';
    this.status = 'Choose a destination…';
    PureJSSelectors.renderDestinationSelector(this.freshMount(this.destMount.nativeElement), {
      imsToken: this.token,
      imsClientId: environment.imsClientId,
      imsOrg: environment.imsOrg,
      initRepoId: this.repoId,
      aemTierType: ['author'],
      onConfirm: (d: any) => this.zone.run(() => this.onConfirm(d)),
      onClose: () => this.zone.run(() => this.destDialog.nativeElement.close()),
    });
    this.destDialog.nativeElement.showModal();
  }

  private onConfirm(destination: any): void {
    const path = destination?.['repo:path'] ?? destination?.path;
    this.destDialog.nativeElement.close();
    if (!path) {
      this.status = 'No destination chosen.';
      return;
    }
    this.phase = 'uploading';
    this.status = `Uploading to ${path}…`;
    this.uploadDialog.nativeElement.showModal();
    // Commit the chosen folder (a post-mount change) -> onPropsCommitted -> initiate.
    this.renderUpload(path);
  }

  private renderUpload(targetUploadPath: string | null): void {
    if (!this.uploadEl) return;
    UploadCoordinator.renderAllInOneUpload(this.uploadEl, {
      env: 'PROD',
      apiToken: this.token,
      repositoryId: this.repoId,
      files: this.file ? [this.file] : [],
      hideUploadButton: true,
      ...(targetUploadPath ? { targetUploadPath } : {}),
      onPropsCommitted: () =>
        this.zone.run(() => {
          if (this.uploadStarted) return;
          this.uploadStarted = true;
          const iframe = document.getElementById(UPLOAD_IFRAME_ID) as HTMLIFrameElement | null;
          UploadCoordinator.initiateUpload(iframe);
        }),
      onUploadComplete: (stats: any) =>
        this.zone.run(() => {
          this.phase = 'done';
          this.status = `Done — uploaded ${stats.totalDone}/${stats.totalFiles}, errors ${stats.totalError}.`;
        }),
    });
  }

  closeUpload(): void {
    this.uploadDialog.nativeElement.close();
  }

  /** Replace a host's contents with a fresh child element for a clean MFE mount. */
  private freshMount(host: HTMLElement): HTMLElement {
    host.innerHTML = '';
    const el = document.createElement('div');
    el.style.width = '100%';
    el.style.height = '100%';
    host.appendChild(el);
    return el;
  }

  /** Reset the process (keeps the token + repository). */
  restart(): void {
    this.destDialog?.nativeElement.close();
    this.uploadDialog?.nativeElement.close();
    this.destMount.nativeElement.innerHTML = '';
    this.uploadMount.nativeElement.innerHTML = '';
    this.uploadEl = null;
    this.file = null;
    this.uploadStarted = false;
    this.phase = 'idle';
    this.status = '';
  }
}
