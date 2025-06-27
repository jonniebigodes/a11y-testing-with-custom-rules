import type { Meta, StoryObj } from '@storybook/react'

import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'arrow-right',
    small: false,
    'aria-label': 'forward',
  },
}

export const Small: Story = {
  args: {
    ...Default.args,
    small: true,
  },
}
