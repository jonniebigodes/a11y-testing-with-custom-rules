import type { Meta, StoryObj } from '@storybook/react'

import { TopBanner } from './TopBanner'

const meta = {
  title: 'Components/TopBanner',
  component: TopBanner,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TopBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Categories',
  },
}

export const WithImage: Story = {
  args: {
    ...Default.args,
    photoUrl:
      'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=20',
  },
}
