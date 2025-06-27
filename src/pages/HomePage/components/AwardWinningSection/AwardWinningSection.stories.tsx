import type { Meta, StoryObj } from '@storybook/react'

import { AwardWinningSection } from './AwardWinningSection'

const meta = {
  title: 'Pages/HomePage/Components/AwardWinningSection',
  component: AwardWinningSection,
} satisfies Meta<typeof AwardWinningSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
