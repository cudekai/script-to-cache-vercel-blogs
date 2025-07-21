const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const LANGUAGES = [
  {
    languageId: 1,
    symbol: "en",
    language: "English",
    nativeName: "English",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇬🇧", // United Kingdom
  },
  {
    languageId: 2,
    symbol: "af",
    language: "Afrikaans",
    nativeName: "Afrikaans",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇿🇦", // South Africa
  },
  {
    languageId: 3,
    symbol: "sq",
    language: "Albanian",
    nativeName: "shqiptar",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇦🇱", // Albania
  },
  {
    languageId: 4,
    symbol: "am",
    language: "Amharic",
    nativeName: "አማርኛ",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇪🇹", // Ethiopia
  },
  {
    languageId: 5,
    symbol: "ar",
    language: "Arabic",
    nativeName: "عربى",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇸🇦", // Saudi Arabia (a representative Arabic-speaking country)
  },
  {
    languageId: 6,
    symbol: "hy",
    language: "Armenian",
    nativeName: "հայերեն",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇦🇲", // Armenia
  },
  {
    languageId: 7,
    symbol: "az",
    language: "Azerbaijani",
    nativeName: "Azərbaycan",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇦🇿", // Azerbaijan
  },
  {
    languageId: 8,
    symbol: "eu",
    language: "Basque",
    nativeName: "Euskal",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇪🇸", // Spain (Basque Country region)
  },
  {
    languageId: 9,
    symbol: "be",
    language: "Belarusian",
    nativeName: "беларускі",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇧🇾", // Belarus
  },
  {
    languageId: 10,
    symbol: "bn",
    language: "Bengali",
    nativeName: "বাঙালি",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇧🇩", // Bangladesh
  },
  {
    languageId: 11,
    symbol: "bs",
    language: "Bosnian",
    nativeName: "Bosanski",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇧🇦", // Bosnia and Herzegovina
  },
  {
    languageId: 12,
    symbol: "bg",
    language: "Bulgarian",
    nativeName: "български",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇧🇬", // Bulgaria
  },
  {
    languageId: 13,
    symbol: "ca",
    language: "Catalan",
    nativeName: "Català",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇪🇸", // Spain (Catalonia region)
  },
  {
    languageId: 14,
    symbol: "ceb",
    language: "Cebuano",
    nativeName: "Cebuano",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇵🇭", // Philippines
  },
  {
    languageId: 15,
    symbol: "ny",
    language: "Chichewa",
    nativeName: "Chichewa",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇲🇼", // Malawi
  },
  {
    languageId: 16,
    symbol: "zh-cn",
    language: "Chinese Simplified",
    nativeName: "简体中文",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇨🇳", // China
  },
  {
    languageId: 17,
    symbol: "zh-tw",
    language: "Chinese Traditional",
    nativeName: "中國傳統的",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇹🇼", // Taiwan
  },
  {
    languageId: 18,
    symbol: "co",
    language: "Corsican",
    nativeName: "Corsu",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇫🇷", // France (Corsica)
  },
  {
    languageId: 19,
    symbol: "hr",
    language: "Croatian",
    nativeName: "Hrvatski",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇭🇷", // Croatia
  },
  {
    languageId: 20,
    symbol: "cs",
    language: "Czech",
    nativeName: "čeština",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇨🇿", // Czech Republic
  },
  {
    languageId: 21,
    symbol: "da",
    language: "Danish",
    nativeName: "dansk",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇩🇰", // Denmark
  },
  {
    languageId: 22,
    symbol: "nl",
    language: "Dutch",
    nativeName: "Nederlands",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇳🇱", // Netherlands
  },
  {
    languageId: 23,
    symbol: "eo",
    language: "Esperanto",
    nativeName: "Esperanto",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "", // Esperanto is a constructed language, no specific country flag
  },
  {
    languageId: 24,
    symbol: "et",
    language: "Estonian",
    nativeName: "Eesti keel",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇪🇪", // Estonia
  },
  {
    languageId: 25,
    symbol: "tl",
    language: "Filipino",
    nativeName: "Filipino",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇵🇭", // Philippines
  },
  {
    languageId: 26,
    symbol: "fi",
    language: "Finnish",
    nativeName: "suomi",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇫🇮", // Finland
  },
  {
    languageId: 27,
    symbol: "fr",
    language: "French",
    nativeName: "français",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇫🇷", // France
  },
  {
    languageId: 28,
    symbol: "fy",
    language: "Frisian",
    nativeName: "Frysk",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇳🇱", // Netherlands (Friesland)
  },
  {
    languageId: 29,
    symbol: "gl",
    language: "Galician",
    nativeName: "Galego",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇪🇸", // Spain (Galicia)
  },
  {
    languageId: 30,
    symbol: "ka",
    language: "Georgian",
    nativeName: "ქართული",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇬🇪", // Georgia
  },
  {
    languageId: 31,
    symbol: "de",
    language: "German",
    nativeName: "Deutsche",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇩🇪", // Germany
  },
  {
    languageId: 32,
    symbol: "el",
    language: "Greek",
    nativeName: "Ελληνικά",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇬🇷", // Greece
  },
  {
    languageId: 33,
    symbol: "gu",
    language: "Gujarati",
    nativeName: "ગુજરાતી",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 34,
    symbol: "ht",
    language: "Haitian Creole",
    nativeName: "Kreyòl Ayisyen",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇭🇹", // Haiti
  },
  {
    languageId: 35,
    symbol: "ha",
    language: "Hausa",
    nativeName: "Hausa",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇳🇬", // Nigeria
  },
  {
    languageId: 36,
    symbol: "haw",
    language: "Hawaiian",
    nativeName: "Ōlelo Hawaiʻi",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇺🇸", // United States (Hawaii)
  },
  {
    languageId: 37,
    symbol: "iw",
    language: "Hebrew",
    nativeName: "עברית",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇮🇱", // Israel
  },
  {
    languageId: 38,
    symbol: "hi",
    language: "Hindi",
    nativeName: "हिंदी",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: false,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 39,
    symbol: "hmn",
    language: "Hmong",
    nativeName: "Hmoob",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇱🇦", // Laos (Hmong diaspora)
  },
  {
    languageId: 40,
    symbol: "hu",
    language: "Hungarian",
    nativeName: "Magyar",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: false,
    countryFlag: "🇭🇺", // Hungary
  },
  {
    languageId: 41,
    symbol: "is",
    language: "Icelandic",
    nativeName: "Íslensku",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇸", // Iceland
  },
  {
    languageId: 42,
    symbol: "ig",
    language: "Igbo",
    nativeName: "Igbo",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇳🇬", // Nigeria
  },
  {
    languageId: 43,
    symbol: "id",
    language: "Indonesian",
    nativeName: "bahasa Indonesia",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇮🇩", // Indonesia
  },
  {
    languageId: 44,
    symbol: "ga",
    language: "Irish",
    nativeName: "Gaeilge",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇪", // Ireland
  },
  {
    languageId: 45,
    symbol: "it",
    language: "Italian",
    nativeName: "italiano",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇮🇹", // Italy
  },
  {
    languageId: 46,
    symbol: "ja",
    language: "Japanese",
    nativeName: "日本語",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇯🇵", // Japan
  },
  {
    languageId: 47,
    symbol: "jw",
    language: "Javanese",
    nativeName: "Wong Jawa",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇩", // Indonesia
  },
  {
    languageId: 48,
    symbol: "kn",
    language: "Kannada",
    nativeName: "ಕನ್ನಡ",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 49,
    symbol: "kk",
    language: "Kazakh",
    nativeName: "Қазақша",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇰🇿", // Kazakhstan
  },
  {
    languageId: 50,
    symbol: "km",
    language: "Khmer",
    nativeName: "ភាសាខ្មែរ",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇰🇭", // Cambodia
  },
  {
    languageId: 51,
    symbol: "ko",
    language: "Korean",
    nativeName: "한국어",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇰🇷", // South Korea
  },
  {
    languageId: 52,
    symbol: "ku",
    language: "Kurdish",
    nativeName: "Kurmanji",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇶", // Iraq (Kurdish region)
  },
  {
    languageId: 53,
    symbol: "ky",
    language: "Kyrgyz",
    nativeName: "Кыргызча",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇰🇬", // Kyrgyzstan
  },
  {
    languageId: 54,
    symbol: "lo",
    language: "Lao",
    nativeName: "ລາວ",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇱🇦", // Laos
  },
  {
    languageId: 55,
    symbol: "la",
    language: "Latin",
    nativeName: "Latine",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇻🇦", // Vatican City (as a historical/symbolic representation)
  },
  {
    languageId: 56,
    symbol: "lv",
    language: "Latvian",
    nativeName: "Latviešu valoda",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇱🇻", // Latvia
  },
  {
    languageId: 57,
    symbol: "lt",
    language: "Lithuanian",
    nativeName: "Lietuvių",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇱🇹", // Lithuania
  },
  {
    languageId: 58,
    symbol: "lb",
    language: "Luxembourgish",
    nativeName: "Lëtzebuergesch",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇱🇺", // Luxembourg
  },
  {
    languageId: 59,
    symbol: "mk",
    language: "Macedonian",
    nativeName: "Македонски",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇲🇰", // North Macedonia
  },
  {
    languageId: 60,
    symbol: "mg",
    language: "Malagasy",
    nativeName: "Malagasy",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇲🇬", // Madagascar
  },
  {
    languageId: 61,
    symbol: "ms",
    language: "Malay",
    nativeName: "Melayu",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇲🇾", // Malaysia
  },
  {
    languageId: 62,
    symbol: "ml",
    language: "Malayalam",
    nativeName: "മലയാളം",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 63,
    symbol: "mt",
    language: "Maltese",
    nativeName: "Malti",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇲🇹", // Malta
  },
  {
    languageId: 64,
    symbol: "mi",
    language: "Maori",
    nativeName: "Maori",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇳🇿", // New Zealand
  },
  {
    languageId: 65,
    symbol: "mr",
    language: "Marathi",
    nativeName: "मराठी",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 66,
    symbol: "mn",
    language: "Mongolian",
    nativeName: "Монгол хэл",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇲🇳", // Mongolia
  },
  {
    languageId: 67,
    symbol: "my",
    language: "Myanmar",
    nativeName: "မြန်မာ (ဗမာ)",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇲🇲", // Myanmar
  },
  {
    languageId: 68,
    symbol: "ne",
    language: "Nepali",
    nativeName: "नेपाली",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇳🇵", // Nepal
  },
  {
    languageId: 69,
    symbol: "no",
    language: "Norwegian",
    nativeName: "norsk",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇳🇴", // Norway
  },
  {
    languageId: 70,
    symbol: "ps",
    language: "Pashto",
    nativeName: "پښتو",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇦🇫", // Afghanistan
  },
  {
    languageId: 71,
    symbol: "fa",
    language: "Persian",
    nativeName: "فارسی",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇷", // Iran
  },
  {
    languageId: 72,
    symbol: "pl",
    language: "Polish",
    nativeName: "Polskie",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇵🇱", // Poland
  },
  {
    languageId: 73,
    symbol: "pt",
    language: "Portuguese",
    nativeName: "Português",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇵🇹", // Portugal
  },
  {
    languageId: 75,
    symbol: "ro",
    language: "Romanian",
    nativeName: "Română",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇷🇴", // Romania
  },
  {
    languageId: 76,
    symbol: "ru",
    language: "Russian",
    nativeName: "русский",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇷🇺", // Russia
  },
  {
    languageId: 77,
    symbol: "sm",
    language: "Samoan",
    nativeName: "Samoa",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇼🇸", // Samoa
  },
  {
    languageId: 78,
    symbol: "gd",
    language: "Scots Gaelic",
    nativeName: "Gàidhlig na h-Alba",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇬🇧", // United Kingdom (Scotland)
  },
  {
    languageId: 79,
    symbol: "sr",
    language: "Serbian",
    nativeName: "Српски",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇷🇸", // Serbia
  },
  {
    languageId: 80,
    symbol: "st",
    language: "Sesotho",
    nativeName: "Sesotho",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇱🇸", // Lesotho
  },
  {
    languageId: 81,
    symbol: "sn",
    language: "Shona",
    nativeName: "Shona",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇿🇼", // Zimbabwe
  },
  {
    languageId: 82,
    symbol: "sd",
    language: "Sindhi",
    nativeName: "سنڌي",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇵🇰", // Pakistan
  },
  {
    languageId: 83,
    symbol: "si",
    language: "Sinhala",
    nativeName: "සිංහල",
    highPaying: false,
    simpleText: true,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇱🇰", // Sri Lanka
  },
  {
    languageId: 84,
    symbol: "sk",
    language: "Slovak",
    nativeName: "slovenský",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇸🇰", // Slovakia
  },
  {
    languageId: 85,
    symbol: "sl",
    language: "Slovenian",
    nativeName: "Slovenščina",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇸🇮", // Slovenia
  },
  {
    languageId: 86,
    symbol: "so",
    language: "Somali",
    nativeName: "Somali",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇸🇴", // Somalia
  },
  {
    languageId: 87,
    symbol: "es",
    language: "Spanish",
    nativeName: "Español",
    highPaying: true,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇪🇸", // Spain
  },
  {
    languageId: 88,
    symbol: "su",
    language: "Sundanese",
    nativeName: "Sunda",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇩", // Indonesia
  },
  {
    languageId: 89,
    symbol: "sw",
    language: "Swahili",
    nativeName: "Kiswahili",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇹🇿", // Tanzania
  },
  {
    languageId: 90,
    symbol: "sv",
    language: "Swedish",
    nativeName: "svenska",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇸🇪", // Sweden
  },
  {
    languageId: 91,
    symbol: "tg",
    language: "Tajik",
    nativeName: "Тоҷикӣ",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇹🇯", // Tajikistan
  },
  {
    languageId: 92,
    symbol: "ta",
    language: "Tamil",
    nativeName: "தமிழ்",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 93,
    symbol: "te",
    language: "Telugu",
    nativeName: "తెలుగు",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇮🇳", // India
  },
  {
    languageId: 94,
    symbol: "th",
    language: "Thai",
    nativeName: "ไทย",
    highPaying: false,
    simpleText: true,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇹🇭", // Thailand
  },
  {
    languageId: 95,
    symbol: "tr",
    language: "Turkish",
    nativeName: "Türk",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇹🇷", // Turkey
  },
  {
    languageId: 96,
    symbol: "uk",
    language: "Ukrainian",
    nativeName: "Українська",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇺🇦", // Ukraine
  },
  {
    languageId: 97,
    symbol: "ur",
    language: "Urdu",
    nativeName: "اردو",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: true,
    countryFlag: "🇵🇰", // Pakistan
  },
  {
    languageId: 98,
    symbol: "uz",
    language: "Uzbek",
    nativeName: "O'zbek",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇺🇿", // Uzbekistan
  },
  {
    languageId: 99,
    symbol: "vi",
    language: "Vietnamese",
    nativeName: "Tiếng Việt",
    highPaying: false,
    simpleText: false,
    adMobSupported: true,
    adSenseSupported: true,
    countryFlag: "🇻🇳", // Vietnam
  },
  {
    languageId: 100,
    symbol: "cy",
    language: "Welsh",
    nativeName: "Cymraeg",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇬🇧", // United Kingdom (Wales)
  },
  {
    languageId: 101,
    symbol: "xh",
    language: "Xhosa",
    nativeName: "isiXhosa",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇿🇦", // South Africa
  },
  {
    languageId: 102,
    symbol: "yi",
    language: "Yiddish",
    nativeName: "ייִדיש",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇮🇱", // Israel (symbolic, given its history)
  },
  {
    languageId: 103,
    symbol: "yo",
    language: "Yoruba",
    nativeName: "Yorùbá",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇳🇬", // Nigeria
  },
  {
    languageId: 104,
    symbol: "zu",
    language: "Zulu",
    nativeName: "Zulu",
    highPaying: false,
    simpleText: false,
    adMobSupported: false,
    adSenseSupported: false,
    countryFlag: "🇿🇦", // South Africa
  },
];

