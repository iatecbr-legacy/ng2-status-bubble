import { Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { StatusBubbleModel } from './status-bubble.model';

@Component({
    selector: 'status-bubble',
    template: `
        <div *ngFor="let item of list; let i = index" class="box-bubble" 
            [ngClass]="{'disabled': disabled, 'selected': this.selecteds.indexOf(item) >= 0}" (click)="onClickItem(item)">
            <div id="bb-{{i}}" class="bubble" [style.border-color]="this.selecteds.indexOf(item) >= 0 ? item.color : '#ccc'">
                <span>{{item.number}}</span>
            </div>
            <div class="title" style="padding: 4px; user-select: none;">
                <i *ngIf="item.value" [style.color]="item.color" class="fa fa-circle" aria-hidden="true"></i> {{item.label}}
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
        }
        .box-bubble {
            flex: 1;
            text-align: center;
            cursor: pointer;
        }
        .bubble {
            display: inline-block;
            height: 75px;
            width: 75px;
            border-radius: 50%;
            background-color: #f5f5f5;
            border: 5px solid;
        }
        .bubble span {
            font-size: 24px;
            display: inline-block;
            padding-top: calc(50% - 18px);    
            pointer-events: none;        
            user-select: none;             
        }
        .disabled {
            opacity: .6;
            /*pointer-events: none;*/
            cursor: not-allowed;
        }
        .selected .bubble span, .selected .title {
            font-weight: 600;
        }

    `],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StatusBubbleComponent), multi: true },
    ]
})
export class StatusBubbleComponent implements ControlValueAccessor, OnChanges {

    private propagateChange: any = () => { };
    private currentValue: any;

    @Input() name: string;
    @Input() disabled: boolean;
    @Input() multiselect: boolean | string;
    @Input() selecteds: Array<string | number | StatusBubbleModel> = [];
    @Input() nameModel: string;
    @Input() list: Array<StatusBubbleModel> = [];
    @Output() listChange: EventEmitter<Array<StatusBubbleModel>> = new EventEmitter<Array<StatusBubbleModel>>();
    @Output() change: EventEmitter<number | string> = new EventEmitter<number | string>();

    private update(obj): void {
        if (obj == null) {
            this.selecteds = [];
        } else if (Array.isArray(obj)) {
            this.selecteds = [];
            obj.forEach(y => {
                this.list.forEach(x => {
                    if (x == y || y[this.nameModel] == x[this.nameModel] || x[this.nameModel] == obj)
                        this.onClickItem(x, true);
                })
            })
        } else {
            this.selecteds = [];
            this.list.forEach(x => {
                if (x == obj || obj[this.nameModel] == x[this.nameModel] || x[this.nameModel] == obj)
                    this.onClickItem(x, true);
            })
        }
    }

    public onClickItem(item: StatusBubbleModel, force: boolean = false): void {
        
        this.change.emit(item.value);

        if (this.disabled && !force)
            return;

        if (this.multiselect === undefined) {
            this.selecteds = [item];
        } else {
            let pos = this.selecteds.indexOf(item);
            if (pos >= 0) {
                this.selecteds.splice(pos, 1);
            } else {
                this.selecteds.push(item);
            }
        }

        let value;

        if (this.nameModel === undefined)
            this.propagateChange(this.selecteds.join(','));
        else {
            value = this.selecteds.map(x => x[this.nameModel]);
            if (this.selecteds.length >= 1)
                value = value.join(',');

        }
        this.propagateChange(value);

    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.list || changes.nameModel)
            this.update(this.currentValue);
    }

    writeValue(obj: any): void {
        if (obj === undefined)
            return;

        this.currentValue = obj;
        this.update(obj);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;        
    }

    registerOnTouched(fn: any): void { }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


}