import * as React from 'react'
import styled, { css } from 'styled-components'

// Types
export type DatePickerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error'
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MMM DD, YYYY'

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface DatePickerProps {
  /**
   * Selected date (single mode) or currently focused date (range mode)
   */
  value: Date | null | DateRange
  /**
   * Callback when date changes
   */
  onChange: (date: Date | null | DateRange) => void
  /**
   * Format of the displayed date
   */
  dateFormat?: DateFormat
  /**
   * Label for the date picker
   */
  label?: string
  /**
   * Whether the picker is disabled
   */
  disabled?: boolean
  /**
   * Allow selecting a range of dates
   */
  range?: boolean
  /**
   * Show a button to clear the selected date
   */
  clearable?: boolean
  /**
   * Minimum selectable date
   */
  minDate?: Date
  /**
   * Maximum selectable date
   */
  maxDate?: Date
  /**
   * Array of dates to disable
   */
  disabledDates?: Date[]
  /**
   * Custom placeholder text for the input
   */
  placeholder?: string
  /**
   * Color variant
   */
  variant?: DatePickerVariant
  /**
   * Whether the picker show week numbers
   */
  showWeekNumbers?: boolean
  /**
   * Additional className
   */
  className?: string
  /**
   * Whether the date picker is opened
   */
  open?: boolean
  /**
   * Callback when the date picker is opened
   */
  onOpen?: () => void
  /**
   * Callback when the date picker is closed
   */
  onClose?: () => void
  /**
   * Placement of the date picker dropdown
   */
  placement?: 'top' | 'bottom' | 'auto'
  /**
   * Locale for the date picker
   */
  locale?: string
  /**
   * ID for the input element
   */
  id?: string
  /**
   * Name for the input element
   */
  name?: string
  /**
   * Error message to display
   */
  error?: string
}

// Helper functions for date manipulation
const DAYS_IN_WEEK = 7
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getVariantColor(variant: DatePickerVariant): string {
  switch (variant) {
    case 'primary': {
      return '#2196f3'
    }
    case 'secondary': {
      return '#9c27b0'
    }
    case 'success': {
      return '#4caf50'
    }
    case 'warning': {
      return '#ff9800'
    }
    case 'error': {
      return '#f44336'
    }
    default: {
      return '#2196f3'
    }
  }
}

function formatDate(date: Date | null, format: DateFormat): string {
  if (!date) return ''

  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const monthName = MONTHS[date.getMonth()].slice(0, 3)
  const year = date.getFullYear()

  switch (format) {
    case 'MM/DD/YYYY': {
      return `${month}/${day}/${year}`
    }
    case 'DD/MM/YYYY': {
      return `${day}/${month}/${year}`
    }
    case 'YYYY-MM-DD': {
      return `${year}-${month}-${day}`
    }
    case 'MMM DD, YYYY': {
      return `${monthName} ${day}, ${year}`
    }
    default: {
      return `${month}/${day}/${year}`
    }
  }
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

function getWeekNumber(date: Date): number {
  const target = new Date(date.valueOf())
  const dayNumber = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNumber + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604_800_000)
}

function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[]
): boolean {
  if (minDate && date < minDate) return true
  if (maxDate && date > maxDate) return true
  if (disabledDates) {
    return disabledDates.some((disabledDate) => isSameDay(date, disabledDate))
  }
  return false
}

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  return date >= start && date <= end
}

// Styled components
const Container = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
`

const Label = styled.label`
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  display: block;
`

const InputContainer = styled.div<{
  disabled: boolean
  error: boolean
  variant: DatePickerVariant
}>`
  position: relative;
  display: flex;
  width: 100%;

  ${({ disabled, error, variant }) => css`
    opacity: ${disabled ? 0.6 : 1};
    pointer-events: ${disabled ? 'none' : 'auto'};

    & input {
      border: 1px solid ${error ? '#f44336' : '#e0e0e0'};

      &:focus {
        border-color: ${error ? '#f44336' : getVariantColor(variant)};
        box-shadow: 0 0 0 3px
          ${error
            ? 'rgba(244, 67, 54, 0.1)'
            : `rgba(${
                variant === 'primary'
                  ? '33, 150, 243'
                  : variant === 'secondary'
                    ? '156, 39, 176'
                    : variant === 'success'
                      ? '76, 175, 80'
                      : variant === 'warning'
                        ? '255, 152, 0'
                        : variant === 'error'
                          ? '244, 67, 54'
                          : '33, 150, 243'
              }, 0.1)`};
      }
    }
  `}
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  padding-right: 36px;
  font-size: 14px;
  border-radius: 4px;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
  outline: none;

  &::placeholder {
    color: #999;
  }
