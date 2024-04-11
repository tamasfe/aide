import type { Meta, StoryObj } from '@storybook/vue3'

import ButtonComponent from '../components/partials/ButtonComponent.vue';

const meta = {
  title: 'Partials/ButtonComponent',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['solid', 'text'], // An array of serializable values
      control: {
        type: 'select',
        labels: {
          solid: 'Solid',
          text: 'text',
        },
      },
    },
    big: {
      control: 'boolean'
    },
    small: {
      control: 'boolean'
    }
  },
} satisfies Meta<typeof ButtonComponent>

export default meta
type Story = StoryObj<typeof meta>

export const ButtonComponentStory: Story = {
  render: (args) => ({
    components: { ButtonComponent },
    setup() {
      return { args };
    },
    template: '<ButtonComponent v-bind="args" />',
  }),
  args: {
    variant: 'solid',
    background: '',
    color: '',
    label: 'Button',
    big: false,
    small: false
  },
};