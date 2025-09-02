/**
 * Custom logger utility to control application logging
 */

// Environment-dependent logging level
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Log levels hierarchy (higher number = more verbose)
const LOG_LEVELS = {
  none: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};

// Get numeric value of current log level
const currentLogLevel = LOG_LEVELS[LOG_LEVEL] || LOG_LEVELS.info;

/**
 * Determines if a message at the given level should be logged
 * @param {string} level - Log level to check
 * @returns {boolean} Whether to log the message
 */
const shouldLog = (level) => {
  return LOG_LEVELS[level] <= currentLogLevel;
};

/**
 * Custom logger implementation
 */
const logger = {
  /**
   * Log error messages (always logged unless level is none)
   * @param {...any} args - Arguments to log
   */
  error: (...args) => {
    if (shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  },

  /**
   * Log warning messages
   * @param {...any} args - Arguments to log
   */
  warn: (...args) => {
    if (shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  },

  /**
   * Log informational messages
   * @param {...any} args - Arguments to log
   */
  info: (...args) => {
    if (shouldLog('info')) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log debug messages (most verbose)
   * @param {...any} args - Arguments to log
   */
  debug: (...args) => {
    if (shouldLog('debug')) {
      console.log('[DEBUG]', ...args);
    }
  }
};

module.exports = logger;