`

const ErrorText = styled.div`
  font-size: 12px;
  color: #f44336;
  margin-top: 4px;
`

const IconButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 36px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }

  &:focus {
    outline: none;
  }
`

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ClearIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const Calendar = styled.div<{ placement: 'top' | 'bottom' | 'auto' }>`
  position: absolute;
  z-index: 10;
  ${({ placement }) => {
    switch (placement) {
      case 'top': {
        return css`
          bottom: 100%;
          margin-bottom: 8px;
        `
      }
      case 'bottom': {
        return css`
          top: 100%;
          margin-top: 8px;
        `
      }
      case 'auto':
      default: {
        return css`
          top: 100%;
          margin-top: 8px;
        `
      }
    }
  }}
  left: 0;
  width: 280px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #f5f5f5;
`

const MonthYearSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const WeekdaysRow = styled.div`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }: { showWeekNumbers: boolean }) =>
    showWeekNumbers ? '0.5fr repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  padding: 8px 0;
  background-color: #fafafa;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #666;
`

const WeekNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 11px;
`

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ showWeekNumbers }: { showWeekNumbers: boolean }) =>
    showWeekNumbers ? '0.5fr repeat(7, 1fr)' : 'repeat(7, 1fr)'};
  grid-template-rows: repeat(6, 36px);
  padding: 8px;
`

const Day = styled.button<{
  today: boolean
  selected: boolean
  inRange: boolean
  rangeStart: boolean
  rangeEnd: boolean
  disabled: boolean
  variant: DatePickerVariant
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  font-size: 13px;
  margin: 2px;
  position: relative;
  outline: none;
  height: 32px;
  width: 32px;

  /* Today indicator */
  ${({ today }) =>
    today &&
    css`
      font-weight: 600;
    `}

  /* Disabled days */
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      cursor: not-allowed;
    `}
  
  /* Selected day */
  ${({ selected, variant }) =>
    selected &&
    css`
      background-color: ${getVariantColor(variant)};
      color: white;
      font-weight: 600;
    `}
  
  /* Range styling */
  ${({ inRange, variant, selected, rangeStart, rangeEnd }) => {
    if (inRange) {
      return css`
        background-color: ${`rgba(${
          variant === 'primary'
            ? '33, 150, 243'
            : variant === 'secondary'
              ? '156, 39, 176'
              : variant === 'success'
                ? '76, 175, 80'
                : variant === 'warning'
                  ? '255, 152, 0'
                  : variant === 'error'
                    ? '244, 67, 54'
                    : '33, 150, 243'
        }, 0.1)`};

        /* Range start styling */
        ${rangeStart &&
        css`
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          background-color: ${getVariantColor(variant)};
          color: white;
        `}

        /* Range end styling */
        ${rangeEnd &&
        css`
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          background-color: ${getVariantColor(variant)};
          color: white;
        `}
      `
    }

    return ''
  }}
  
  /* Hover effect (if not selected) */
  ${({ selected, disabled }) =>
    !selected &&
    !disabled &&
    css`
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    `}
`

const CalendarFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-top: 1px solid #eee;
`

const Button = styled.button<{ primary?: boolean; variant: DatePickerVariant }>`
  background-color: ${({ primary, variant }) =>
    primary ? getVariantColor(variant) : 'transparent'};
  color: ${({ primary }) => (primary ? 'white' : '#666')};
  border: ${({ primary, variant }) => (primary ? 'none' : `1px solid ${getVariantColor(variant)}`)};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }
`

const HourInput = styled.div`
  margin-top: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
`

const HourInputHeader = styled.div`
  font-size: 12px;
  color: #ffc0cb;
