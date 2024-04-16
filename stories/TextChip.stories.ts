import type { Meta, StoryObj } from "@storybook/vue3";

import TextChip from "../components/partials/TextChip.vue";

const meta = {
  title: "Partials/TextChip",
  component: TextChip,
  tags: ["autodocs"],
} satisfies Meta<typeof TextChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextChipStory: Story = {
  render: args => ({
    components: { TextChip },
    setup() {
      return { args };
    },
    template: "<TextChip v-bind=\"args\" />",
  }),
  args: {
    icon: "🛸",
    label: "Aviator",
  },
};
