import { MyComponent } from "./definitions";

type CircuitWireProps = {
    color: string
    thickness: number
    startPoint: number[]
    endPoint: number[]
}

export class circuitWire extends MyComponent<CircuitWireProps> {
    path: string;
    constructor(props: CircuitWireProps) {
        super(props);
        this.update(props);
    }

    onUpdate(): void {
        this.path = `M ${this.props.startPoint[0]} ${this.props.startPoint[1]} L ${this.props.endPoint[0]} ${this.props.endPoint[1]}`;
    }

    render() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", this.path);
        path.setAttribute("stroke", this.props.color);
        path.setAttribute("stroke-width", this.props.thickness.toString());
        path.setAttribute("fill", "none");
        svg.appendChild(path);
        this.container.appendChild(svg);
    }
}