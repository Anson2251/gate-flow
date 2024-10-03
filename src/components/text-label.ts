import { MyComponent } from "./definitions";

type TextLabelProps = {
    text: string,
    color: string,
    font: string,
    size: number,
    pos: number[]
}

export class TextLabel extends MyComponent<TextLabelProps> {
    constructor(props: TextLabelProps) {
        super(props);
    }

    onUpdate(): void {
        this.render();
    }

    render(): void {
        this.container.style.position = "absolute";
        this.container.style.left = `${this.props.pos[0]}px`;
        this.container.style.top = `${this.props.pos[1]}px`;

        this.container.style.color = this.props.color;
        this.container.style.font = this.props.font;
        this.container.style.fontSize = `${this.props.size}px`;
        this.container.textContent = this.props.text;
    }
}
