import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderMemeOverlayToCanvas, CanvasOverlayOptions } from './canvasAgent';

describe('canvasAgent', () => {
  let mockContext: any;
  let mockCanvas: any;

  beforeEach(() => {
    mockContext = {
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn((text: string) => ({ width: text.length * 10 })), // mock measureText
      beginPath: vi.fn(),
      closePath: vi.fn(),
      arc: vi.fn(),
      roundRect: vi.fn(),
      clip: vi.fn(),
      drawImage: vi.fn(),
      fillStyle: '',
      shadowColor: '',
      shadowBlur: 0,
      strokeStyle: '',
      lineWidth: 0,
      font: '',
    };

    mockCanvas = {
      width: 1080,
      height: 1920,
      getContext: vi.fn(() => mockContext),
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,mockedbase64'),
    };
  });

  const defaultOptions: CanvasOverlayOptions = {
    caption: 'This pothole is so deep it leads to another dimension.',
    severity: 'CRITICAL',
    metrics: {
      depthCm: 15,
      areaSqM: 2.5,
      count: 1,
    },
    locationPin: '854330',
  };

  it('returns data URL immediately if getContext is null', () => {
    mockCanvas.getContext.mockReturnValueOnce(null);

    const result = renderMemeOverlayToCanvas(mockCanvas as any, defaultOptions);

    expect(result).toBe('data:image/jpeg;base64,mockedbase64');
    expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.92);
    expect(mockContext.fillRect).not.toHaveBeenCalled();
  });

  it('renders correctly with CRITICAL severity', () => {
    const result = renderMemeOverlayToCanvas(mockCanvas as any, defaultOptions);

    expect(result).toBe('data:image/jpeg;base64,mockedbase64');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');

    // Check stroke color for CRITICAL severity
    expect(mockContext.strokeStyle).toBe('#ef4444');

    // Check fillText calls (header, severity pill, caption, metrics)
    expect(mockContext.fillText).toHaveBeenCalled();
  });

  it('renders correctly with HIGH severity', () => {
    const result = renderMemeOverlayToCanvas(mockCanvas as any, {
      ...defaultOptions,
      severity: 'HIGH'
    });

    // Check stroke color for HIGH severity
    expect(mockContext.strokeStyle).toBe('#f97316');
  });

  it('wraps long text correctly based on measureText', () => {
    // measureText returns text.length * 10.
    // maxTextWidth = 1080 - 35*2 - 60 = 950
    // "A very very long text string that will surely wrap around to the next line because it exceeds the maximum width allowed"

    const longCaption = "Word word word word word word word word word word word word word word word word word word word word word word word word word word"; // 27 words * 5 chars + spaces = ~160 chars -> 1600 width > 950

    renderMemeOverlayToCanvas(mockCanvas as any, {
      ...defaultOptions,
      caption: longCaption
    });

    // We expect fillText to be called multiple times for the caption
    // Check that fillText was called more than 4 times (header, pill, metrics + multiple caption lines)
    expect(mockContext.fillText.mock.calls.length).toBeGreaterThan(4);
  });

  it('uses default location pin if none provided', () => {
    renderMemeOverlayToCanvas(mockCanvas as any, {
      ...defaultOptions,
      locationPin: undefined
    });

    expect(mockContext.fillText).toHaveBeenCalledWith(
      expect.stringContaining('854330'),
      expect.any(Number),
      expect.any(Number)
    );
  });
});
