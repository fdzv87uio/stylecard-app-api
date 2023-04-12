export function getUrlSafeString(item: string) {
  let res = item.replaceAll("/", "slash");
  res.replaceAll("+", "*");
  return res;
}

export function getUrlUnsafeString(item: string) {
  let res = item.replaceAll("slash", "/");
  res.replaceAll("*", "+");
  return res;
}

export function getFormattedSize(value: string) {
  if (value === "XS" || value === "Extra Small") {
    return "XS";
  } else if (value === "S" || value === "Small") {
    return "S";
  } else if (value === "M" || value === "Medium") {
    return "M";
  } else if (value === "L" || value === "Large") {
    return "L";
  } else if (value === "XL" || value === "X-Large") {
    return "XL";
  } else if (value === "XXL" || value === "2XL") {
    return "2XL";
  } else {
    return "n/a";
  }
}

export function getFormattedGender(value: string) {
  if (value) {
    if (value === "Unisex") {
      return "both";
    } else {
      const format = value.toLowerCase();
      return format;
    }
  } else {
    return "both";
  }
}
