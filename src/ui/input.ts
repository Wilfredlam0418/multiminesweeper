export interface InputCallbacks {
  onLeftClick(row: number, col: number): void;
  onCycleMarker(row: number, col: number): void;
  onSpace?(row: number, col: number): void;
  onChord(row: number, col: number): void;
}

interface CellPos {
  row: number;
  col: number;
}

export class InputHandler {
  private contextMenuHandler = (e: Event) => e.preventDefault();
  private cursorPos: CellPos | null = null;
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code !== "Space") return;
    if (!this.cursorPos) return;
    e.preventDefault();
    if (this.callbacks.onSpace) this.callbacks.onSpace(this.cursorPos.row, this.cursorPos.col);
  };

  constructor(
    private canvas: HTMLCanvasElement,
    private toCell: (px: number, py: number) => CellPos | null,
    private callbacks: InputCallbacks,
  ) {
    this.attach();
  }

  private attach(): void {
    this.canvas.addEventListener("mousedown", this.onMouse);
    this.canvas.addEventListener("contextmenu", this.contextMenuHandler);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseleave", this.onMouseLeave);
    window.addEventListener("keydown", this.onKeyDown);
  }

  detach(): void {
    this.canvas.removeEventListener("mousedown", this.onMouse);
    this.canvas.removeEventListener("contextmenu", this.contextMenuHandler);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mouseleave", this.onMouseLeave);
    window.removeEventListener("keydown", this.onKeyDown);
  }

  private onMouse = (e: MouseEvent): void => {
    e.preventDefault();
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const pos = this.toCell(px, py);
    if (!pos) return;

    switch (e.button) {
      case 0: this.callbacks.onLeftClick(pos.row, pos.col); break;
      case 1: this.callbacks.onChord(pos.row, pos.col); break;
      case 2: this.callbacks.onCycleMarker(pos.row, pos.col); break;
    }
  };

  private onMouseMove = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const pos = this.toCell(px, py);
    this.cursorPos = pos;
  };

  private onMouseLeave = (): void => {
    this.cursorPos = null;
  };
}
