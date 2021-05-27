import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawingCanvasComponent } from './components/drawing-canvas/drawing-canvas.component';
import { DrawingEditorComponent } from './components/drawing-editor/drawing-editor.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

@NgModule({
    declarations: [ColorPickerComponent, DrawingCanvasComponent, DrawingEditorComponent],
    imports: [CommonModule],
    exports: [ColorPickerComponent, DrawingCanvasComponent, DrawingEditorComponent],
})
export class DrawingEditorModule {}
