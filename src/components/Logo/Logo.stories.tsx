import type { Meta, StoryObj } from '@storybook/react'

import { Logo } from './Logo'

const meta = {
  title: 'Components/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const WithText: Story = {}

export const LogoOnly: Story = {
  args: {
    large: true,
    logoOnly: true,
  },
}
