export interface Color {
  value: string;
  key: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  from: Point;
  to: Point;
  color: Color;
}

export class CanvasUtils {
  public static drawLine(
    canvas: {
      context: CanvasRenderingContext2D,
      width: number,
      height: number,
    },
    prevPos: { x: number, y: number },
    currentPos: { x: number, y: number },
    color: Color,
  ): void {
    if (!canvas.context) { return; }

    canvas.context.strokeStyle = color.value;
    canvas.context.beginPath();

    if (prevPos) {
      canvas.context.moveTo( prevPos.x * canvas.width, prevPos.y * canvas.height);
      canvas.context.lineTo(currentPos.x * canvas.width, currentPos.y * canvas.height);
      canvas.context.stroke();
    }
  }

  public static initCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, width: number, height: number): void {
    canvas.width = width;
    canvas.height = height;
    context.lineWidth = 3;
    context.lineCap = 'round';
  }
}
