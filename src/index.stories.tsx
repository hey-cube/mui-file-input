import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MuiFileInput } from './index'

export default {
  title: 'MuiFileInput',
  component: MuiFileInput
} as ComponentMeta<typeof MuiFileInput>

const theme = createTheme()

export const Primary: ComponentStory<typeof MuiFileInput> = () => {
  const [value, setValue] = React.useState<File[]>([])

  const handleChange = (newValue: File[]) => {
    setValue(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiFileInput
        placeholder="Choisir un fichier"
        inputProps={{
          accept: 'video/*'
        }}
        multiple
        value={value}
        onChange={handleChange}
        label="test"
      />
    </ThemeProvider>
  )
}

export const FullWidth: ComponentStory<typeof MuiFileInput> = () => {
  const [value, setValue] = React.useState<File[]>([])

  const handleChange = (newValue: File[]) => {
    setValue(newValue)
  }

  return (
    <ThemeProvider theme={theme}>
      <MuiFileInput
        fullWidth
        placeholder="Choisir un fichier"
        inputProps={{
          accept: 'video/*'
        }}
        multiple
        value={value}
        onChange={handleChange}
        label="fullWidth"
      />
    </ThemeProvider>
  )
}
