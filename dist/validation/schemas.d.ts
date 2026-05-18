import { z } from 'zod';
export declare const LANGUAGE_CODES: readonly ["All", "sq", "ar", "bg", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "he", "hi", "hu", "ga", "it", "ja", "ko", "lv", "lt", "ms", "no", "nb", "nn", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sv", "ta", "th", "tr", "vi"];
export declare const LanguageCodeSchema: z.ZodEnum<["All", "sq", "ar", "bg", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "he", "hi", "hu", "ga", "it", "ja", "ko", "lv", "lt", "ms", "no", "nb", "nn", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sv", "ta", "th", "tr", "vi"]>;
export declare const URL_EXAMPLES_LANGUAGES: readonly ["all", ...("sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[]];
export declare const UrlExampleLanguageSchema: z.ZodEnum<["all", ...("sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[]]>;
export declare const CategoryTypeSchema: z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<5>, z.ZodLiteral<6>, z.ZodLiteral<7>, z.ZodLiteral<8>]>;
export declare const ItemsTypeSchema: z.ZodEnum<["REGULAR", "MUST_HAVE", "EXCLUDE"]>;
export declare const CategoryNameSchema: z.ZodString;
export declare const ItemSchema: z.ZodString;
export declare const ItemsArraySchema: z.ZodArray<z.ZodString, "many">;
export declare const EmailSchema: z.ZodString;
export declare const ExpirationDateSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const PartnerIdInputSchema: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
export declare const CreateCategoryInputSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<5>, z.ZodLiteral<6>, z.ZodLiteral<7>, z.ZodLiteral<8>]>;
    partnerId: z.ZodUnion<[z.ZodNumber, z.ZodString]>;
    items: z.ZodArray<z.ZodString, "many">;
    itemsTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<["REGULAR", "MUST_HAVE", "EXCLUDE"]>, "many">>;
    categoryName: z.ZodString;
    safeFrom: z.ZodDefault<z.ZodBoolean>;
    emailAddress: z.ZodOptional<z.ZodString>;
    expirationDate: z.ZodDefault<z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>>;
    languageCodes: z.ZodDefault<z.ZodArray<z.ZodEnum<["All", "sq", "ar", "bg", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "he", "hi", "hu", "ga", "it", "ja", "ko", "lv", "lt", "ms", "no", "nb", "nn", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sv", "ta", "th", "tr", "vi"]>, "many">>;
    description: z.ZodOptional<z.ZodString>;
    advertiserId: z.ZodOptional<z.ZodString>;
    buyerName: z.ZodOptional<z.ZodString>;
    buyerId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: 2 | 3 | 5 | 6 | 7 | 8;
    partnerId: string | number;
    items: string[];
    categoryName: string;
    safeFrom: boolean;
    expirationDate: string;
    languageCodes: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[];
    buyerId?: number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    emailAddress?: string | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
    buyerName?: string | undefined;
}, {
    type: 2 | 3 | 5 | 6 | 7 | 8;
    partnerId: string | number;
    items: string[];
    categoryName: string;
    buyerId?: number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
    buyerName?: string | undefined;
}>, {
    type: 2 | 3 | 5 | 6 | 7 | 8;
    partnerId: string | number;
    items: string[];
    categoryName: string;
    safeFrom: boolean;
    expirationDate: string;
    languageCodes: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[];
    buyerId?: number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    emailAddress?: string | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
    buyerName?: string | undefined;
}, {
    type: 2 | 3 | 5 | 6 | 7 | 8;
    partnerId: string | number;
    items: string[];
    categoryName: string;
    buyerId?: number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
    buyerName?: string | undefined;
}>, {
    type: 2 | 3 | 5 | 6 | 7 | 8;
    partnerId: string | number;
    items: string[];
    categoryName: string;
    safeFrom: boolean;
    expirationDate: string;
    languageCodes: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[];
    buyerId?: number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    emailAddress?: string | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
    buyerName?: string | undefined;
}, {
    type: 2 | 3 | 5 | 6 | 7 | 8;
    partnerId: string | number;
    items: string[];
    categoryName: string;
    buyerId?: number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
    buyerName?: string | undefined;
}>;
export declare const GetCategoryInputSchema: z.ZodObject<{
    accountCategoryId: z.ZodNumber;
    partnerId: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
    buyerId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    accountCategoryId: number;
    buyerId?: number | undefined;
    partnerId?: string | number | undefined;
}, {
    accountCategoryId: number;
    buyerId?: number | undefined;
    partnerId?: string | number | undefined;
}>;
export declare const ListCategoriesInputSchema: z.ZodObject<{
    buyer: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    partner: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    max: z.ZodOptional<z.ZodNumber>;
    start: z.ZodOptional<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    filterProperty: z.ZodOptional<z.ZodString>;
    filterValue: z.ZodOptional<z.ZodString>;
    filterRange: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sort?: string | undefined;
    buyer?: number[] | undefined;
    partner?: number[] | undefined;
    max?: number | undefined;
    start?: number | undefined;
    filterProperty?: string | undefined;
    filterValue?: string | undefined;
    filterRange?: string | undefined;
}, {
    sort?: string | undefined;
    buyer?: number[] | undefined;
    partner?: number[] | undefined;
    max?: number | undefined;
    start?: number | undefined;
    filterProperty?: string | undefined;
    filterValue?: string | undefined;
    filterRange?: string | undefined;
}>;
export declare const UpdateCategoryDetailsInputSchema: z.ZodObject<{
    partnerCategoryId: z.ZodNumber;
    expirationDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    emailAddress: z.ZodOptional<z.ZodString>;
    categoryName: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<5>, z.ZodLiteral<6>, z.ZodLiteral<7>, z.ZodLiteral<8>]>>;
    description: z.ZodOptional<z.ZodString>;
    partnerId: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
    buyerId: z.ZodOptional<z.ZodNumber>;
    languageCodes: z.ZodOptional<z.ZodArray<z.ZodEnum<["All", "sq", "ar", "bg", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "he", "hi", "hu", "ga", "it", "ja", "ko", "lv", "lt", "ms", "no", "nb", "nn", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sv", "ta", "th", "tr", "vi"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    partnerCategoryId: number;
    buyerId?: number | undefined;
    type?: 2 | 3 | 5 | 6 | 7 | 8 | undefined;
    partnerId?: string | number | undefined;
    categoryName?: string | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
}, {
    partnerCategoryId: number;
    buyerId?: number | undefined;
    type?: 2 | 3 | 5 | 6 | 7 | 8 | undefined;
    partnerId?: string | number | undefined;
    categoryName?: string | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
}>;
export declare const UpdateCategoryItemsInputSchema: z.ZodEffects<z.ZodObject<{
    partnerCategoryId: z.ZodNumber;
    partnerId: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
    buyerId: z.ZodOptional<z.ZodNumber>;
    items: z.ZodArray<z.ZodString, "many">;
    itemsTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<["REGULAR", "MUST_HAVE", "EXCLUDE"]>, "many">>;
    append: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    items: string[];
    partnerCategoryId: number;
    buyerId?: number | undefined;
    partnerId?: string | number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    append?: boolean | undefined;
}, {
    items: string[];
    partnerCategoryId: number;
    buyerId?: number | undefined;
    partnerId?: string | number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    append?: boolean | undefined;
}>, {
    items: string[];
    partnerCategoryId: number;
    buyerId?: number | undefined;
    partnerId?: string | number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    append?: boolean | undefined;
}, {
    items: string[];
    partnerCategoryId: number;
    buyerId?: number | undefined;
    partnerId?: string | number | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    append?: boolean | undefined;
}>;
export declare const UpdateCategoryInputSchema: z.ZodEffects<z.ZodObject<{
    partnerCategoryId: z.ZodNumber;
    buyerId: z.ZodOptional<z.ZodNumber>;
    partnerId: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
    categoryName: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<3>, z.ZodLiteral<5>, z.ZodLiteral<6>, z.ZodLiteral<7>, z.ZodLiteral<8>]>>;
    items: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    itemsTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<["REGULAR", "MUST_HAVE", "EXCLUDE"]>, "many">>;
    safeFrom: z.ZodOptional<z.ZodBoolean>;
    emailAddress: z.ZodOptional<z.ZodString>;
    expirationDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    languageCodes: z.ZodOptional<z.ZodArray<z.ZodEnum<["All", "sq", "ar", "bg", "zh", "hr", "cs", "da", "nl", "en", "et", "fi", "fr", "de", "el", "he", "hi", "hu", "ga", "it", "ja", "ko", "lv", "lt", "ms", "no", "nb", "nn", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl", "es", "sv", "ta", "th", "tr", "vi"]>, "many">>;
    description: z.ZodOptional<z.ZodString>;
    advertiserId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    partnerCategoryId: number;
    buyerId?: number | undefined;
    type?: 2 | 3 | 5 | 6 | 7 | 8 | undefined;
    partnerId?: string | number | undefined;
    items?: string[] | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    categoryName?: string | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
}, {
    partnerCategoryId: number;
    buyerId?: number | undefined;
    type?: 2 | 3 | 5 | 6 | 7 | 8 | undefined;
    partnerId?: string | number | undefined;
    items?: string[] | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    categoryName?: string | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
}>, {
    partnerCategoryId: number;
    buyerId?: number | undefined;
    type?: 2 | 3 | 5 | 6 | 7 | 8 | undefined;
    partnerId?: string | number | undefined;
    items?: string[] | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    categoryName?: string | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
}, {
    partnerCategoryId: number;
    buyerId?: number | undefined;
    type?: 2 | 3 | 5 | 6 | 7 | 8 | undefined;
    partnerId?: string | number | undefined;
    items?: string[] | undefined;
    itemsTypes?: ("REGULAR" | "MUST_HAVE" | "EXCLUDE")[] | undefined;
    categoryName?: string | undefined;
    safeFrom?: boolean | undefined;
    emailAddress?: string | undefined;
    expirationDate?: string | undefined;
    languageCodes?: ("All" | "sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[] | undefined;
    description?: string | undefined;
    advertiserId?: string | undefined;
}>;
export declare const DeleteCategoryInputSchema: z.ZodObject<{
    categories: z.ZodArray<z.ZodObject<{
        partnerCategoryId: z.ZodNumber;
        buyerId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        partnerCategoryId: number;
        buyerId?: number | undefined;
    }, {
        partnerCategoryId: number;
        buyerId?: number | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    categories: {
        partnerCategoryId: number;
        buyerId?: number | undefined;
    }[];
}, {
    categories: {
        partnerCategoryId: number;
        buyerId?: number | undefined;
    }[];
}>;
export declare const GetUrlExamplesInputSchema: z.ZodObject<{
    languages: z.ZodArray<z.ZodEnum<["all", ...("sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi")[]]>, "many">;
    partners: z.ZodArray<z.ZodNumber, "many">;
    items: z.ZodArray<z.ZodObject<{
        phrase: z.ZodString;
        type: z.ZodEnum<["REGULAR", "MUST_HAVE", "EXCLUDE"]>;
    }, "strip", z.ZodTypeAny, {
        type: "REGULAR" | "MUST_HAVE" | "EXCLUDE";
        phrase: string;
    }, {
        type: "REGULAR" | "MUST_HAVE" | "EXCLUDE";
        phrase: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        type: "REGULAR" | "MUST_HAVE" | "EXCLUDE";
        phrase: string;
    }[];
    languages: ("sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi" | "all")[];
    partners: number[];
}, {
    items: {
        type: "REGULAR" | "MUST_HAVE" | "EXCLUDE";
        phrase: string;
    }[];
    languages: ("sq" | "ar" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "en" | "et" | "fi" | "fr" | "de" | "el" | "he" | "hi" | "hu" | "ga" | "it" | "ja" | "ko" | "lv" | "lt" | "ms" | "no" | "nb" | "nn" | "fa" | "pl" | "pt" | "ro" | "ru" | "sr" | "sk" | "sl" | "es" | "sv" | "ta" | "th" | "tr" | "vi" | "all")[];
    partners: number[];
}>;
export declare const ConfigureInputSchema: z.ZodEffects<z.ZodObject<{
    buyerId: z.ZodOptional<z.ZodNumber>;
    system: z.ZodOptional<z.ZodString>;
    userEmail: z.ZodOptional<z.ZodString>;
    defaultPartnerId: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodString]>>;
}, "strip", z.ZodTypeAny, {
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: string | number | undefined;
}, {
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: string | number | undefined;
}>, {
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: string | number | undefined;
}, {
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: string | number | undefined;
}>;
export declare const CheckSetupInputSchema: z.ZodObject<{}, "strict", z.ZodTypeAny, {}, {}>;
//# sourceMappingURL=schemas.d.ts.map