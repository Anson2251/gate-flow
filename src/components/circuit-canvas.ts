import { MyComponent } from "./definitions";

import { ExpressionParser, type AstNode } from "@/utils/expression-parser";

type CircuitCanvasType = {
    expression: string,
    input: Record<string, boolean>,
}

export class CircuitCanvas extends MyComponent<CircuitCanvasType> {
    parser = new ExpressionParser("");
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
    }

    render(): void {
        
        this.ast = this.parser.parse();
        console.log(this.ast);
    }
}
