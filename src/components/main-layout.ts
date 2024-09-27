import { MyComponent, type ComponentProps } from "./definitions";

export class MainLayout extends MyComponent {
    container: HTMLDivElement;
    constructor(props: ComponentProps = {}) {
        super(props);
        this.container = document.createElement("div");
        this.container.innerHTML = "Hello, world";
    }
}