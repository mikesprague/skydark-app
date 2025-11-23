import dayjs from 'dayjs';
import dayjsAdvancedFormat from 'dayjs/plugin/advancedFormat';
import dayjsRelativeTime from 'dayjs/plugin/relativeTime';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';

// Initialize plugins once
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsRelativeTime);
dayjs.extend(dayjsAdvancedFormat);

// Set default timezone
dayjs.tz.setDefault('America/New_York');

export { dayjs };
export default dayjs;
