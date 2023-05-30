import React from 'react'
import prettyBytes from 'pretty-bytes'
import Input from '@components/Input/Input'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { matchIsNonEmptyArray } from '@shared/helpers/array'
import {
  fileListToArray,
  getTotalFilesSize,
  matchIsFile
} from '@shared/helpers/file'
import { truncateText } from '@shared/helpers/string'
import type { MuiFileInputProps } from './index.types'

export { MuiFileInputProps }

type NonUndefined<T> = T extends undefined ? never : T

// eslint-disable-next-line react/function-component-definition
function MuiFileInput<T extends boolean = false>(props: MuiFileInputProps<T>) {
  const {
    value,
    onChange,
    disabled,
    getInputText,
    getSizeText,
    placeholder,
    hideSizeText,
    inputProps,
    InputProps,
    multiple,
    className,
    ...restTextFieldProps
  } = props
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isMultiple =
    multiple ||
    (inputProps?.multiple as boolean) ||
    (InputProps?.inputProps?.multiple as boolean) ||
    false

  const clearInputValue = () => {
    const inputEl = inputRef.current
    if (inputEl) {
      inputEl.value = ''
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    const files = fileList ? fileListToArray(fileList) : []
    clearInputValue()
    if (isMultiple) {
      onChange?.(files as NonNullable<typeof value>)
    } else {
      onChange?.(files[0] as NonNullable<typeof value>)
    }
  }

  const handleClearAll = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (disabled) {
      return
    }

    if (multiple) {
      onChange?.([] as unknown as NonNullable<typeof value>)
    } else {
      onChange?.(null as NonUndefined<typeof value>)
    }
  }

  const hasAtLeastOneFile = Array.isArray(value)
    ? matchIsNonEmptyArray(value)
    : matchIsFile(value)

  const getTheInputText = (): string => {
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      return placeholder || ''
    }
    if (typeof getInputText === 'function' && value !== undefined) {
      return getInputText(value)
    }
    if (value && hasAtLeastOneFile) {
      if (Array.isArray(value) && value.length > 1) {
        return `${value.length} files`
      }
      const filename = matchIsFile(value) ? value.name : value[0]?.name || ''
      return truncateText(filename, 20)
    }
    return ''
  }

  const getTotalSizeText = (): string => {
    if (typeof getSizeText === 'function' && value !== undefined) {
      return getSizeText(value)
    }
    if (hasAtLeastOneFile) {
      if (Array.isArray(value)) {
        const totalSize = getTotalFilesSize(value)
        return prettyBytes(totalSize)
      }
      if (matchIsFile(value)) {
        return prettyBytes(value.size)
      }
    }
    return ''
  }

  return (
    <TextField
      sx={{ '& .MuiInputBase-root label': { width: '100%' } }}
      type="file"
      disabled={disabled}
      onChange={handleChange}
      className={`MuiFileInput-TextField ${className || ''}`}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AttachFileIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment
            position="end"
            style={{ visibility: hasAtLeastOneFile ? 'visible' : 'hidden' }}
          >
            {!hideSizeText ? (
              <Typography
                variant="caption"
                mr="2px"
                className="MuiFileInput-Typography-size-text"
              >
                {getTotalSizeText()}
              </Typography>
            ) : null}
            <IconButton
              aria-label="Clear"
              title="Clear"
              size="small"
              disabled={disabled}
              className="MuiFileInput-IconButton"
              onClick={handleClearAll}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
        ...InputProps,
        inputProps: {
          text: getTheInputText(),
          multiple: isMultiple,
          isPlaceholder:
            value === null || (Array.isArray(value) && value.length === 0),
          ref: inputRef,
          placeholder,
          ...inputProps,
          ...InputProps?.inputProps
        },
        // @ts-ignore
        inputComponent: Input
      }}
      {...restTextFieldProps}
    />
  )
}

export { MuiFileInput }
