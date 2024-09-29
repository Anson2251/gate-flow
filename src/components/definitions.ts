export type CommonPropsType = Record<string, unknown>;

export class MyComponent<T extends CommonPropsType> {
    props: T;
    container: HTMLDivElement;
    constructor(props: T) {
        this.props = props;
        this.container = document.createElement("div");
    }

    mount(parent: HTMLElement) {
        parent.appendChild(this.container);
    }
}