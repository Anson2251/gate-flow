import { MyComponent } from "./definitions";
import GateAssetData from "@/assets/gate-icons-data.json";
import "@/assets/logic-gate.less";

import nandGateImage from "@/assets/nand-gate.png"
import andGateImage from "@/assets/and-gate.png"
import norGateImage from "@/assets/nor-gate.png"
import orGateImage from "@/assets/or-gate.png"
import xorGateImage from "@/assets/xor-gate.png"
import notGateImage from "@/assets/not-gate.png"

const imageMap = {
    "nand": nandGateImage,
    "and": andGateImage,
    "nor": norGateImage,
    "or": orGateImage,
    "xor": xorGateImage,
    "not": notGateImage
}

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

        this.name = props.name;
        this.type = props.type;
        this.icon = imageMap[this.type];

        this.inputPointPositions = gateAsset[this.type].input;
        this.outputPointPositions = gateAsset[this.type].output;

        this.container = document.createElement("div");
        this.container.title = this.name;
        this.container.className = "logic-gate";

        this.container.style.backgroundImage = `url(${this.icon})`;
    }

    calculate(input: boolean[]): boolean {
        return boolCalculation(this.type, input);
    }
}