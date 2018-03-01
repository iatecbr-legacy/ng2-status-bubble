export class StatusBubbleModel {
    public label: string;
    public value: any;
    public number: string | number;
    public color?: string;

    constructor(
        label: string,
        value: any,
        number: string | number,
        color?: string,
    ) {
        this.label = label;
        this.value = value;
        this.number = number;
        this.color = color;
    }
}