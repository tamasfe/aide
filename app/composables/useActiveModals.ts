export default function (name: string, openState: Ref<boolean>) {
  const activeModals = useState<string[]>("activeModals", () => []);

  watch(openState, (isOpen) => {
    if (isOpen) {
      if (!activeModals.value.includes(name)) {
        activeModals.value.push(name);
      }
    }
    else {
      activeModals.value = activeModals.value.filter(modalName => modalName !== name);
    }
  }, { immediate: true });

  return activeModals;
}
