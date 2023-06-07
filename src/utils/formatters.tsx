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

export function getGarmentCategory(productName: string) {
  const formatted = productName.toLowerCase();
  const nameArray = formatted.split(" ");
  if (nameArray.includes("jacket")) {
    return "jacket";
  } else if (nameArray.includes("shacket")) {
    return "jacket";
  } else if (nameArray.includes("parka")) {
    return "parka";
  } else if (nameArray.includes("gilet")) {
    return "gilet";
  } else if (nameArray.includes("coat")) {
    return "coat";
  } else if (nameArray.includes("vest")) {
    return "vest";
  } else if (nameArray.includes("sweater")) {
    return "sweater";
  } else if (nameArray.includes("shirt")) {
    return "shirt";
  } else if (nameArray.includes("t-shirt")) {
    return "t-shirt";
  } else if (nameArray.includes("tee")) {
    return "t-shirt";
  } else if (nameArray.includes("top")) {
    return "shirt";
  } else if (nameArray.includes("romper")) {
    return "shirt";
  } else if (nameArray.includes("t-shirt")) {
    return "t-shirt";
  } else if (nameArray.includes("tank")) {
    return "t-shirt";
  } else if (nameArray.includes("crop")) {
    return "bra";
  } else if (nameArray.includes("bra")) {
    return "bra";
  } else if (nameArray.includes("dress")) {
    return "dress";
  } else {
    return "n/a"
  }
}

export function tsvJSON(tsv: string) {
  const lines = tsv.split("\n");
  const result = [];
  const headers = lines[0].split("\t");

  for (let i = 1; i < lines.length; i++) {
    const obj: any = {};
    const currentline = lines[i].split("\t");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}