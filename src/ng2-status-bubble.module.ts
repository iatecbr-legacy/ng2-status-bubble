import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusBubbleComponent } from './status-bubble.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [ StatusBubbleComponent ],
    exports: [ StatusBubbleComponent ],
})
export class Ng2StatusBubbleModule { }
