import { createLogger, format, transports } from 'winston';

const isLoggingEnabled = process.env.ENABLE_LOGS === '1';

const logFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
);

const logger = createLogger({
    level: isLoggingEnabled ? 'info' : 'silent', // Disable logs by setting level to 'silent'
    format: logFormat,
    transports: [new transports.Console()],
});

export default logger; //Export logger
