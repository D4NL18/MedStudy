import { IsometricTileRender } from './clinic-viewport.component';

export interface GridToScreenFn {
  (gx: number, gy: number, ox: number, oy: number): { x: number; y: number };
}

export interface WallSliceRender {
  side: 'NW' | 'NE';
  index: number;
  points: string;
}

export interface WallBrickRender {
  points: string;
  fill: string;
  stroke: string;
  highlightLine?: { x1: number; y1: number; x2: number; y2: number };
}

export interface WallFacetRender {
  points: string;
  fill: string;
  stroke: string;
  opacity: number;
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

        let zone: 'main' | 'pediatria' | 'hall' | 'lounge';
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

  static computeWallBricks(
    side: 'NW' | 'NE',
    count: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    wallH = 68
  ): WallBrickRender[] {
    const list: WallBrickRender[] = [];
    const nCourses = 6;
    const hc = wallH / nCourses;
    const my = 1.6;
    const hBrick = hc - my;
    const sWidth = 0.5;
    const ms = 0.04;
    const sBrick = sWidth - ms;

    const getPoint = (s: number, elev: number) => {
      const base = side === 'NW'
        ? gridToScreen(0, s, ox, oy)
        : gridToScreen(s, 0, ox, oy);
      return {
        x: Number(base.x.toFixed(1)),
        y: Number((base.y - elev).toFixed(1))
      };
    };

    for (let c = 0; c < nCourses; c++) {
      const eBot = c * hc + my;
      const eTop = eBot + hBrick;
      const offset = (c % 2 === 1) ? 0.25 : 0.0;
      for (let s = -0.5; s < count + 0.5; s += sWidth) {
        const sStart = s + offset;
        const sEnd = sStart + sBrick;
        const b0 = getPoint(sStart, eBot);
        const b1 = getPoint(sEnd, eBot);
        const t1 = getPoint(sEnd, eTop);
        const t0 = getPoint(sStart, eTop);

        const isAlt = (Math.floor(sStart * 4) + c) % 3 === 0;
        const isAlt2 = (Math.floor(sStart * 4) + c) % 4 === 0;
        let fill = '#F1F5F9';
        if (isAlt) {
          fill = '#FFFFFF';
        } else if (isAlt2) {
          fill = '#F8FAFC';
        }

        list.push({
          points: `${b0.x},${b0.y} ${b1.x},${b1.y} ${t1.x},${t1.y} ${t0.x},${t0.y}`,
          fill,
          stroke: '#CBD5E1',
          highlightLine: { x1: t0.x, y1: t0.y, x2: t1.x, y2: t1.y }
        });
      }
    }
    return list;
  }

  static computeWallGeometricFacets(
    side: 'NW' | 'NE',
    count: number,
    ox: number,
    oy: number,
    gridToScreen: GridToScreenFn,
    wallH = 68
  ): WallFacetRender[] {
    const list: WallFacetRender[] = [];
    const getPoint = (s: number, elev: number) => {
      const base = side === 'NW'
        ? gridToScreen(0, s, ox, oy)
        : gridToScreen(s, 0, ox, oy);
      return {
        x: Number(base.x.toFixed(1)),
        y: Number((base.y - elev).toFixed(1))
      };
    };

    const palettes = [
      ['#5EEAD4', '#14B8A6', '#2DD4BF', '#0D9488', '#99F6E4', '#CCFBF1'],
      ['#99F6E4', '#0D9488', '#5EEAD4', '#115E59', '#CCFBF1', '#2DD4BF'],
      ['#2DD4BF', '#115E59', '#99F6E4', '#047857', '#5EEAD4', '#A7F3D0'],
    ];

    for (let i = 0; i < count; i++) {
      const pal = palettes[i % palettes.length];
      const botL = getPoint(i, 0);
      const botR = getPoint(i + 1, 0);
      const topL = getPoint(i, wallH);
      const topR = getPoint(i + 1, wallH);
      const midL = getPoint(i, wallH / 2);
      const midR = getPoint(i + 1, wallH / 2);
      const center = getPoint(i + 0.5, wallH / 2);

      list.push(
        {
          points: `${topL.x},${topL.y} ${topR.x},${topR.y} ${center.x},${center.y}`,
          fill: pal[0],
          stroke: '#0D9488',
          opacity: 0.60
        },
        {
          points: `${topL.x},${topL.y} ${center.x},${center.y} ${midL.x},${midL.y}`,
          fill: pal[1],
          stroke: '#0D9488',
          opacity: 0.65
        },
        {
          points: `${midL.x},${midL.y} ${center.x},${center.y} ${botL.x},${botL.y}`,
          fill: pal[2],
          stroke: '#0D9488',
          opacity: 0.50
        },
        {
          points: `${botL.x},${botL.y} ${center.x},${center.y} ${botR.x},${botR.y}`,
          fill: pal[3],
          stroke: '#0D9488',
          opacity: 0.45
        }
      );
      list.push({
        points: `${botR.x},${botR.y} ${center.x},${center.y} ${midR.x},${midR.y}`,
        fill: pal[4],
        stroke: '#0D9488',
        opacity: 0.70
      });
      list.push({
        points: `${midR.x},${midR.y} ${center.x},${center.y} ${topR.x},${topR.y}`,
        fill: pal[5],
        stroke: '#0D9488',
        opacity: 0.75
      });
    }
    return list;
  }
}
