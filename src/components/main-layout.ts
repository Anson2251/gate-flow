import { type CommonPropsType, MyComponent } from "./definitions";

import { CircuitCanvas } from "./circuit-canvas";

export class MainLayout extends MyComponent<CommonPropsType> {
    constructor(props: CommonPropsType = {}) {
        super(props);
        this.update(props);
    }

    onUpdate(oldProps: CommonPropsType, newProps: CommonPropsType): void {
        console.log(oldProps, newProps);
    }

    render(): void {

        const c = new CircuitCanvas({ expression: "(C NAND (A AND B)) OR (A XOR C)", input: { A: true, B: false, C: true } });
        c.mount(this.container);
    }
}