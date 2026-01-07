export type Context = {
  port: number;
  title: string;
  results: number[];
  dir: string;
};

export const sut: Context[] = [
  { title: "Angular Signals", dir: "angular-signals", port: 3000, results: [] },
  { title: "Angular Pull", dir: "angular-pull", port: 3001, results: [] },
  { title: "Angular Push", dir: "angular-push", port: 3002, results: [] },
  { title: "React Pull", dir: "react-pull", port: 3003, results: [] },
  { title: "React Push", dir: "react-push", port: 3004, results: [] },
];
