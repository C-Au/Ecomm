import { useContext } from "react";
import { CartContext } from "./CartContextDef.js";

export function useCart() {
  return useContext(CartContext);
}
