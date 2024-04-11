import type { Meta, StoryObj } from '@storybook/vue3'

import ButtonComponent from '../components/partials/ButtonComponent.vue';
import SliderChevronLeft from '../components/Icons/SliderChevronLeft.vue';

const meta = {
  title: 'Partials/ButtonComponent',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['solid', 'text', 'round'], // An array of serializable values
      control: {
        type: 'select',
        labels: {
          solid: 'solid',
          text: 'text',
          round: 'round'
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
    components: { ButtonComponent, SliderChevronLeft },
    setup() {
      return { args };
    },
    template: '<ButtonComponent v-bind="args" :color="args.variant === `text` && !args.color ? `#000` : args.color"> <SliderChevronLeft v-if="args.variant === `round`" class="h-6" :color="`#fff`"/> </ButtonComponent>',
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