export declare enum SeasonType {
    WINTER = "WINTER",
    SPRING = "SPRING",
    SUMMER = "SUMMER",
    FALL = "FALL"
}
export declare const getSeason: (dateInSecs: number) => SeasonType;
