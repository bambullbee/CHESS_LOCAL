import { AppDispatch } from "@/app/store";
import { useDispatch } from "react-redux";

export const useDispatchTs = useDispatch.withTypes<AppDispatch>();
