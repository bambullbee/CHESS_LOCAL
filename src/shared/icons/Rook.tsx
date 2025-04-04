import { figureIconColors } from "../types/chessTypes";

const Rook = ({
  firstColor,
  secondColor,
  thirdColor,
  borderColor,
}: figureIconColors) => {
  return (
    <svg
      height="100%"
      viewBox="0 0 8 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 11.1H7C7.49706 11.1 7.9 11.5029 7.9 12V14C7.9 14.4971 7.49706 14.9 7 14.9H1C0.502944 14.9 0.1 14.4971 0.1 14V12C0.1 11.5029 0.502943 11.1 1 11.1Z"
        fill={secondColor}
        stroke={borderColor}
        strokeWidth="3%"
      />
      <path
        d="M4.9 1V3C4.9 3.49706 4.49706 3.9 4 3.9C3.50294 3.9 3.1 3.49706 3.1 3V1C3.1 0.502944 3.50294 0.1 4 0.1C4.49706 0.1 4.9 0.502944 4.9 1Z"
        fill={secondColor}
        stroke={borderColor}
        strokeWidth="3%"
      />
      <path
        d="M1.9 2V6C1.9 6.49706 1.49706 6.9 1 6.9C0.502944 6.9 0.1 6.49706 0.1 6V2C0.1 1.50294 0.502944 1.1 1 1.1C1.49706 1.1 1.9 1.50294 1.9 2Z"
        fill={secondColor}
        stroke={borderColor}
        strokeWidth="3%"
      />
      <path
        d="M1 3C1.55228 3 2 2.55228 2 2C2 1.44771 1.55228 1 1 1C0.447715 1 0 1.44771 0 2C0 2.55228 0.447715 3 1 3Z"
        fill={borderColor}
      />
      <path
        d="M7.9 2V6C7.9 6.49706 7.49706 6.9 7 6.9C6.50294 6.9 6.1 6.49706 6.1 6V2C6.1 1.50294 6.50294 1.1 7 1.1C7.49706 1.1 7.9 1.50294 7.9 2Z"
        fill={secondColor}
        stroke={borderColor}
        strokeWidth="3%"
      />
      <path
        d="M7 3C7.55228 3 8 2.55228 8 2C8 1.44771 7.55228 1 7 1C6.44771 1 6 1.44771 6 2C6 2.55228 6.44771 3 7 3Z"
        fill={borderColor}
      />
      <path
        d="M7.9 7V10C7.9 12.1539 6.15391 13.9 4 13.9C1.84609 13.9 0.1 12.1539 0.1 10V7C0.1 4.84609 1.84609 3.1 4 3.1C6.15391 3.1 7.9 4.84609 7.9 7Z"
        fill={firstColor}
        stroke={borderColor}
        strokeWidth="3%"
      />
      <path
        d="M5.33333 11H2.66667C2.29848 11 2 11.056 2 11.125V11.875C2 11.944 2.29848 12 2.66667 12H5.33333C5.70152 12 6 11.944 6 11.875V11.125C6 11.056 5.70152 11 5.33333 11Z"
        fill={secondColor}
      />
      <path
        d="M5.33333 5H2.66667C2.29848 5 2 5.05596 2 5.125V5.875C2 5.94404 2.29848 6 2.66667 6H5.33333C5.70152 6 6 5.94404 6 5.875V5.125C6 5.05596 5.70152 5 5.33333 5Z"
        fill={secondColor}
      />
      <path
        d="M5.33333 7H2.66667C2.29848 7 2 7.16789 2 7.375V9.625C2 9.83211 2.29848 10 2.66667 10H5.33333C5.70152 10 6 9.83211 6 9.625V7.375C6 7.16789 5.70152 7 5.33333 7Z"
        fill={secondColor}
      />
    </svg>
  );
};

export default Rook;
