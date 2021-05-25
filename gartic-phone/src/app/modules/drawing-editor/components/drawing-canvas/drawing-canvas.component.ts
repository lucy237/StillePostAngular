import { Component, Input, ViewChild, ElementRef, EventEmitter, AfterViewInit, Output, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { delay, pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { Color, Line, CanvasUtils } from '../../utils/CanvasUtils';

@Component({
    selector: 'app-drawing-canvas',
    templateUrl: './drawing-canvas.component.html',
    styleUrls: ['./drawing-canvas.component.scss'],
})
export class DrawingCanvasComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvasElement', { static: false }) canvasElement: ElementRef | null = null;
    @ViewChild('secondCanvas', { static: false }) testCanvas: ElementRef | null = null;
    context: CanvasRenderingContext2D | null = null;
    testContext: CanvasRenderingContext2D | null = null;

    @Input() public width = window.innerWidth * 0.7;
    @Input() public widthTestCanvas = 600;
    @Input() public height = (1.5 * window.innerWidth) / 4;
    @Input() public heightTestCanvas = 600;

    @Input() public color: Color = { value: '#a23', key: 'test' };

    dataPoints: Array<Line> = [];
    mouseDownSubscription: Subscription | null = null;
    mouseUpSubscription: Subscription | null = null;

    @Output() drawingChanged = new EventEmitter<{ base64: string; width: number; height: number }>();

    ngAfterViewInit(): void {
        if (this.canvasElement) {
            const canvasEl: HTMLCanvasElement = this.canvasElement?.nativeElement;
            this.context = canvasEl.getContext('2d');
            if (this.context) {
                CanvasUtils.initCanvas(canvasEl, this.context, this.width, this.height);
            }

            this.captureEvents(canvasEl); // start capturing drawing events on normal canvas
        }

        // setup test canvas
        if (this.testCanvas) {
            this.testContext = this.testCanvas.nativeElement.getContext('2d');
            if (this.testContext) {
                CanvasUtils.initCanvas(
                    this.testCanvas.nativeElement,
                    this.testContext,
                    this.widthTestCanvas,
                    this.heightTestCanvas
                );
            }
        }
    }

    private captureEvents(canvasEl: HTMLCanvasElement): void {
        this.mouseDownSubscription = fromEvent(canvasEl, 'mousedown')
            .pipe(
                switchMap((e) => {
                    return fromEvent(canvasEl, 'mousemove').pipe(
                        takeUntil(fromEvent(canvasEl, 'mouseup')),
                        takeUntil(fromEvent(canvasEl, 'mouseleave')),
                        pairwise()
                    );
                })
            )
            .subscribe((result) => {
                const rect = canvasEl.getBoundingClientRect();
                const previous = result[0] as MouseEvent;
                const current = result[1] as MouseEvent;

                const prevPos = {
                    x: (previous.clientX - rect.left) / this.width,
                    y: (previous.clientY - rect.top) / this.height,
                };

                const currentPos = {
                    x: (current.clientX - rect.left) / this.width,
                    y: (current.clientY - rect.top) / this.height,
                };
                this.dataPoints.push({ from: prevPos, to: currentPos, color: this.color });

                if (this.context) {
                    CanvasUtils.drawLine(
                        { context: this.context, width: this.width, height: this.height },
                        prevPos,
                        currentPos,
                        this.color
                    );
                }
            });

        this.mouseUpSubscription = fromEvent(canvasEl, 'mouseup')
            .pipe(delay(500))
            .subscribe(() => {
                this.drawingChanged.emit({
                    base64: this.canvasElement?.nativeElement.toDataURL(),
                    width: this.width,
                    height: this.height,
                });
            });
    }

    redrawCanvas(): void {
        if (!this.testContext) {
            return;
        }
        this.testContext.clearRect(0, 0, this.width, this.height); // clear before redraw
        this.dataPoints.forEach((line) => {
            const currentPos = line.from;
            const prevPos = line.to;
            if (this.testContext) {
                CanvasUtils.drawLine(
                    {
                        context: this.testContext,
                        width: this.widthTestCanvas,
                        height: this.heightTestCanvas,
                    },
                    prevPos,
                    currentPos,
                    line.color
                );
            }
        });
    }

    clearCanvas(): void {
        this.context?.clearRect(0, 0, this.width, this.height);
        this.dataPoints = [];
    }

    ngOnDestroy(): void {
        this.mouseUpSubscription?.unsubscribe();
        this.mouseDownSubscription?.unsubscribe();
    }
}
