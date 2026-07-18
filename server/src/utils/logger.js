/**
 * Secure logging utility that prevents leakage of sensitive details (passwords, JWTs, etc.)
 */
export const logger = {
  info: (message, meta = {}) => {
    logger.log('INFO', message, meta);
  },
  
  warn: (message, meta = {}) => {
    logger.log('WARN', message, meta);
  },
  
  error: (message, error = null, meta = {}) => {
    const errorDetails = error ? { errorName: error.name, errorMessage: error.message } : {};
    logger.log('ERROR', message, { ...meta, ...errorDetails });
  },

  log: (level, message, meta = {}) => {
    // Sanitize meta parameters to avoid logging secrets, passwords, cookies, or JWTs
    const sanitizedMeta = { ...meta };
    const sensitiveKeys = ['password', 'token', 'jwt', 'cookie', 'secret', 'passwordConfirm', 'newPassword'];
    
    Object.keys(sanitizedMeta).forEach((key) => {
      if (sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
        sanitizedMeta[key] = '[REDACTED]';
      }
    });

    const metaStr = Object.keys(sanitizedMeta).length > 0 ? ` | ${JSON.stringify(sanitizedMeta)}` : '';
    console.log(`[${level}] ${message}${metaStr}`);
  }
};
