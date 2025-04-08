class Bubble {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  x: number;
  y: number;
  size: number;
  initialY: number;
  progress: number;
  progressSpeed: number;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D context");
    }

    this.canvas = canvas;
    this.context = context;

    this.x = Math.random() * this.canvas.width;
    this.initialY = this.canvas.height + Math.random() * 20;
    this.y = this.initialY;
    this.size = Math.random() * 2 + 2;
    this.progress = 0;
    this.progressSpeed = Math.random() * 0.0005 + 0.001;
  }

  update() {
    this.progress += this.progressSpeed + this.progress * 0.0005;
    this.y = this.initialY - bubbleEasing(this.progress) * this.canvas.height;

    return this.y + this.size > 0 && this.progress < 1;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.context.fill();
  }
}

export const bubbleEasing = (progress: number) => Math.pow(progress, 2);

export default Bubble;
