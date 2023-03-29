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
