import type { ColumnMetadata } from "../metadata/ColumnMetadata";
/**
 * Provides utilities to transform hydrated and persisted data.
 */
export declare class DateUtils {
    /**
     * Normalizes date object hydrated from the database.
     *
     * @param mixedDate
     */
    static normalizeHydratedDate(mixedDate: Date | string | undefined): Date | string | undefined;
    /**
     * Converts given value into date string in a "YYYY-MM-DD" format.
     *
     * @param value
     * @param options
     * @param options.utc
     */
    static mixedDateToDateString(value: string | Date, options?: {
        utc?: boolean;
    }): string;
    /**
     * Converts given value into date object.
     *
     * @param mixedDate
     * @param toUtc
     * @param useMilliseconds
     */
    static mixedDateToDate(mixedDate: Date | string, toUtc?: boolean, useMilliseconds?: boolean): Date;
    /**
     * Converts given value into time string in a "HH:mm:ss" format.
     *
     * @param value
     * @param skipSeconds
     */
    static mixedDateToTimeString(value: Date | any, skipSeconds?: boolean): string | any;
    /**
     * Converts given value into time string in a "HH:mm:ss" format.
     *
     * @param value
     */
    static mixedTimeToDate(value: Date | any): string | any;
    /**
     * Converts given string value with "-" separator into a "HH:mm:ss" format.
     *
     * @param value
     * @param skipSeconds
     */
    static mixedTimeToString(value: string | any, skipSeconds?: boolean): string | any;
    /**
     * Converts given value into datetime string in a "YYYY-MM-DD HH-mm-ss" format.
     *
     * @param value
     * @param useMilliseconds
     */
    static mixedDateToDatetimeString(value: Date | any, useMilliseconds?: boolean): string | any;
    /**
     * Converts given value into utc datetime string in a "YYYY-MM-DD HH-mm-ss.sss" format.
     *
     * @param value
     */
    static mixedDateToUtcDatetimeString(value: Date | any): string | any;
    /**
     * Converts each item in the given array to string joined by "," separator.
     *
     * @param value
     */
    static simpleArrayToString(value: any[] | any): string[] | any;
    /**
     * Converts given string to simple array split by "," separator.
     *
     * @param value
     */
    static stringToSimpleArray(value: string | any): string | any;
    static simpleJsonToString(value: any): string;
    static stringToSimpleJson(value: any): any;
    /**
     * Converts given simple enum or array of enums to string.
     *
     * @param value
     */
    static simpleEnumToString(value: any): string;
    /**
     *  Converts given string to simple enum or array of enums based on the column metadata.
     *
     * @param value
     * @param columnMetadata
     */
    static stringToSimpleEnum(value: any, columnMetadata: ColumnMetadata): any;
    /**
     * Parses and converts a value to its numeric form if it exists in the provided enum values.
     *
     * @param value
     * @param enumValues
     */
    private static parseEnumValue;
    /**
     * Formats given number to "0x" format, e.g. if the totalLength = 2 and the value is 1 then it will return "01".
     *
     * @param value
     * @param totalLength
     */
    private static formatZerolessValue;
    /**
     * Formats given number to "0x" format, e.g. if it is 1 then it will return "01".
     *
     * @param value
     */
    private static formatMilliseconds;
}
