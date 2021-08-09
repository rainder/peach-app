/* eslint-disable no-console */

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const info = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.info(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const log = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const trace = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.trace(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const warn = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const error = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(new Date(), args)
  }
}

export default {
  info,
  log,
  trace,
  warn,
  error
}