<template>
  <div />
</template>
<!-- <script setup lang="ts"> -->
<!-- import { PhEye, PhEyeSlash } from "@phosphor-icons/vue"; -->
<!-- import { BaseInputWrapper } from "#components"; -->
<!---->
<!-- export type PasswordProps = { -->
<!--   modelValue?: string; -->
<!--   inputClass?: string; -->
<!--   wrapperClass?: string; -->
<!--   title?: string; -->
<!--   disabled?: boolean; -->
<!--   readonly?: boolean; -->
<!--   placeholder?: string; -->
<!--   blurScreen?: boolean; -->
<!--   scrollIntoView?: boolean; -->
<!--   required?: boolean; -->
<!--   error?: string; -->
<!-- }; -->
<!---->
<!-- const props = withDefaults(defineProps<PasswordProps>(), { -->
<!--   required: false, -->
<!-- }); -->
<!---->
<!-- const emit = defineEmits([ -->
<!--   "update:modelValue", -->
<!--   "input", -->
<!--   "change", -->
<!--   "focus", -->
<!--   "blur", -->
<!-- ]); -->
<!---->
<!-- const modelValue = computed({ -->
<!--   get: () => props.modelValue, -->
<!--   set: value => emit("update:modelValue", value), -->
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
<!-- const placeholder = computed(() => { -->
<!--   return props.title ? undefined : props.placeholder; -->
<!-- }); -->
<!---->
<!-- const type = ref("password"); -->
<!---->
<!-- const changeInputType = (evt: Event) => { -->
<!--   evt.preventDefault(); -->
<!--   evt.stopPropagation(); -->
<!--   type.value = type.value === "password" ? "text" : "password"; -->
<!-- }; -->
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
<!--       v-model="modelValue" -->
<!--       class="flex-1 bg-inherit border-none outline-none font-medium placeholder:text-subtle w-full" -->
<!--       :class="inputClass" -->
<!--       :disabled="disabled" -->
<!--       :readonly="readonly" -->
<!--       :placeholder="placeholder" -->
<!--       :type="type" -->
<!--       :required="required" -->
<!--       :aria-required="required" -->
<!--       autocomplete="on" -->
<!--       @input="emit('input', $event)" -->
<!--       @change="emit('change', $event)" -->
<!--       @blur="onBlur" -->
<!--       @focus="onInputFocus" -->
<!--     > -->
<!--     <template #suffix> -->
<!--       <slot name="suffix"> -->
<!--         <button -->
<!--           type="button" -->
<!--           class="outline-none" -->
<!--           aria-label="Toggle password visibility" -->
<!--           tabindex="-1" -->
<!--           @click="changeInputType" -->
<!--           @blur="onBlur" -->
<!--         > -->
<!--           <PhEye -->
<!--             v-if="type === 'password'" -->
<!--             class="text-subtle" -->
<!--             :size="24" -->
<!--           /> -->
<!--           <PhEyeSlash -->
<!--             v-else -->
<!--             class="text-subtle" -->
<!--             :size="24" -->
<!--           /> -->
<!--         </button> -->
<!--       </slot> -->
<!--     </template> -->
<!--   </BaseInputWrapper> -->
<!-- </template> -->
