export function pageSizeEdged(pageSize: number, list?: any[]) {
  return list && list.length ? Math.ceil(list.length / pageSize) * pageSize : pageSize;
}
