export type Interval = {
  left: number;
  right: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const hullCache = new Map<string, Promise<Point[]>>();

export function carveSlots(
  base: Interval,
  blocked: Interval[],
  minSlotWidth: number,
): Interval[] {
  let slots = [base];
  for (let blockedIndex = 0; blockedIndex < blocked.length; blockedIndex++) {
    const obstacle = blocked[blockedIndex]!;
    const next: Interval[] = [];
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      const slot = slots[slotIndex]!;
      if (obstacle.right <= slot.left || obstacle.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (obstacle.left > slot.left) next.push({ left: slot.left, right: obstacle.left });
      if (obstacle.right < slot.right) next.push({ left: obstacle.right, right: slot.right });
    }
    slots = next;
  }

  return slots.filter(slot => slot.right - slot.left >= minSlotWidth);
}

export function getRectIntervalForBand(
  rect: Rect,
  bandTop: number,
  bandBottom: number,
  horizontalPadding: number,
  verticalPadding: number,
): Interval | null {
  if (
    bandBottom <= rect.y - verticalPadding ||
    bandTop >= rect.y + rect.height + verticalPadding
  ) {
    return null;
  }

  return {
    left: rect.x - horizontalPadding,
    right: rect.x + rect.width + horizontalPadding,
  };
}

export function transformWrapPoints(points: Point[], rect: Rect): Point[] {
  return points.map(point => ({
    x: rect.x + point.x * rect.width,
    y: rect.y + point.y * rect.height,
  }));
}

export function getPolygonIntervalForBand(
  points: Point[],
  bandTop: number,
  bandBottom: number,
  horizontalPadding: number,
  verticalPadding: number,
): Interval | null {
  const sampleTop = bandTop - verticalPadding;
  const sampleBottom = bandBottom + verticalPadding;
  const startY = Math.floor(sampleTop);
  const endY = Math.ceil(sampleBottom);
  let left = Infinity;
  let right = -Infinity;

  for (let y = startY; y <= endY; y++) {
    const xs = getPolygonXsAtY(points, y + 0.5);
    for (let index = 0; index + 1 < xs.length; index += 2) {
      const runLeft = xs[index]!;
      const runRight = xs[index + 1]!;
      if (runLeft < left) left = runLeft;
      if (runRight > right) right = runRight;
    }
  }

  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;
  return {
    left: left - horizontalPadding,
    right: right + horizontalPadding,
  };
}

export function getWrapHull(src: string): Promise<Point[]> {
  const cached = hullCache.get(src);
  if (cached !== undefined) return cached;
  const promise = buildWrapHull(src);
  hullCache.set(src, promise);
  return promise;
}

async function buildWrapHull(src: string): Promise<Point[]> {
  const image = new Image();
  image.src = src;
  await image.decode();

  const maxDimension = 320;
  const aspect = image.naturalWidth / image.naturalHeight;
  const width = aspect >= 1 ? maxDimension : Math.max(96, Math.round(maxDimension * aspect));
  const height = aspect >= 1 ? Math.max(96, Math.round(maxDimension / aspect)) : maxDimension;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx === null) throw new Error('2d context unavailable');

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  const lefts: Array<number | null> = new Array(height).fill(null);
  const rights: Array<number | null> = new Array(height).fill(null);
  const alphaThreshold = 12;

  for (let y = 0; y < height; y++) {
    let left = -1;
    let right = -1;
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]!;
      if (alpha < alphaThreshold) continue;
      if (left === -1) left = x;
      right = x;
    }
    if (left !== -1 && right !== -1) {
      lefts[y] = left;
      rights[y] = right + 1;
    }
  }

  const validRows: number[] = [];
  for (let y = 0; y < height; y++) {
    if (lefts[y] !== null && rights[y] !== null) validRows.push(y);
  }
  if (validRows.length === 0) throw new Error(`No opaque pixels in ${src}`);

  let boundLeft = Infinity;
  let boundRight = -Infinity;
  const boundTop = validRows[0]!;
  const boundBottom = validRows[validRows.length - 1]!;
  for (let index = 0; index < validRows.length; index++) {
    const y = validRows[index]!;
    const left = lefts[y]!;
    const right = rights[y]!;
    if (left < boundLeft) boundLeft = left;
    if (right > boundRight) boundRight = right;
  }

  const sampledRows: number[] = [];
  const step = Math.max(1, Math.floor(validRows.length / 42));
  for (let index = 0; index < validRows.length; index += step) {
    sampledRows.push(validRows[index]!);
  }
  if (sampledRows[sampledRows.length - 1] !== validRows[validRows.length - 1]) {
    sampledRows.push(validRows[validRows.length - 1]!);
  }

  const topOutline: Point[] = [];
  const bottomOutline: Point[] = [];
  const boundWidth = Math.max(1, boundRight - boundLeft);
  const boundHeight = Math.max(1, boundBottom - boundTop);

  for (let index = 0; index < sampledRows.length; index++) {
    const y = sampledRows[index]!;
    topOutline.push({
      x: (lefts[y]! - boundLeft) / boundWidth,
      y: (y - boundTop) / boundHeight,
    });
  }

  for (let index = sampledRows.length - 1; index >= 0; index--) {
    const y = sampledRows[index]!;
    bottomOutline.push({
      x: (rights[y]! - boundLeft) / boundWidth,
      y: (y - boundTop) / boundHeight,
    });
  }

  return [...topOutline, ...bottomOutline];
}

function getPolygonXsAtY(points: Point[], y: number): number[] {
  const xs: number[] = [];
  for (let index = 0, prev = points.length - 1; index < points.length; prev = index++) {
    const a = points[index]!;
    const b = points[prev]!;
    const intersects = (a.y > y) !== (b.y > y);
    if (!intersects) continue;
    xs.push(((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x);
  }
  xs.sort((a, b) => a - b);
  return xs;
}
