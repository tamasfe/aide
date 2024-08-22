<template></template>
<!-- <script setup lang="ts"> -->
<!-- import type { MaskInputOptions, MaskaDetail } from "maska"; -->
<!-- import { BaseInputWrapper } from "#components"; -->
<!---->
<!-- export type InputProps = { -->
<!--   modelValue?: string; -->
<!--   inputClass?: string; -->
<!--   wrapperClass?: string; -->
<!--   title?: string; -->
<!--   disabled?: boolean; -->
<!--   readonly?: boolean; -->
<!--   placeholder?: string; -->
<!--   blurScreen?: boolean; -->
<!--   scrollIntoView?: boolean; -->
<!--   type?: string; -->
<!--   required?: boolean; -->
<!--   autocomplete?: string; -->
<!--   error?: string; -->
<!--   inputmode?: -->
<!--     | "none" -->
<!--     | "text" -->
<!--     | "tel" -->
<!--     | "url" -->
<!--     | "email" -->
<!--     | "numeric" -->
<!--     | "decimal" -->
<!--     | "search"; -->
<!--   maska?: string | MaskInputOptions; -->
<!--   raw?: boolean; -->
<!-- }; -->
<!---->
<!-- const props = withDefaults(defineProps<InputProps>(), { -->
<!--   type: "text", -->
<!--   required: false, -->
<!--   raw: false, -->
<!-- }); -->
<!---->
<!-- const emit = defineEmits([ -->
<!--   "update:modelValue", -->
<!--   "input", -->
<!--   "change", -->
<!--   "focus", -->
<!--   "blur", -->
<!--   "keydown", -->
<!-- ]); -->
<!---->
<!-- const modelValue = computed({ -->
<!--   get: () => { -->
<!--     return props.modelValue; -->
<!--   }, -->
<!--   set: (value) => { -->
<!--     emit("update:modelValue", value); -->
<!--   }, -->
<!-- }); -->
<!---->
<!-- const inputId = Math.random().toString(36).substring(7); -->
<!-- const wrapper = ref<InstanceType<typeof BaseInputWrapper> | null>(null); -->
<!-- const input = ref<HTMLInputElement | null>(null); -->
<!---->
<!-- const onBlur = (evt: FocusEvent) => { -->
<!--   const el: HTMLElement | undefined = wrapper.value?.$el; -->
<!--   if (el?.contains(evt.relatedTarget as Node)) { -->
<!--     return; -->
<!--   } -->
<!--   input.value?.blur(); -->
<!--   emit("blur", evt); -->
<!--   if (props.blurScreen && wrapper.value) { -->
<!--     hideOverlay(wrapper.value.$el); -->
<!--   } -->
<!-- }; -->
<!---->
<!-- const onInputFocus = (evt: FocusEvent) => { -->
<!--   emit("focus", evt); -->
<!--   if (props.scrollIntoView) { -->
<!--     wrapper.value?.$el?.scrollIntoView({ -->
<!--       behavior: "smooth", -->
<!--       block: "center", -->
<!--       inline: "center", -->
<!--     }); -->
<!--   } -->
<!--   if (props.blurScreen && wrapper.value) { -->
<!--     overlay(wrapper.value.$el); -->
<!--   } -->
<!-- }; -->
<!---->
<!-- const onFocus = (evt: FocusEvent) => { -->
<!--   input.value?.focus(); -->
<!--   onInputFocus(evt); -->
<!-- }; -->
<!---->
<!-- const focus = () => { -->
<!--   if (input.value) { -->
<!--     input.value.focus(); -->
<!--   } -->
<!-- }; -->
<!---->
<!-- const blur = () => { -->
<!--   if (input.value) { -->
<!--     input.value.blur(); -->
<!--   } -->
<!-- }; -->
<!---->
<!-- const onMaska = (event: CustomEvent<MaskaDetail>) => { -->
<!--   if (props.raw) { -->
<!--     modelValue.value = event.detail.unmasked; -->
<!--   } -->
<!--   else { -->
<!--     modelValue.value = event.detail.masked; -->
<!--   } -->
<!-- }; -->
<!---->
<!-- const placeholder = computed(() => { -->
<!--   return props.title ? undefined : props.placeholder; -->
<!-- }); -->
<!---->
<!-- defineExpose({ -->
<!--   focus, -->
<!--   blur, -->
<!-- }); -->
<!-- </script> -->
<!---->
<!-- <template> -->
<!--   <BaseInputWrapper -->
<!--     ref="wrapper" -->
<!--     class="relative" -->
<!--     :title="title" -->
<!--     :wrapper-class="wrapperClass" -->
<!--     :disabled="disabled" -->
<!--     :placeholder="placeholder" -->
<!--     :model-value="modelValue" -->
<!--     :error="error" -->
<!--     @focus="onFocus" -->
<!--     @blur="onBlur" -->
<!--   > -->
<!--     <template #prefix> -->
<!--       <slot name="prefix" /> -->
<!--     </template> -->
<!--     <input -->
<!--       :id="inputId" -->
<!--       ref="input" -->
<!--       v-maska="maska" -->
<!--       :value="modelValue" -->
<!--       class="flex-1 bg-inherit border-none outline-none font-medium placeholder:text-subtle w-full" -->
<!--       :class="inputClass" -->
<!--       :disabled="disabled" -->
<!--       :readonly="readonly" -->
<!--       :placeholder="placeholder" -->
<!--       :type="type" -->
<!--       :required="required" -->
<!--       :aria-required="required" -->
<!--       :inputmode="inputmode" -->
<!--       :autocomplete="autocomplete" -->
<!--       @input="emit('input', $event)" -->
<!--       @change="emit('change', $event)" -->
<!--       @blur="onBlur" -->
<!--       @focus="onInputFocus" -->
<!--       @keydown="emit('keydown', $event)" -->
<!--       @maska="onMaska" -->
<!--     > -->
<!--     <template #suffix> -->
<!--       <slot name="suffix" /> -->
<!--     </template> -->
<!--   </BaseInputWrapper> -->
<!-- </template> -->
