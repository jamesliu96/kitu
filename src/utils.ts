import { Line } from './geo.js';
import { Kitu, KituConfig } from './kitu.js';
import { Vec } from './vec.js';

export const createCtx = ({
  width = 100,
  height = 100,
  contextOptions,
}: KituConfig) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d', contextOptions);
  if (!ctx)
    throw new Kitu.DOMError('CanvasRenderingContext2D cannot be initialized');
  return ctx;
};

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  p: Vec,
  style: CanvasFillStrokeStyles['fillStyle'],
  size = 4 * devicePixelRatio,
  text?: string | boolean,
  textStyle?: CanvasFillStrokeStyles['fillStyle']
) => {
  ctx.fillStyle = style;
  ctx.fillRect(
    p.x * devicePixelRatio - size / 2,
    p.y * devicePixelRatio - size / 2,
    size,
    size
  );
  if (text) {
    ctx.font = `${10 * devicePixelRatio}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (textStyle) ctx.fillStyle = textStyle;
    ctx.fillText(
      typeof text === 'string' ? text : `[${p.x.toFixed()},${p.y.toFixed()}]`,
      p.x * devicePixelRatio,
      p.y * devicePixelRatio
    );
  }
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  l: Line,
  style: CanvasFillStrokeStyles['strokeStyle']
) => {
  ctx.beginPath();
  ctx.moveTo(l.a.x * devicePixelRatio, l.a.y * devicePixelRatio);
  ctx.lineTo(l.b.x * devicePixelRatio, l.b.y * devicePixelRatio);
  ctx.lineWidth = 1 * devicePixelRatio;
  ctx.strokeStyle = style;
  ctx.stroke();
};
