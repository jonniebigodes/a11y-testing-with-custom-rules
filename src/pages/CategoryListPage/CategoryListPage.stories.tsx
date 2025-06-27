import type { Meta, StoryObj } from '@storybook/react'

import { CategoryListPage } from './CategoryListPage'

const meta = {
  title: 'Pages/CategoryListPage',
  component: CategoryListPage,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CategoryListPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
