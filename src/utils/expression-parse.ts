export type AstNode = {
    left: AstNode | null,
    right: AstNode | null,
    type: "operator" | "variable" | "expression",
    value: string
}

type OperatorKey = keyof typeof OPERATORS;

export const OPERATORS = {
    'AND': { precedence: 2, associativity: 'left' },
    'NAND': { precedence: 2, associativity: 'left' },
    'OR': { precedence: 1, associativity: 'left' },
    'NOR': { precedence: 1, associativity: 'left' },
    'NOT': { precedence: 3, associativity: 'right' },
    'XOR': { precedence: 2, associativity: 'left' },
    // 'XNOR': { precedence: 2, associativity: 'left' },
};

const boolCalculation = (operation: string, input: boolean[]): boolean => {
    switch (operation.toLocaleUpperCase()) {
        case "AND": return input[0] && input[1];
        case "NAND": return !(input[0] && input[1]);
        case "OR": return input[0] || input[1];
        case "NOR": return !(input[0] || input[1]);
        case "XOR": return input[0] !== input[1];
        case "NOT": return !input[0];
        default: return false;
    }
}

const isOperator = (token: string) => {
    return Object.keys(OPERATORS).includes(token);
}

const tokenize = (expression: string) => {
    expression = expression.replace(/\(/g, " ( ").replace(/\)/g, " ) ");
    return expression.split(' ').filter(x => x !== '');
}

export class parser {
    expression: string;
    ast: AstNode;
    constructor(expression: string) {
        this.expression = expression;

        this.ast = this.parse();
    }

    setExpression(expression: string) {
        this.expression = expression;
        this.ast = this.parse();
    }

    getVariables(): string[] {
        const variables = new Set<string>();

        const findRecursive = (expression: AstNode) => {
            if (expression.type === "variable") {
                variables.add(expression.value);
            }
            if (expression.left) findRecursive(expression.left);
            if (expression.right) findRecursive(expression.right);
        }

        findRecursive(this.ast);
        return Array.from(variables);
    }

    /**
     * Parses a logical expression into an abstract syntax tree.
     * 
     * The parsing algorithm is similar to Shunting-yard algorithm.
     * 
     * @returns The root of the abstract syntax tree.
     */
    parse(): AstNode {
        const tokens = tokenize(this.expression);

        const associateLeft = (cur: number, parserStack: AstNode[]) => {
            cur -= 1; // operator appears in the middle
            const right = parserStack[cur + 2];
            const operator = parserStack[cur + 1];
            const left = parserStack[cur];

            const astNode: AstNode = {
                left: left,
                right: right,
                type: "expression",
                value: operator.value
            }

            parserStack.splice(cur, 3, astNode);
        }

        const associateRight = (cur: number, parserStack: AstNode[]) => {
            const operand = parserStack[cur + 1];
            const operator = parserStack[cur];

            const astNode: AstNode = {
                left: null,
                right: operand,
                type: "expression",
                value: operator.value
            }

            parserStack.splice(cur, 2, astNode);
        }

        const findHighestPrecedenceOperator = (parserStack: AstNode[]): number => {
            let highestPrecedence = -1;
            let highestPrecedenceIndex = -1;
            for (let i = 0; i < parserStack.length; i++) {
                if (parserStack[i].type === "operator") {
                    if (OPERATORS[parserStack[i].value as OperatorKey].precedence > highestPrecedence) {
                        highestPrecedence = OPERATORS[parserStack[i].value as OperatorKey].precedence;
                        highestPrecedenceIndex = i;
                    }
                }
            }
            return highestPrecedenceIndex;
        }

        const associateAll = (parserStack: AstNode[]) => {
            let originalStackLength = 0;
            let associatedStackLength = 0;
            do {
                originalStackLength = parserStack.length;

                const chosenIndex = findHighestPrecedenceOperator(parserStack);

                if (chosenIndex >= 0) {
                    const chosenOperator = parserStack[chosenIndex].value as OperatorKey;

                    if (OPERATORS[chosenOperator].associativity === 'left') associateLeft(chosenIndex, parserStack);
                    else if (OPERATORS[chosenOperator].associativity === 'right') associateRight(chosenIndex, parserStack);
                    else throw new Error(`Invalid associativity "${OPERATORS[chosenOperator].associativity}"`);
                }

                associatedStackLength = parserStack.length;
            }
            while (originalStackLength - associatedStackLength !== 0);
        }

        const findClosingBracket = (i: number, tokens: string[]) => {
            let level = 1;
            while (i < tokens.length && level !== 0) {
                if (tokens[i] === "(") level += 1;
                else if (tokens[i] === ")") level -= 1;
                i += 1;
            }
            if (level !== 0) throw new Error("Expect closing bracket");
            return i - 1;
        }

        const pushVariable = (parserStack: AstNode[], token: string) => {
            const astNode: AstNode = {
                left: null,
                right: null,
                type: "variable",
                value: token
            }
            parserStack.push(astNode)
        }

        const pushOperator = (parserStack: AstNode[], token: string) => {
            const astNode: AstNode = {
                left: null,
                right: null,
                type: "operator",
                value: token
            }

            parserStack.push(astNode)
        }

        const parse = (tokens: string[]) => {
            let cursor = 0;
            const parserStack: AstNode[] = [];
            while (cursor < tokens.length) {
                const token = tokens[cursor];
                cursor += 1;
                if (token === ")") continue;
                else if (token === "(") {
                    // find the corresponding closing bracket
                    const correspondingEnd = findClosingBracket(cursor, tokens);
                    parserStack.push(parse(tokens.slice(cursor, correspondingEnd)));
                    cursor = correspondingEnd + 1; // jump over the closing bracket
                }
                else if (isOperator(token.toLocaleUpperCase())) {
                    pushOperator(parserStack, token.toLocaleUpperCase());
                }
                else {
                    pushVariable(parserStack, token);
                }
            }

            associateAll(parserStack);

            if (parserStack.length !== 1) {
                throw new Error("Expecting another operator");
            }
            return parserStack[0];
        }

        return parse(tokens);
    }

    evaluate(input: Record<string, boolean>){
        const variables = this.getVariables();
        for (const variable of variables) {
            if (typeof input[variable] !== "boolean") {
                throw new Error(`Variable "${variable}" is not set`);
            }
        }

        const evaluateRecursive = (expression: AstNode | null, input: Record<string, boolean>): boolean => {
            if(expression === null) return false;
            if(expression.type === "variable") return input[expression.value];
            if(expression.type === "expression") {
                const left = evaluateRecursive(expression.left, input);
                const right = evaluateRecursive(expression.right, input);
                return boolCalculation(expression.value, [right, left]);
            }
            throw new Error("Invalid expression");
        }

        return evaluateRecursive(this.ast, input);
    }
}
