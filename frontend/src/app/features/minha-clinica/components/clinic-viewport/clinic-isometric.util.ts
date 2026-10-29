import { IsometricTileRender } from './clinic-viewport.component';

export interface GridToScreenFn {
  (gx: number, gy: number, ox: number, oy: number): { x: number; y: number };
}

export interface WallSliceRender {
  side: 'NW' | 'NE';
  index: number;
  points: string;
}

/**
 * Utilitários puros de geometria e projeção isométrica 2.5D (tile 64x32px).
 */
export class ClinicIsometricUtil {
  static computeTiles(
    w: number,
    h: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn
  ): IsometricTileRender[] {
    const list: IsometricTileRender[] = [];
    for (let gy = 0; gy < h; gy++) {
      for (let gx = 0; gx < w; gx++) {
        const top = gridToScreen(gx, gy, ox, oy);
        const right = gridToScreen(gx + 1, gy, ox, oy);
        const bottom = gridToScreen(gx + 1, gy + 1, ox, oy);
        const left = gridToScreen(gx, gy + 1, ox, oy);

        let zone: 'main' | 'pediatria' | 'hall' | 'lounge' = 'main';
        if (gx < 2 && gy < 2) {
          zone = 'main';
        } else if (gx >= 2 && gy < 2) {
          zone = 'pediatria';
        } else if (gx < 2 && gy >= 2) {
          zone = 'hall';
        } else {
          zone = 'lounge';
        }

        const center = gridToScreen(gx + 0.5, gy + 0.5, ox, oy);
        list.push({
          gridX: gx,
          gridY: gy,
          screenX: center.x,
          screenY: center.y,
          points: `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`,
          zone
        });
      }
    }
    return list;
  }

  static computeLeftWallPoints(
    h: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    wallH = 68
  ): string {
    const topOrigin = gridToScreen(0, 0, ox, oy);
    const leftCorner = gridToScreen(0, h, ox, oy);
    return `${leftCorner.x},${leftCorner.y} ${topOrigin.x},${topOrigin.y} ${topOrigin.x},${topOrigin.y - wallH} ${leftCorner.x},${leftCorner.y - wallH}`;
  }

  static computeRightWallPoints(
    w: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    wallH = 68
  ): string {
    const topOrigin = gridToScreen(0, 0, ox, oy);
    const rightCorner = gridToScreen(w, 0, ox, oy);
    return `${topOrigin.x},${topOrigin.y} ${rightCorner.x},${rightCorner.y} ${rightCorner.x},${rightCorner.y - wallH} ${topOrigin.x},${topOrigin.y - wallH}`;
  }

  static computeWindowLeftPoints(
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn
  ): string {
    const p1 = gridToScreen(0, 1, ox, oy);
    const p2 = gridToScreen(0, 3, ox, oy);
    return `${p2.x},${p2.y - 16} ${p1.x},${p1.y - 16} ${p1.x},${p1.y - 50} ${p2.x},${p2.y - 50}`;
  }

  static computePlaqueRightPoints(
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn
  ): string {
    const p1 = gridToScreen(1, 0, ox, oy);
    const p2 = gridToScreen(2.2, 0, ox, oy);
    return `${p1.x},${p1.y - 22} ${p2.x},${p2.y - 22} ${p2.x},${p2.y - 46} ${p1.x},${p1.y - 46}`;
  }

  static computeSlabLeftLipPoints(
    w: number,
    h: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    lipHeight = 10
  ): string {
    const left = gridToScreen(0, h, ox, oy);
    const bottom = gridToScreen(w, h, ox, oy);
    return `${left.x},${left.y} ${bottom.x},${bottom.y} ${bottom.x},${bottom.y + lipHeight} ${left.x},${left.y + lipHeight}`;
  }

  static computeSlabRightLipPoints(
    w: number,
    h: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    lipHeight = 10
  ): string {
    const right = gridToScreen(w, 0, ox, oy);
    const bottom = gridToScreen(w, h, ox, oy);
    return `${bottom.x},${bottom.y} ${right.x},${right.y} ${right.x},${right.y + lipHeight} ${bottom.x},${bottom.y + lipHeight}`;
  }

  static computeSlabShadowPoints(
    w: number,
    h: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    offsetY = 18
  ): string {
    const shadowOy = oy + offsetY;
    const top = gridToScreen(0, 0, ox, shadowOy);
    const right = gridToScreen(w, 0, ox, shadowOy);
    const bottom = gridToScreen(w, h, ox, shadowOy);
    const left = gridToScreen(0, h, ox, shadowOy);
    return `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`;
  }

  static computeWallSlices(
    side: 'NW' | 'NE',
    count: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    wallH = 68
  ): WallSliceRender[] {
    const slices: WallSliceRender[] = [];
    for (let i = 0; i < count; i++) {
      if (side === 'NW') {
        const b0 = gridToScreen(0, i, ox, oy);
        const b1 = gridToScreen(0, i + 1, ox, oy);
        slices.push({
          side,
          index: i,
          points: `${b1.x},${b1.y} ${b0.x},${b0.y} ${b0.x},${b0.y - wallH} ${b1.x},${b1.y - wallH}`
        });
      } else {
        const b0 = gridToScreen(i, 0, ox, oy);
        const b1 = gridToScreen(i + 1, 0, ox, oy);
        slices.push({
          side,
          index: i,
          points: `${b0.x},${b0.y} ${b1.x},${b1.y} ${b1.x},${b1.y - wallH} ${b0.x},${b0.y - wallH}`
        });
      }
    }
    return slices;
  }
}
