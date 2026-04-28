import { TopPage } from "../../types";

export const sortPages = (pages: TopPage[]): TopPage[] => {
  return [...pages].sort((left, right) => right.views - left.views);
};