import type { Meta, StoryObj } from "@storybook/vue3";

import GlobalSearchBar from "../components/GlobalSearchBar.vue";

const meta = {
  title: "GlobalSearchBar",
  component: GlobalSearchBar,
  tags: ["autodocs"],
} satisfies Meta<typeof GlobalSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextChipStory: Story = {
  render: args => ({
    components: { GlobalSearchBar },
    setup() {
      const model = ref("Your text");
      return { args, model };
    },
    template: "<GlobalSearchBar v-model=\"model\"/>",
  }),
};
