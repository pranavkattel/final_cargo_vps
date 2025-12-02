declare module '@zener/nepali-datepicker-react' {
  export class NepaliDate {
    constructor(date?: Date | string);
    
    getFullYear(): string | number;
    getMonth(): string | number;
    getMonthName(): string;
    getDate(): string | number;
    getDay(): string | number;
    getDayName(): string;
    getDayNameFull(): string;
    
    toAD(): { year: number; month: number; date: number };
    toADasDate(): Date;
    toJson(): any;
    toString(): string;
    format(format: string, lang?: 'en' | 'np'): string;
    
    add(value: number, type: 'day' | 'd' | 'week' | 'w' | 'month' | 'm' | 'year' | 'y'): NepaliDate;
    subtract(value: number, type: 'day' | 'd' | 'week' | 'w' | 'month' | 'm' | 'year' | 'y'): NepaliDate;
    setDate(value: number): void;
    setMonth(value: number): void;
    setFullYear(value: number): void;
    
    static now(): NepaliDate;
    static parseDate(date: string): { year: number; date: number; day: number };
  }
  
  export function formatADDate(date: Date, format?: string, lang?: 'en' | 'np'): string;
  export function toAD(date: string): { year: number; month: number; date: number };
  export function toBS(date: string): { year: number; month: number; date: number };
}
