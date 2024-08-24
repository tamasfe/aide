<!-- <script setup lang="ts"> -->
<!-- import { ModalWrapper } from "#components"; -->
<!---->
<!-- const emit = defineEmits(["update:open"]); -->
<!---->
<!-- const props = defineProps<{ -->
<!--   open: boolean; -->
<!-- }>(); -->
<!---->
<!-- const modal = ref<InstanceType<typeof ModalWrapper> | null>(null); -->
<!---->
<!-- const open = computed({ -->
<!--   get: () => props.open, -->
<!--   set: (value: boolean) => emit("update:open", value), -->
<!-- }); -->
<!---->
<!-- const showInfo = (value: boolean) => { -->
<!--   modal.value?.showImage(!value); -->
<!-- }; -->
<!---->
<!-- const close = () => { -->
<!--   open.value = false; -->
<!--   modal.value?.reset(); -->
<!-- }; -->
<!-- </script> -->
<!---->
<!-- <template> -->
<!--   <BaseModal -->
<!--     ref="modal" -->
<!--     v-model:open="open" -->
<!--   > -->
<!--     <WrapperWithdrawal -->
<!--       @show:info="showInfo" -->
<!--       @click:close="close" -->
<!--     /> -->
<!--   </BaseModal> -->
<!-- </template> -->
