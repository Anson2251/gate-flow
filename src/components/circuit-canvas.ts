import { MyComponent } from "./definitions";
import { LogicGate } from "./logic-gate";

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
    overviewGates
    ast: AstNode | null;
    variables: string[] = [];
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

        // this.gateMap = gates;
        // this.gateInputMap = inputsMap;

        // console.log(this.gateMap, this.gateInputMap);
    }

    allocateGates(): Map<number, AbstractLogicGate> {
        const gates = new Map<number, AbstractLogicGate>();

        let gateCount = 0;

        const allocate = (node: AstNode): AbstractLogicGate => {
            if(node.type !== "expression") throw new Error("Invalid expression");
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

        //     allocate(this.ast);

        //     return {
        //         gates: gates,
        //         inputsMap: gatesInputMap
        //     };
        // }

        render(): void {
            const generateOverview = (gate: AbstractLogicGate): OverviewGates => {         
                const overview: OverviewGates = {
                    id: gate.id,
                    children: gate.input.filter(x => typeof x !== "string").map(x => generateOverview(x))
                }

                return overview;
            }

            const overview = generateOverview(this.gateMap.get(0));

            console.log(overview)

            this.placer.setRoot(overview);
            this.placer.calculate();

            for (const gate of this.gateMap.values()) {
                const position = this.placer.query(gate.id);
                const instance = new LogicGate({ type: gate.type, name: gate.type.toUpperCase() });
                instance.container.style.left = `${position.x}px`;
                instance.container.style.top = `${position.y}px`;

                instance.mount(this.container);
            }
        }
    }
