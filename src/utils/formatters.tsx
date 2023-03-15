export function getUrlSafeString(item: string) {
  let res = item.replace("/", "slash");
  res.replace("+", "*");
  return res;
}

export function getUrlUnsafeString(item: string) {
  let res = item.replace("slash", "/");
  res.replace("*", "+");
  return res;
}
