import { MyComponent } from "./definitions";

type CircuitWireProps = {
    color: string,
    thickness: number,
    paths: number[][],
    position: number[],
    canvasSize: {
        h: number,
        v: number,
    }
}

export class circuitWire extends MyComponent<CircuitWireProps> {
    private svgPaths: string[] = [];
    layer: SVGSVGElement
    paths: number[][] = [];
    constructor(props: CircuitWireProps) {
        super(props);
        this.update(props);
        this.layer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.container.appendChild(this.layer);
    }

    onUpdate(): void {
        this.svgPaths = [];
        this.props.paths.forEach((path) => {
            this.svgPaths.push(`M ${path[0]} ${path[1]} L ${path[2]} ${path[3]}`);
        });
    }

    render() {
        this.layer.innerHTML = "";
        this.svgPaths.forEach((d) => {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", d);
            path.setAttribute("stroke", this.props.color);
            path.setAttribute("stroke-width", this.props.thickness.toString());
            path.setAttribute("fill", "none");
            this.layer.appendChild(path);
        });
    }
}