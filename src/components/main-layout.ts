import { type CommonPropsType, MyComponent } from "./definitions";
import { LogicGate } from "./logic-gate";

export class MainLayout extends MyComponent<CommonPropsType> {
    constructor(props: CommonPropsType = {}) {
        super(props);
        this.update(props);
    }

    onUpdate(oldProps: CommonPropsType, newProps: CommonPropsType): void {
        console.log(oldProps, newProps);
    }

    render(): void {
        this.container.innerHTML = "Hello, world";

        const l = new LogicGate({ type: "not", name: "NOT" });
        l.mount(this.container);
    }
}