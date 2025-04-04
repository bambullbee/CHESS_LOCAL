type FigureType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type FigureColor = "black" | "white" | null;
interface figureIconColors {
  [key: string]: string;
}

export type { FigureColor, FigureType, figureIconColors };
