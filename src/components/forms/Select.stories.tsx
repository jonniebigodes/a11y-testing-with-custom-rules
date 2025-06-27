import type { Meta, StoryObj } from '@storybook/react'

import { Select } from './Select'

const meta = {
  title: 'Components/Form/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: ['Burger', 'Pizza', 'Sushi'],
    id: 'select',
    'aria-label': 'food',
  },
}

export const WithLabel: Story = {
  args: {
    ...Default.args,
    id: 'select',
    label: 'Select field',
  },
}
