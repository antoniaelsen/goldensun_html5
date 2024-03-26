import {GoldenSun} from "./base/GoldenSun";
import {FieldAbilities} from "./base/field_abilities/FieldAbilities";

var golden_sun = new GoldenSun();

(window as any).GoldenSun = golden_sun;
(window as any).GoldenSun.FieldAbilities = FieldAbilities;
