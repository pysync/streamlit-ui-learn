import { format, parse, isValid, addDays, addMonths, addYears } from 'date-fns';

/**
 * A simplified date adapter for MUI date components that avoids using
 * problematic imports from date-fns
 */
export default class SimpleDateAdapter {
  constructor({ locale } = {}) {
    this.locale = locale;
  }

  // Required methods
  date(value) {
    if (value === null) return null;
    return new Date(value);
  }

  toJsDate(value) {
    return value;
  }

  parse(value, format) {
    if (!value) return null;
    return parse(value, format, new Date());
  }

  format(date, formatString) {
    return format(date, formatString);
  }

  isValid(value) {
    return isValid(value);
  }

  addDays(date, amount) {
    return addDays(date, amount);
  }

  addMonths(date, amount) {
    return addMonths(date, amount);
  }

  addYears(date, amount) {
    return addYears(date, amount);
  }

  // Date getters
  getYear(date) {
    return date.getFullYear();
  }

  getMonth(date) {
    return date.getMonth();
  }

  getDate(date) {
    return date.getDate();
  }

  getHours(date) {
    return date.getHours();
  }

  getMinutes(date) {
    return date.getMinutes();
  }

  getSeconds(date) {
    return date.getSeconds();
  }

  // Date setters
  setYear(date, year) {
    const newDate = new Date(date);
    newDate.setFullYear(year);
    return newDate;
  }

  setMonth(date, month) {
    const newDate = new Date(date);
    newDate.setMonth(month);
    return newDate;
  }

  setDate(date, day) {
    const newDate = new Date(date);
    newDate.setDate(day);
    return newDate;
  }

  // Formatting
  formatByString(date, formatString) {
    return format(date, formatString);
  }

  // Localization
  getCurrentLocaleCode() {
    return this.locale?.code || 'en-US';
  }

  // Date range
  startOfYear(date) {
    return new Date(date.getFullYear(), 0, 1);
  }

  endOfYear(date) {
    return new Date(date.getFullYear(), 11, 31, 23, 59, 59);
  }

  startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  startOfWeek(date) {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
  }

  endOfWeek(date) {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - day), 23, 59, 59);
  }
} 