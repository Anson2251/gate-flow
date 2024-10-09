<script setup lang="ts">
import GateAssetData from "@/assets/gate-icons-data.json";

import nandGateImage from "@/assets/imgs/nand-gate.png"
import andGateImage from "@/assets/imgs/and-gate.png"
import norGateImage from "@/assets/imgs/nor-gate.png"
import orGateImage from "@/assets/imgs/or-gate.png"
import xorGateImage from "@/assets/imgs/xor-gate.png"
import notGateImage from "@/assets/imgs/not-gate.png"

import { boolCalculation } from "@/utils/expression-parser";
import { computed, watch, ref, type Ref } from "vue";

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

type Props = {
    name: string,
    type: string,
    size: number,
    pos: {
        x: number,
        y: number
    }
    inputs?: Ref<boolean>[]
}

const styleCode = computed(() => `
    background-image: url(${imageMap[props.type.toLocaleLowerCase() as keyof typeof imageMap]}); 
    width: ${props.size}px; 
    height: ${props.size}px; 
    left: ${props.pos.x}px; 
    top: ${props.pos.y}px;`
);

const props = defineProps<Props>();
const emits = defineEmits(['evaluated', 'ready']);

const output = computed(() => {
    console.log("new eval", props.type)
    return boolCalculation(props.type.toLocaleUpperCase(), props.inputs?.map(x => x.value) || []);
})

watch(output, () => {
    emits('evaluated', output);
})
</script>

<template>
    <div class="gate" :style="styleCode">{{ output }}</div>
</template>

<style scoped>
.gate {
    background-size: 100% 100%;
    display: block;
    position: absolute;
}
</style>