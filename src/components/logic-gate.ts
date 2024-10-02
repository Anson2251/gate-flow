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
}

const gateAsset = GateAssetData as GateAssetDataType;

export class LogicGate extends MyComponent<LogicGateProps> {
    icon = "";
    type: string;
    name: string;
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

        this.inputPointPositions = gateAsset[this.type].input;
        this.outputPointPositions = gateAsset[this.type].output;
    }

    render(): void {
        this.container.title = this.name;
        this.container.className = "logic-gate";

        this.container.style.backgroundImage = `url(${this.icon})`;
    }
}