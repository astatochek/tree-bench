export type Context = {
  port: number;
  title: string;
  results: number[];
  dir: string;
};

export const sut: Context[] = [
  { title: "Angular Signals", dir: "angular-signals", port: 3000, results: [] },
  { title: "Angular Pure Pull", dir: "angular-pull", port: 3001, results: [] },
  { title: "Angular Pure Push", dir: "angular-push", port: 3002, results: [] },
];
