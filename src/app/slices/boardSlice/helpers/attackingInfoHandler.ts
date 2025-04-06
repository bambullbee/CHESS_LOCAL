import {
  getAttackedCells,
  initialStateI,
  processedLongRangeAttackers,
  attackingInfo,
} from "@/shared";

const attackingInfoHandler = (state: initialStateI, payload: number) => {
  let attackingInfo: attackingInfo;
  const payloadCell = state.cells[payload];
  const prevFrozenId = payloadCell.attacks.isFreezer.target;

  if (payloadCell.figure === "pawn") {
    attackingInfo = getAttackedCells({
      figure: "pawn",
      id: payload,
      side: payloadCell.color === "white" ? 1 : 8,
      state,
    });
  } else {
    attackingInfo = getAttackedCells({
      figure: payloadCell.figure,
      id: payload,
      side: null,
      state,
    });
  }
  if (attackingInfo) {
    const { range, availableCells, frozenId, doesAttackKing, towardsKing } =
      attackingInfo;
    const attacks = payloadCell.attacks;
    attacks.availableCells = [payload, ...availableCells.filter((id) => id)];
    attacks.doesAttackKing = doesAttackKing;
    const defenseColor = payloadCell.color === "black" ? "white" : "black";
    const defenseCheckInfo = state.check[defenseColor];
    if (doesAttackKing) {
      state.check[defenseColor] = {
        is: true,
        byWhom: defenseCheckInfo.byWhom.some((id) => id === payload)
          ? defenseCheckInfo.byWhom
          : [...defenseCheckInfo.byWhom, payload],
      };
      payloadCell.attacks.pathTowardsKing = towardsKing;
    } else {
      state.check[defenseColor].byWhom = defenseCheckInfo.byWhom.filter(
        (id) => id !== payload
      );
      defenseCheckInfo.is = defenseCheckInfo.byWhom.length === 0 ? false : true;
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
      payloadCell.attacks.isFreezer = {
        is: true,
        target: frozenId,
      };
      payloadCell.attacks.pathTowardsKing = towardsKing;
    } else if (!doesAttackKing && !frozenId) {
      payloadCell.attacks.isFreezer = {
        is: false,
        target: null,
      };
      payloadCell.attacks.pathTowardsKing = [];
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
        !(payloadCell.figure === "pawn" && (attackedId - payload) % 8 === 0) &&
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
    });
    if (range.length > 0) {
      attacks.range.forEach((attackedId) => {
        const through =
          state.cells[attackedId].attacked.whoIsFieldUnderAttackBy.through;
        if (!through.includes(Number(payload))) {
          through.push(payload);
        }
      });
    }
  }
};

export default attackingInfoHandler;
