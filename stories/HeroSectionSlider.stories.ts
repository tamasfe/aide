import type { Meta, StoryObj } from '@storybook/vue3'

import HeroSectionSlider from '../components/HeroSectionSlider.vue';

const meta = {
  title: 'Sliders/HeroSectionSlider',
  component: HeroSectionSlider,
  tags: ['autodocs'],
  argTypes: {
    slides: {
      control: {
        type: 'object',
      },
    },
  },
} satisfies Meta<typeof HeroSectionSlider>

export default meta
type Story = StoryObj<typeof meta>

export const HeroSectionSliderStory: Story = {
  render: (args) => ({
    components: { HeroSectionSlider },
    setup() {
      return { args };
    },
    template: '<HeroSectionSlider v-bind="args" />',
  }),
  args: {
    slides: [
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/"
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/"
      },
      {
        imageUrl: 'https://www.toptal.com/designers/subtlepatterns/uploads/moroccan-flower-dark.png',
        link: "/"
      },
    ],
  },
};