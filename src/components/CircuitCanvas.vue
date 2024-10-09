<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';
import LogicGate from './LogicGate.vue';
import ExpressionParser, { type AstNode } from '@/utils/expression-parser';
import TreePlacer from '@/utils/tree-placer';

type AbstractLogicGate = {
    input: (AbstractLogicGate | string)[],
    type: string,
    id: number,
}

type OverviewGates = {
    id: number,
    children: OverviewGates[],
}

const generateOverview = (gate: AbstractLogicGate): OverviewGates => ({
    id: gate.id,
    children: gate.input.filter(x => typeof x !== "string").map(x => generateOverview(x))
})

// Utility to build logic gate tree from AST
function buildGateTree(node: AstNode, gates: Map<number, AbstractLogicGate>, gateCountRef: Ref<number>): AbstractLogicGate {
    if (node.type !== "expression") throw new Error("Invalid expression");
    
    const gateId = gateCountRef.value++;
    const inputs: (string | AbstractLogicGate)[] = [];

    // Recursively create gates for left and right nodes
    if (node.left) {
        if (node.left.type === "expression") {
            inputs.push(buildGateTree(node.left, gates, gateCountRef));
        } else if (node.left.type === "variable") {
            inputs.push(node.left.value);
        }
    }

    if (node.right) {
        if (node.right.type === "expression") {
            inputs.push(buildGateTree(node.right, gates, gateCountRef));
        } else if (node.right.type === "variable") {
            inputs.push(node.right.value);
        }
    }

    const gate: AbstractLogicGate = {
        input: inputs,
        type: node.value,
        id: gateId
    };

    gates.set(gateId, gate);
    return gate;
}

type Props = {
    expression: string;
    inputs: Record<string, boolean>;
}

const props = defineProps<Props>();
const emits = defineEmits(['evaluated']);

const parser = new ExpressionParser(props.expression);
const placer = new TreePlacer({ h: 50, v: 50 }, { h: 50, v: 50 });
const gateCount = ref(0);
const gates = new Map<number, AbstractLogicGate>();

const output = ref(false);

// Initialize gates and connections based on the expression
const initializeGates = () => {
    gateCount.value = 0;
    gates.clear();

    parser.setExpression(props.expression);
    
    if (parser.ast) {
        buildGateTree(parser.ast, gates, gateCount);
    }

    const rootGate = gates.get(0);
    if (rootGate) {
        placer.setRoot(generateOverview(rootGate));
        placer.calculate();
    }

    setupConnections();
    evaluateOutput();
};

const reactiveResults = new Map<number, Ref<boolean>>();
const reactiveInputs = new Map<number, Ref<boolean>[]>();

// Setup the connections between gates (linking outputs to inputs)
const setupConnections = () => {
    gates.forEach(gate => {
        reactiveResults.set(gate.id, ref(false));
    });

    // Setup reactive inputs based on gate connections
    gates.forEach(gate => {
        const inputs: Ref<boolean>[] = [];
        gate.input.forEach(input => {
            if (typeof input === 'string') {
                inputs.push(computed(() => props.inputs[input]));
            } else {
                inputs.push(reactiveResults.get(input.id)!);
            }
        });
        reactiveInputs.set(gate.id, inputs);
    });
};

// Evaluate the output based on the current inputs
const evaluateOutput = () => {
    output.value = parser.evaluate(props.inputs);
    emits('evaluated', output.value);
};

// Watch for changes in props.expression and initialize gates
initializeGates();

</script>

<template>
    <div class="container">
        <LogicGate 
            v-for="gate in gates.values()" 
            :key="gate.id" 
            :name="gate.type" 
            :pos="placer.query(gate.id)"
            :size="64" 
            :type="gate.type" 
            :inputs="reactiveInputs.get(gate.id)" 
            @evaluated="reactiveResults.get(gate.id)!.value = $event" 
        />
    </div>
</template>

<style scoped>
.container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
