/*
 * Copyright 2026 Adobe. All rights reserved.
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
 * Creates a small PNG `File` in the browser to stand in for a host-generated image
 * (e.g. the output of an LLM/creative tool). Kept out of the component so the example
 * stays focused on the micro-frontend composition.
 */
export async function createGeneratedImageFile(): Promise<File> {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1473e6');
    grad.addColorStop(1, '#ec5b62');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '600 56px system-ui, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Generated asset', size / 2, size / 2);
  }
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), 'image/png')
  );
  return new File([blob], `generated-image-${Date.now()}.png`, { type: 'image/png' });
}