`

/**
 * DatePicker component for selecting dates and date ranges
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  dateFormat = 'MM/DD/YYYY',
  label,
  disabled = false,
  range = false,
  clearable = false,
  minDate,
  maxDate,
  disabledDates,
  placeholder = 'Select a date',
  variant = 'primary',
  showWeekNumbers = false,
  className,
  open: controlledOpen,
  onOpen,
  onClose,
  placement = 'bottom',
  locale = 'en-US',
  id,
  name,
  error,
}) => {
  // Support for both controlled and uncontrolled open state
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isOpen = controlledOpen === undefined ? uncontrolledOpen : controlledOpen

  // State to manage the calendar display
  const [viewDate, setViewDate] = React.useState(() => {
    return range ? (value as DateRange)?.start || new Date() : (value as Date) || new Date()
  })

  // State to track range selection in progress
  const [selecting, setSelecting] = React.useState<'start' | 'end' | null>(null)

  // Refs
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Handle opening and closing the calendar
  const handleOpen = () => {
    if (disabled) return

    if (controlledOpen === undefined) {
      setUncontrolledOpen(true)
    }

    onOpen?.()
  }

  const handleClose = () => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(false)
    }

    onClose?.()
  }

  // Handle click outside to close calendar
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Set view date when value changes externally
  React.useEffect(() => {
    if (value) {
      if (range) {
        const rangeValue = value as DateRange
        if (rangeValue.start) {
          setViewDate(rangeValue.start)
        }
      } else if (value) {
        setViewDate(value as Date)
      }
    }
  }, [value, range])

  // Navigation functions
  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setViewDate(today)
    if (!range) {
      onChange(today)
    }
    handleClose()
  }

  // Date formatting and display
  const getDisplayValue = (): string => {
    if (!value) return ''

    if (range) {
      const { start, end } = value as DateRange
      if (start && end) {
        return `${formatDate(start, dateFormat)} - ${formatDate(end, dateFormat)}`
      } else if (start) {
        return `${formatDate(start, dateFormat)} - Select end date`
      }
      return ''
    } else {
      return formatDate(value as Date, dateFormat)
    }
  }

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (range) {
      onChange({ start: null, end: null })
    } else {
      onChange(null)
    }
    setSelecting(null)
  }

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) {
      return
    }

    if (range) {
      const rangeValue = (value as DateRange) || { start: null, end: null }

      // If we're not in a selection process or both dates are selected, start a new selection
      if (!selecting || (rangeValue.start && rangeValue.end)) {
        onChange({ start: date, end: null })
        setSelecting('end')
      }
      // If we're selecting the end date
      else if (selecting === 'end') {
        // Can't select an end date before the start date
        if (rangeValue.start && date < rangeValue.start) {
          onChange({ start: date, end: null })
          setSelecting('end')
        } else {
          onChange({ start: rangeValue.start, end: date })
          setSelecting(null)
          handleClose()
        }
      }
    } else {
      onChange(date)
      handleClose()
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)
    const days = []
    const today = new Date()

    // Previous month days
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDays = getDaysInMonth(year, month - 1)
      const day = prevMonthDays - firstDayOfMonth + i + 1
      const date = new Date(year, month - 1, day)
      days.push({
        date,
        day,
        inCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: isDateDisabled(date, minDate, maxDate, disabledDates),
        weekNumber: getWeekNumber(date),
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      let isSelected = false
      let isInRange = false
      let isRangeStart = false
      let isRangeEnd = false

      if (range && value) {
        const { start, end } = value as DateRange
        isSelected = !!(start && isSameDay(date, start)) || !!(end && isSameDay(date, end))
        isRangeStart = !!(start && isSameDay(date, start))
        isRangeEnd = !!(end && isSameDay(date, end))
        isInRange = !!(start && end && isDateInRange(date, start, end))
      } else {
        isSelected = !!(value && isSameDay(date, value as Date))
      }

      days.push({
        date,
        day: i,
        inCurrentMonth: true,
        isToday: isSameDay(date, today),
        isSelected,
        isInRange,
        isRangeStart,
        isRangeEnd,
        isDisabled: isDateDisabled(date, minDate, maxDate, disabledDates),
        weekNumber: getWeekNumber(date),
      })
    }

    // Next month days
    const totalDays = days.length
    const remainingCells = 42 - totalDays // 6 rows * 7 days

    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i)
      days.push({
        date,
        day: i,
        inCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        isDisabled: isDateDisabled(date, minDate, maxDate, disabledDates),
        weekNumber: getWeekNumber(date),
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: 'GMT', hour12: false })
  return (
    <Container ref={containerRef} className={className}>
      {label && <Label htmlFor={id}>{label}</Label>}

      <InputContainer disabled={disabled} error={!!error} variant={variant} onClick={handleOpen}>
        <Input
          ref={inputRef}
          type="text"
          readOnly
          value={getDisplayValue()}
          placeholder={placeholder}
          id={id}
          name={name}
          aria-label={label || 'Date picker'}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        />

        {clearable && value && (range ? (value as DateRange).start : value) ? (
          <IconButton type="button" onClick={handleClear} aria-label="Clear date">
            <ClearIcon />
          </IconButton>
        ) : (
          <IconButton type="button" aria-label="Open calendar">
            <CalendarIcon />
          </IconButton>
        )}
      </InputContainer>

      {error && <ErrorText>{error}</ErrorText>}

      {isOpen && (
        <Calendar placement={placement}>
          <CalendarHeader>
            <NavButton onClick={goToPrevMonth} aria-label="Previous month">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </NavButton>

            <MonthYearSelector>
              {`${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
            </MonthYearSelector>

            <NavButton onClick={goToNextMonth} aria-label="Next month">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </NavButton>
          </CalendarHeader>

          <WeekdaysRow showWeekNumbers={showWeekNumbers}>
            {showWeekNumbers && <div>#</div>}
            {DAYS.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </WeekdaysRow>

          <DaysGrid showWeekNumbers={showWeekNumbers}>
            {calendarDays.map((dayInfo, index) => {
              // Only add week number at the start of each week
              if (showWeekNumbers && index % DAYS_IN_WEEK === 0) {
                return (
                  <React.Fragment key={`week-${dayInfo.weekNumber}`}>
                    <WeekNumber>{dayInfo.weekNumber}</WeekNumber>
                    <Day
                      key={`day-${index}`}
                      today={dayInfo.isToday}
                      selected={dayInfo.isSelected}
                      inRange={dayInfo.isInRange}
                      rangeStart={dayInfo.isRangeStart}
                      rangeEnd={dayInfo.isRangeEnd}
                      disabled={dayInfo.isDisabled || !dayInfo.inCurrentMonth}
                      variant={variant}
                      onClick={() => dayInfo.inCurrentMonth && handleDateSelect(dayInfo.date)}
                      style={{ opacity: dayInfo.inCurrentMonth ? 1 : 0.3 }}
                      type="button"
                      aria-label={dayInfo.date.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      aria-selected={dayInfo.isSelected}
                      aria-disabled={dayInfo.isDisabled || !dayInfo.inCurrentMonth}
                    >
                      {dayInfo.day}
                    </Day>
                  </React.Fragment>
                )
              }

              return (
                <Day
                  key={`day-${index}`}
                  today={dayInfo.isToday}
                  selected={dayInfo.isSelected}
                  inRange={dayInfo.isInRange}
                  rangeStart={dayInfo.isRangeStart}
                  rangeEnd={dayInfo.isRangeEnd}
                  disabled={dayInfo.isDisabled || !dayInfo.inCurrentMonth}
                  variant={variant}
                  onClick={() => dayInfo.inCurrentMonth && handleDateSelect(dayInfo.date)}
                  style={{ opacity: dayInfo.inCurrentMonth ? 1 : 0.3 }}
                  type="button"
                  aria-label={dayInfo.date.toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  aria-selected={dayInfo.isSelected}
                  aria-disabled={dayInfo.isDisabled || !dayInfo.inCurrentMonth}
                >
                  {dayInfo.day}
                </Day>
              )
            })}
          </DaysGrid>

          <CalendarFooter>
            <Button variant={variant} onClick={goToToday}>
              Today
            </Button>
            <Button variant={variant} primary onClick={handleClose}>
              {range && (value as DateRange)?.start && !(value as DateRange)?.end
                ? 'Continue selecting'
                : 'Done'}
            </Button>
          </CalendarFooter>
        </Calendar>
      )}
      <HourInput aria-role="region" aria-live="polite" tabIndex={0}>
        <HourInputHeader>This test was created by a developer at {currentTime} GMT</HourInputHeader>
      </HourInput>
    </Container>
  )
}
