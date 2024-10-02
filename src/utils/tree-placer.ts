function cloneDeep<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
}

interface Node<T> {
    value: T;
    left?: Node<T>;
    right?: Node<T>;
}

interface NodePosition {
    x: number;
    y: number;
}

export class TreePlacer<T extends string | number | symbol> {
    private root: Node<T>;
    layerSize: number;
    private positions: Record<T, NodePosition>;
    constructor(root: Node<T>, layerSize: number) {
        this.root = cloneDeep(root);
        this.layerSize = layerSize;
        this.positions = this.calculate();
    }

    setRoot(root: Node<T>) {
        this.root = cloneDeep(root);
    }

    query(value: T): NodePosition {
        return this.positions[value];
    }

    calculate() {
        const positions = {} as Record<T, NodePosition>;
        const layers: Node<T>[][] = [];

        // Build the layers
        let queue: Node<T>[] = [this.root];
        while (queue.length > 0) {
            const layer: Node<T>[] = queue;
            layers.push(layer);
            queue = [];
            for (const node of layer) {
                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
        }

        // Calculate the positions
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            const layerWidth = layer.length * this.layerSize;
            const layerHeight = i * this.layerSize;
            for (let j = 0; j < layer.length; j++) {
                const node = layer[j];
                const x = (j + 0.5) * this.layerSize - layerWidth / 2;
                const y = layerHeight;
                positions[node.value].x = x;
                positions[node.value].y = y;
            }
        }

        return positions;
    }
}
