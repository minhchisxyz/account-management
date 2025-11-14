const base = 'http://localhost:8088/app/AccountManagement/api/v1/transactions';

export type YearTotal = {
  year: number;
  total: number;
}

export async function getAllYears() {
  const years: YearTotal[] = await fetch(`${base}`).then(res => res.json());
  return years;
}
