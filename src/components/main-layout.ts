import { type CommonPropsType, MyComponent } from "./definitions";
import { LogicGate } from "./logic-gate";

export class MainLayout extends MyComponent<CommonPropsType> {
    container: HTMLDivElement;
    constructor(props: CommonPropsType) {
        super(props);
        this.container = document.createElement("div");
        this.container.innerHTML = "Hello, world";

        const l = new LogicGate({ type: "not", name: "NOT" });
        l.mount(this.container);
    }
}