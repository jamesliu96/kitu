import { Kitu } from './kitu.js';
export const createCtx = ({ width = 100, height = 100, contextOptions, }) => {
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
export const drawPoint = (ctx, p, style, size = 4 * devicePixelRatio, text, textStyle) => {
    ctx.fillStyle = style;
    ctx.fillRect(p.x * devicePixelRatio - size / 2, p.y * devicePixelRatio - size / 2, size, size);
    if (text) {
        ctx.font = `${10 * devicePixelRatio}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (textStyle)
            ctx.fillStyle = textStyle;
        ctx.fillText(typeof text === 'string' ? text : `[${p.x.toFixed()},${p.y.toFixed()}]`, p.x * devicePixelRatio, p.y * devicePixelRatio);
    }
};
export const drawLine = (ctx, l, style) => {
    ctx.beginPath();
    ctx.moveTo(l.a.x * devicePixelRatio, l.a.y * devicePixelRatio);
    ctx.lineTo(l.b.x * devicePixelRatio, l.b.y * devicePixelRatio);
    ctx.lineWidth = 1 * devicePixelRatio;
    ctx.strokeStyle = style;
    ctx.stroke();
};
//# sourceMappingURL=utils.js.map