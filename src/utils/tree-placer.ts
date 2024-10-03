function cloneDeep<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
}

interface Node<T> {
    id: T;
    children: Node<T>[];
}

interface NodePosition {
    x: number;
    y: number;
}

export class TreePlacer<T extends string | number | symbol> {
    private root: Node<T>;
    nodeSize: {
        h: number;
        v: number;
    };
    nodePadding: {
        h: number;
        v: number;
    };
    private positions: Record<T, NodePosition>;

    constructor(nodeSize: {h: number, v: number}, nodePadding: {h: number, v: number}, root?: Node<T>) {
        this.nodeSize = nodeSize;
        this.nodePadding = nodePadding;
        if (root) {
            this.root = root;
            this.calculate();
        }
    }

    setRoot(root: Node<T>) {
        this.root = cloneDeep(root);
    }

    query(value: T): NodePosition {
        return this.positions[value];
    }

    calculate() {
        const positions = {} as Record<T, NodePosition>;

        // Recursively calculate positions for nodes
        const calculatePositions = (nodes: Node<T>[], depth: number, startY: number) => {
            const x = 0 - (depth * (this.nodeSize.h + this.nodePadding.h)); // x decreases as depth increases (right to left)
            const startLayerY = startY;

            for (const node of nodes) {
                if (node.children.length > 0) {
                    startY = calculatePositions(node.children, depth + 1, startY);
                }

                // Assign position for this node
                const y = (node.children.length === 0)
                    ? (startY * (this.nodeSize.v + this.nodePadding.v))
                    : (((startLayerY + startY - 1) / 2) * (this.nodeSize.v + this.nodePadding.v));

                positions[node.id] = { x, y };

                // Update Y for next node
                if (node.children.length === 0) startY++;
            }

            return startY;
        }

        calculatePositions([this.root], 0, 0);

        const minX = Math.min(...Object.values(positions).map((pos: NodePosition) => pos.x));
        for (const key in positions) {
            positions[key].x -= minX;
        }

        this.positions = positions;
    }
}
