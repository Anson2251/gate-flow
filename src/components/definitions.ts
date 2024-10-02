export type CommonPropsType = Record<string, unknown>;

export abstract class MyComponent<T extends CommonPropsType> {
    props: T = {} as T;
    container: HTMLDivElement;
    constructor(props: T) {
        this.props = props;
        this.container = document.createElement("div");
    }

    async mount(parent: HTMLElement) {
        this.render();
        parent.appendChild(this.container);
    }

    setProps(props: Partial<T>) {
        this.props = { ...this.props, ...props };
    }

    update(props: Partial<T>) {
        const oldProps = JSON.parse(JSON.stringify(this.props)) as T;
        this.setProps(props);
        this.onUpdate(oldProps, this.props);
    }

    abstract onUpdate(oldProps: T, newProps: T): void

    abstract render(): void;
}