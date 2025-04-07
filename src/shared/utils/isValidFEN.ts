export function isValidFEN(fen: string): boolean {
  const FEN_PATTERN =
    /^((?:[pnbrqkPNBRQK1-8]+\/){7}(?:[pnbrqkPNBRQK1-8]+))\s([wb])\s(K?Q?k?q?|-)\s([a-h][36]|-)\s(\d+)\s(\d+)$/;

  fen = fen.trim();

  const parts = fen.split(" ");
  if (parts.length !== 6) return false;

  const [piecePlacement, activeColor, castling, enPassant, halfmove, fullmove] =
    parts;

  const ranks = piecePlacement.split("/");
  if (ranks.length !== 8) return false;

  const validPieceChars = /^[pnbrqkPNBRQK1-8]+$/;
  for (const rank of ranks) {
    if (!validPieceChars.test(rank)) return false;

    let count = 0;
    for (const char of rank) {
      if (/\d/.test(char)) {
        count += parseInt(char, 10);
      } else {
        count += 1;
      }
    }
    if (count !== 8) return false;
  }

  if (activeColor !== "w" && activeColor !== "b") return false;

  if (!/^(K?Q?k?q?|-)$/.test(castling)) return false;

  if (!/^([a-h][36]|-)$/.test(enPassant)) return false;

  if (!/^\d+$/.test(halfmove)) return false;

  if (!/^\d+$/.test(fullmove) || parseInt(fullmove, 10) < 1) return false;

  return true;
}

export default isValidFEN;
