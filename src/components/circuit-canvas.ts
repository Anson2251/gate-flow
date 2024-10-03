import { MyComponent } from "./definitions";
import { LogicGate } from "./logic-gate";
import { TextLabel } from "./text-label";

import { ExpressionParser, type AstNode } from "@/utils/expression-parser";
import { TreePlacer } from "@/utils/tree-placer";

type CircuitCanvasType = {
    expression: string,
    input: Record<string, boolean>,
}

type AbstractLogicGate = {
    input: (AbstractLogicGate | string)[],
    type: string,
    id: number,
}

type OverviewGates = {
    id: number,
    children: OverviewGates[],
}

export class CircuitCanvas extends MyComponent<CircuitCanvasType> {
    parser = new ExpressionParser("");
    placer = new TreePlacer({ h: 64, v: 64 }, { h: 24, v: 24 });
    gateMap = new Map<number, AbstractLogicGate>();
    gateInputPositions: Record<number, number[][]> = {};
    gateOutputPositions: Record<number, number[]> = {};
    ast: AstNode | null;
    variables: string[] = [];
    labelPositions: Record<string, [number, number]> = {};
    constructor(props: CircuitCanvasType) {
        super(props);
        this.update(props);
    }


    onUpdate(): void {
        const expression = this.props.expression;
        this.parser.setExpression(expression);
        this.ast = this.parser.ast;
        this.variables = this.parser.getVariables();
        this.gateMap = this.allocateGates();

        console.log(this.gateMap)
        console.log(this.gateMap.get(0))
    }

    allocateGates(): Map<number, AbstractLogicGate> {
        const gates = new Map<number, AbstractLogicGate>();

        let gateCount = 0;

        const allocate = (node: AstNode): AbstractLogicGate => {
            if (node.type !== "expression") throw new Error("Invalid expression");
            const currentGateCount = gateCount;
            gateCount++;
            const inputs: (string | AbstractLogicGate)[] = [];

            if (node.left) {
                if (node.left.type === "expression") {
                    inputs.push(allocate(node.left));
                }
                else if (node.left.type === "variable") {
                    inputs.push(node.left.value);
                }
            }
            if (node.right) {
                if (node.right.type === "expression") {
                    inputs.push(allocate(node.right));
                }
                else if (node.right.type === "variable") {
                    inputs.push(node.right.value);
                }
            }

            const gate: AbstractLogicGate = {
                input: inputs,
                type: node.value,
                id: currentGateCount
            }

            gates.set(currentGateCount, gate);

            return gate;
        }

        allocate(this.ast);
        return gates;
    }

    renderLabels(gapSize: number): void {
        this.variables.sort((a, b) => (a.charCodeAt(0) - b.charCodeAt(0))).forEach((v, i) => {
            const size = 24;
            const y = (gapSize * i) + (size / 2);
            const label = new TextLabel({
                text: v,
                pos: [0, y],
                color: "black",
                size: size,
                font: ""
            });
            this.labelPositions[v] = [0, y];
            label.mount(this.container);
        });
    }

    renderGates(startPosition: [number, number]): void {
        const generateOverview = (gate: AbstractLogicGate): OverviewGates => ({
            id: gate.id,
            children: gate.input.filter(x => typeof x !== "string").map(x => generateOverview(x))
        })
        this.placer.setRoot(generateOverview(this.gateMap.get(0)));
        this.placer.calculate(startPosition);

        for (const gate of this.gateMap.values()) {
            const { x, y } = this.placer.query(gate.id);
            const instance = new LogicGate({ type: gate.type, name: gate.type.toUpperCase(), size: 64 });
            instance.setPosition(x, y);

            this.gateInputPositions[gate.id] = instance.inputPointPositions;
            this.gateOutputPositions[gate.id] = instance.outputPointPositions;

            instance.mount(this.container);
        }
    }

    render(): void {
        const inputLabelGap = 64;
        this.renderLabels(inputLabelGap);
        this.renderGates([48, 0]);
        console.log(this)
    }
}