const BACKEND_URL = "http://localhost:8008";
const hostname = "https://cdk-blogs.vercel.app";

async function getAllBlogsSlug(locale) {
  if (!BACKEND_URL) {
    console.error("Error: BACKEND_URL is not set.");
    return [];
  }

  const apiUrl = `${BACKEND_URL}/all-blogs-slug`;
  const params = {
    lang: locale,
    cache: true,
    refreshCache: false,
  };

  try {
    const response = await axios.get(apiUrl, { params });
    return response.data.data || [];
  } catch (error) {
    if (error.response) {
      console.error(
        `HTTP error for locale '${locale}': ${error.response.status} - ${
          error.response.data?.message || error.message
        }`
      );
    } else if (error.request) {
      console.error(`No response for locale '${locale}': ${error.message}`);
    } else {
      console.error(
        `Request setup error for locale '${locale}': ${error.message}`
      );
    }
    return [];
  }
}

const completeSlug = (slug, lang) => {
  if (lang === "en") {
    return `${hostname}/blogs/${slug}`;
  }

  return `${hostname}/${lang}/blogs/${slug}`;
};

(async () => {
  console.log("Starting to fetch blog slugs for all supported languages...");
  const allBlogsFilename = path.join(__dirname, "../data/", "all_blogs_slug.json");

  let allBlogsData = [];

  for (const lang of LANGUAGES) {
    console.log(`Fetching blogs for language: ${lang.symbol}`);
    const slugs = await getAllBlogsSlug(lang.symbol);
    allBlogsData = [...allBlogsData, ...slugs];
  }

  allBlogsData = allBlogsData.map((item) => ({
    slug: completeSlug(item.slug, item.lang),
    lang: item.lang,
  }));

  console.log("allBlogsData ", allBlogsData);

  try {
    await fs.writeFile(allBlogsFilename, JSON.stringify(allBlogsData, null, 2));
    console.log(`✅ Successfully saved all blog slugs to ${allBlogsFilename}`);
  } catch (err) {
    console.error(`❌ Error writing to file: ${err.message}`);
  }
})();
