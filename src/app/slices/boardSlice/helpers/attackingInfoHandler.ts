import {
  getAttackedCells,
  initialStateI,
  processedLongRangeAttackers,
  attackingInfo,
} from "@/shared";

const attackingInfoHandler = (proxyState: initialStateI, payload: number) => {
  let attackingInfo: attackingInfo;
  const state = JSON.parse(
    JSON.stringify(proxyState)
  ) as unknown as initialStateI;
  const prevFrozenId = state.cells[payload].attacks.isFreezer.target;
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
    const { range, availableCells, frozenId, doesAttackKing, towardsKing } =
      attackingInfo;
    const cell = state.cells[payload];
    const attacks = cell.attacks;
    attacks.availableCells = [payload, ...availableCells.filter((id) => id)];
    attacks.doesAttackKing = doesAttackKing;
    const defenseColor =
      state.cells[payload].color === "black" ? "white" : "black";
    if (doesAttackKing) {
      state.check[defenseColor] = {
        is: true,
        byWhom: state.check[defenseColor].byWhom.some((id) => id === payload)
          ? state.check[defenseColor].byWhom
          : [...state.check[defenseColor].byWhom, payload],
      };
      state.cells[payload].attacks.isFreezer.pathTowardsKing = towardsKing;
    } else {
      state.check[defenseColor].byWhom = state.check[
        defenseColor
      ].byWhom.filter((id) => id !== payload);
      state.check[defenseColor].is =
        state.check[defenseColor].byWhom.length === 0 ? false : true;
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
      state.cells[payload].attacks.isFreezer = {
        is: true,
        target: frozenId,
        pathTowardsKing: towardsKing,
      };
    } else if (!doesAttackKing && !frozenId) {
      state.cells[payload].attacks.isFreezer = {
        is: false,
        target: null,
        pathTowardsKing: [],
      };
    }
    if (
      !frozenId &&
      prevFrozenId &&
      state.cells?.[prevFrozenId].attacked.isFrozen.byWhom === payload
    ) {
      state.cells[prevFrozenId].attacked.isFrozen = {
        is: false,
        byWhom: null,
      };
    }

    attacks.availableCells.forEach((attackedId) => {
      if (
        !(
          state.cells[payload].figure === "pawn" &&
          (attackedId - payload) % 8 === 0
        ) &&
        !state.cells[
          attackedId
        ].attacked.whoIsFieldUnderAttackBy.directly.includes(payload)
      ) {
        state.cells[attackedId].attacked.whoIsFieldUnderAttackBy.directly.push(
          payload
        );
      } else {
        //тут можно доделать для пешек, чтобы отображалось только то, куда они действительно могут пойти
      }
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
    if (range.length > 0) {
      attacks.range.forEach((attackedId) => {
        if (
          !state.cells[
            attackedId
          ].attacked.whoIsFieldUnderAttackBy.through.includes(payload)
        ) {
          state.cells[attackedId].attacked.whoIsFieldUnderAttackBy.through.push(
            payload
          );
        }
      });
    }
  }
  return state;
};

export default attackingInfoHandler;
