export const faNumber = (value: number | string) =>
  String(value).replace(/\d/g, (n) => '۰۱۲۳۴۵۶۷۸۹'[Number(n)]);

export const normalize = (value: string) =>
  value
    .replace(/[۰-۹]/g, (n) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n)))
    .replace(/[٠-٩]/g, (n) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(n)))
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')
    .trim()
    .toLowerCase();
