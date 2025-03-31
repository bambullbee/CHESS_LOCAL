import {
  getAttackedCells,
  initialStateI,
  processedLongRangeAttackers,
} from "@/shared";

const attackingInfoHandler = (state: initialStateI, payload: number) => {
  let attackingInfo: processedLongRangeAttackers;
  if (state.cells[payload].figure === "pawn") {
    attackingInfo = getAttackedCells({
      figure: "pawn",
      id: payload,
      side: state.cells[payload].color === "white" ? 1 : 8,
      state,
    });
  } else {
    attackingInfo = getAttackedCells({
      figure: state.cells[payload].figure,
      id: payload,
      side: null,
      state,
    });
  }
  if (attackingInfo) {
    const { range, availableCells, frozenId, doesAttackKing } = attackingInfo;
    const cell = state.cells[payload];
    const attacks = cell.attacks;
    attacks.availableCells = availableCells.filter((id) => id);
    attacks.doesAttackKing = doesAttackKing;
    if (doesAttackKing) {
      const defenseColor =
        state.cells[payload].color === "black" ? "white" : "black";
      state.check[defenseColor] = {
        is: true,
        byWhom: [...state.check[defenseColor].byWhom, payload],
      };
    }

    if (range) {
      attacks.range = range;
    } else {
      attacks.range = [];
    }

    if (frozenId) {
      state.cells[frozenId].attacked.isFrozen = {
        is: true,
        byWhom: payload,
      };
    }

    attacks.availableCells.forEach((attackedId) => {
      state.cells[attackedId].attacked.whoIsFieldUnderAttackBy.directly.push(
        payload
      );
      if (
        !state.cells[
          attackedId
        ].attacked.whoIsFieldUnderAttackBy.attackerColor.includes(
          state.cells[payload].color
        )
      ) {
        state.cells[
          attackedId
        ].attacked.whoIsFieldUnderAttackBy.attackerColor.push(
          state.cells[payload].color
        );
      }
    });
  }
};

export default attackingInfoHandler;
