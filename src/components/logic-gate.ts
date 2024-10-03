import { MyComponent } from "./definitions";
import GateAssetData from "@/assets/gate-icons-data.json";
import "@/assets/logic-gate.less";

import nandGateImage from "@/assets/imgs/nand-gate.png"
import andGateImage from "@/assets/imgs/and-gate.png"
import norGateImage from "@/assets/imgs/nor-gate.png"
import orGateImage from "@/assets/imgs/or-gate.png"
import xorGateImage from "@/assets/imgs/xor-gate.png"
import notGateImage from "@/assets/imgs/not-gate.png"

import { boolCalculation } from "@/utils/expression-parser";

const imageMap = {
    "nand": nandGateImage,
    "and": andGateImage,
    "nor": norGateImage,
    "or": orGateImage,
    "xor": xorGateImage,
    "not": notGateImage
}

type GateAssetDataType = {
    [key: string]: {
        size: {
            height: number;
            width: number;
        };
        input: number[][];
        output: number[];
    }
}

type LogicGateProps = {
    type: string;
    name: string;
    size: number;
}

const gateAsset = GateAssetData as GateAssetDataType;

export class LogicGate extends MyComponent<LogicGateProps> {
    icon = "";
    type: string;
    name: string;
    size: number;
    pos: number[] = [0, 0];
    inputPointPositions: number[][] = [];
    outputPointPositions: number[] = [0, 0];
    constructor(props: LogicGateProps) {
        super(props);
        this.update(props);
    }

    calculate(input: boolean[]): boolean {
        return boolCalculation(this.type, input);
    }

    onUpdate(): void {
        this.name = this.props.name;
        this.type = this.props.type.toLocaleLowerCase();
        this.icon = imageMap[this.type];
        this.size = this.props.size;

        const rawSize = gateAsset[this.type].size;

        this.inputPointPositions = gateAsset[this.type].input.map((pos) => [
            pos[0] / rawSize.width * this.size + this.pos[0], 
            pos[1] / rawSize.height * this.size + this.pos[1]
        ]);
        this.outputPointPositions = [
            gateAsset[this.type].output[0] / rawSize.width * this.size + this.pos[0], 
            gateAsset[this.type].output[1] / rawSize.height * this.size + this.pos[1]
        ];
    }

    setPosition(x: number, y: number): void {
        this.pos = [x, y];
        this.update(this.props);
    }

    render(): void {
        this.container.style.left = `${this.pos[0]}px`;
        this.container.style.top = `${this.pos[1]}px`;

        this.container.title = this.name;
        this.container.className = "logic-gate";

        this.container.style.height = `${this.size}px`;
        this.container.style.width = `${this.size}px`;

        this.container.style.backgroundImage = `url(${this.icon})`;
    }
}