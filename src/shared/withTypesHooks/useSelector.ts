import { RootState } from "@/app";
import { useSelector } from "react-redux";

const useSelectorTs = useSelector.withTypes<RootState>();

export default useSelectorTs;
