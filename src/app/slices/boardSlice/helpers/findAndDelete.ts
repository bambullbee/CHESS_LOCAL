import { initialStateI } from "@/shared";

const findAndDelete = (
  state: initialStateI,
  array: number[],
  key: "through" | "directly",
  compareNum: number
) => {
  array.forEach((id) => {
    const index = state.cells[id].attacked.whoIsFieldUnderAttackBy[
      key
    ].findIndex((el: number) => {
      return el === compareNum;
    });
    if (index > -1) {
      state.cells[id].attacked.whoIsFieldUnderAttackBy[key].splice(index, 1);
    }
  });
};

export default findAndDelete;
