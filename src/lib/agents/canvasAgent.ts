/**
 * Agent 3: Dynamic Image Canvas Renderer
 * Superimposes text, spatial badges, and Kasba 854330 branding onto captured image canvas
 */

export interface CanvasOverlayOptions {
  caption: string;
  subtext?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  metrics: {
    depthCm: number;
    areaSqM: number;
    count: number;
  };
  locationPin?: string;
}

export function renderMemeOverlayToCanvas(
  canvas: HTMLCanvasElement,
  options: CanvasOverlayOptions
): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas.toDataURL('image/jpeg', 0.92);

  const width = canvas.width;
  const height = canvas.height;

  // 1. Draw sleek dark glass overlay container at bottom
  const containerHeight = Math.floor(height * 0.26);
  const padding = 35;
  const containerY = height - containerHeight - padding;

  // Background Box
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 30;
  ctx.fillRect(padding, containerY, width - padding * 2, containerHeight);

  // Border Accent
  ctx.strokeStyle = options.severity === 'CRITICAL' ? '#ef4444' : '#f97316';
  ctx.lineWidth = 6;
  ctx.strokeRect(padding, containerY, width - padding * 2, containerHeight);
  ctx.restore();

  // 2. Render Kasba Geofence Header Badge
  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = '#f97316';
  ctx.fillText(
    `📍 KASBA - ${options.locationPin || '854330'} VERIFIED REPORT`,
    padding + 30,
    containerY + 50
  );

  // Severity Pill Right
  ctx.fillStyle = options.severity === 'CRITICAL' ? '#dc2626' : '#ea580c';
  const pillWidth = 240;
  ctx.fillRect(width - padding - pillWidth - 30, containerY + 20, pillWidth, 42);
  ctx.font = 'black 22px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(
    `${options.severity} DEFECT`,
    width - padding - pillWidth - 15,
    containerY + 48
  );

  // 3. Render Meme Caption
  ctx.font = 'bold 40px sans-serif';
  ctx.fillStyle = '#ffffff';
  
  // Wrap caption text if necessary
  const maxTextWidth = width - padding * 2 - 60;
  const words = options.caption.split(' ');
  let line = '';
  let yPos = containerY + 115;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTextWidth && n > 0) {
      ctx.fillText(line, padding + 30, yPos);
      line = words[n] + ' ';
      yPos += 48;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, padding + 30, yPos);

  // 4. Render Spatial Metrics Bar
  const metricsY = containerY + containerHeight - 35;
  ctx.font = 'bold 30px sans-serif';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(
    `📏 Depth: ${options.metrics.depthCm}cm | 📐 Area: ${options.metrics.areaSqM}m² | 🕳️ Count: ${options.metrics.count}`,
    padding + 30,
    metricsY
  );

  return canvas.toDataURL('image/jpeg', 0.92);
}
