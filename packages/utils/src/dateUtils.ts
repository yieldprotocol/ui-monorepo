import { getMonth } from 'date-fns';

// TODO make it change based on hemisphere ( ie swap winter and summer)
export enum SeasonType {
    WINTER = 'WINTER',
    SPRING = 'SPRING',
    SUMMER = 'SUMMER',
    FALL = 'FALL',
  }
  export const getSeason = (dateInSecs: number): SeasonType => {
    const month: number = getMonth(new Date(dateInSecs * 1000));
    const seasons = [
      SeasonType.WINTER,
      SeasonType.WINTER,
      SeasonType.SPRING,
      SeasonType.SPRING,
      SeasonType.SPRING,
      SeasonType.SUMMER,
      SeasonType.SUMMER,
      SeasonType.SUMMER,
      SeasonType.FALL,
      SeasonType.FALL,
      SeasonType.FALL,
      SeasonType.WINTER,
    ];
    return seasons[month];
};