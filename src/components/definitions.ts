export type ComponentProps = Record<string, any>;

export class MyComponent {
    props: ComponentProps;
    container: HTMLDivElement;
    constructor(props: ComponentProps) {
        this.props = props;
        this.container = document.createElement("div");
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
    }
}