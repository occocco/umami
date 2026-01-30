/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend((utc as unknown as { default: dayjs.PluginFunc }).default || utc);
dayjs.extend(
  (timezone as unknown as { default: dayjs.PluginFunc }).default || timezone,
);

const SEOUL_TIMEZONE = 'Asia/Seoul';

type DateInput = Date | string;

export class TimeUtils {
  /**
   * UTC Date를 서울 시간대 dayjs 객체로 변환
   */
  static toSeoul(date: DateInput): dayjs.Dayjs {
    return dayjs(date).tz(SEOUL_TIMEZONE);
  }

  /**
   * 서울 시간대 기준으로 입력된 날짜를 UTC Date로 변환
   * (사용자 입력을 DB에 저장할 때 사용)
   */
  static toUTC(date: DateInput): Date {
    return dayjs.tz(date, SEOUL_TIMEZONE).utc().toDate();
  }

  /**
   * UTC Date를 서울 시간대로 포맷팅
   * @param date UTC 날짜
   * @param format dayjs 포맷 문자열 (기본: 'YYYY-MM-DD HH:mm:ss')
   */
  static formatSeoul(date: DateInput, format = 'YYYY-MM-DD HH:mm:ss'): string {
    return TimeUtils.toSeoul(date).format(format);
  }

  /**
   * 현재 서울 시간 반환
   */
  static nowSeoul(): dayjs.Dayjs {
    return dayjs().tz(SEOUL_TIMEZONE);
  }

  /**
   * 현재 UTC 시간 반환 (DB 저장용)
   */
  static nowUTC(): Date {
    return dayjs.utc().toDate();
  }

  /**
   * 서울 시간대 기준 오늘 시작 시간 (00:00:00) UTC로 반환
   */
  static todayStartUTC(): Date {
    return dayjs().tz(SEOUL_TIMEZONE).startOf('day').utc().toDate();
  }

  /**
   * 서울 시간대 기준 오늘 끝 시간 (23:59:59) UTC로 반환
   */
  static todayEndUTC(): Date {
    return dayjs().tz(SEOUL_TIMEZONE).endOf('day').utc().toDate();
  }
}
