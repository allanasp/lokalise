<script setup lang="ts">
const props = defineProps<{
	value: string;
	status?: string;
}>();

const emit = defineEmits<{
	save: [value: string];
}>();

const editing = ref(false);
const editValue = ref(props.value);

function startEdit() {
	editValue.value = props.value;
	editing.value = true;
}

function save() {
	if (editValue.value !== props.value) {
		emit("save", editValue.value);
	}
	editing.value = false;
}

function cancel() {
	editing.value = false;
	editValue.value = props.value;
}
</script>

<template>
	<div class="relative group min-h-[40px]" @dblclick="startEdit">
		<div v-if="!editing" class="px-3 py-2 cursor-text">
			<span v-if="value" class="text-sm">{{ value }}</span>
			<span v-else class="text-sm text-gray-300 dark:text-gray-600 italic">Empty</span>
		</div>

		<div v-else class="p-1">
			<UTextarea
				v-model="editValue"
				autofocus
				:rows="2"
				size="sm"
				@keydown.enter.meta="save"
				@keydown.escape="cancel"
				@blur="save"
			/>
		</div>
	</div>
</template>
