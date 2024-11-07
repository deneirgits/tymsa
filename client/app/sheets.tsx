import { SheetDefinition, registerSheet } from "react-native-actions-sheet";
import FlatListSheet from "@/components/CurrentTimer";

registerSheet("current-timer", FlatListSheet);

declare module "react-native-actions-sheet" {
  export interface Sheets {
    "current-timer": SheetDefinition;
  }
}

export {};
