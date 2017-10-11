/*
 *  Copyright (C) 2017 Atelier Cartographique <contact@atelier-cartographique.be>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, version 3 of the License.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { KeyboardEvent } from 'react';
import { fromPredicate } from 'fp-ts/lib/Option';


export const isKeyCode =
    (kc: KeyCode) => (event: KeyboardEvent<Element>) => {
        return kc === event.which || kc === event.keyCode;
    };

export const hasKeyCode =
    (kcs: KeyCode[]) => (event: KeyboardEvent<Element>) => {
        return kcs.some(kc => (
            kc === event.which || kc === event.keyCode
        ));
    };

export enum KeyCode {
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    SHIFT = 16,
    CTRL = 17,
    ALT = 18,
    PAUSE = 19,
    CAPS_LOCK = 20,
    ESCAPE = 27,
    SPACE = 32,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40,
    INSERT = 45,
    DELETE = 46,
    KEY_0 = 48,
    KEY_1 = 49,
    KEY_2 = 50,
    KEY_3 = 51,
    KEY_4 = 52,
    KEY_5 = 53,
    KEY_6 = 54,
    KEY_7 = 55,
    KEY_8 = 56,
    KEY_9 = 57,
    KEY_A = 65,
    KEY_B = 66,
    KEY_C = 67,
    KEY_D = 68,
    KEY_E = 69,
    KEY_F = 70,
    KEY_G = 71,
    KEY_H = 72,
    KEY_I = 73,
    KEY_J = 74,
    KEY_K = 75,
    KEY_L = 76,
    KEY_M = 77,
    KEY_N = 78,
    KEY_O = 79,
    KEY_P = 80,
    KEY_Q = 81,
    KEY_R = 82,
    KEY_S = 83,
    KEY_T = 84,
    KEY_U = 85,
    KEY_V = 86,
    KEY_W = 87,
    KEY_X = 88,
    KEY_Y = 89,
    KEY_Z = 90,
    LEFT_META = 91,
    RIGHT_META = 92,
    SELECT = 93,
    NUMPAD_0 = 96,
    NUMPAD_1 = 97,
    NUMPAD_2 = 98,
    NUMPAD_3 = 99,
    NUMPAD_4 = 100,
    NUMPAD_5 = 101,
    NUMPAD_6 = 102,
    NUMPAD_7 = 103,
    NUMPAD_8 = 104,
    NUMPAD_9 = 105,
    MULTIPLY = 106,
    ADD = 107,
    SUBTRACT = 109,
    DECIMAL = 110,
    DIVIDE = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    NUM_LOCK = 144,
    SCROLL_LOCK = 145,
    SEMICOLON = 186,
    EQUALS = 187,
    COMMA = 188,
    DASH = 189,
    PERIOD = 190,
    FORWARD_SLASH = 191,
    GRAVE_ACCENT = 192,
    OPEN_BRACKET = 219,
    BACK_SLASH = 220,
    CLOSE_BRACKET = 221,
    SINGLE_QUOTE = 222,
}

export const isBACKSPACE = isKeyCode(KeyCode.BACKSPACE);
export const isTAB = isKeyCode(KeyCode.TAB);
export const isENTER = isKeyCode(KeyCode.ENTER);
export const isSHIFT = isKeyCode(KeyCode.SHIFT);
export const isCTRL = isKeyCode(KeyCode.CTRL);
export const isALT = isKeyCode(KeyCode.ALT);
export const isPAUSE = isKeyCode(KeyCode.PAUSE);
export const isCAPS_LOCK = isKeyCode(KeyCode.CAPS_LOCK);
export const isESCAPE = isKeyCode(KeyCode.ESCAPE);
export const isSPACE = isKeyCode(KeyCode.SPACE);
export const isPAGE_UP = isKeyCode(KeyCode.PAGE_UP);
export const isPAGE_DOWN = isKeyCode(KeyCode.PAGE_DOWN);
export const isEND = isKeyCode(KeyCode.END);
export const isHOME = isKeyCode(KeyCode.HOME);
export const isLEFT_ARROW = isKeyCode(KeyCode.LEFT_ARROW);
export const isUP_ARROW = isKeyCode(KeyCode.UP_ARROW);
export const isRIGHT_ARROW = isKeyCode(KeyCode.RIGHT_ARROW);
export const isDOWN_ARROW = isKeyCode(KeyCode.DOWN_ARROW);
export const isINSERT = isKeyCode(KeyCode.INSERT);
export const isDELETE = isKeyCode(KeyCode.DELETE);
export const isKEY_0 = isKeyCode(KeyCode.KEY_0);
export const isKEY_1 = isKeyCode(KeyCode.KEY_1);
export const isKEY_2 = isKeyCode(KeyCode.KEY_2);
export const isKEY_3 = isKeyCode(KeyCode.KEY_3);
export const isKEY_4 = isKeyCode(KeyCode.KEY_4);
export const isKEY_5 = isKeyCode(KeyCode.KEY_5);
export const isKEY_6 = isKeyCode(KeyCode.KEY_6);
export const isKEY_7 = isKeyCode(KeyCode.KEY_7);
export const isKEY_8 = isKeyCode(KeyCode.KEY_8);
export const isKEY_9 = isKeyCode(KeyCode.KEY_9);
export const isKEY_A = isKeyCode(KeyCode.KEY_A);
export const isKEY_B = isKeyCode(KeyCode.KEY_B);
export const isKEY_C = isKeyCode(KeyCode.KEY_C);
export const isKEY_D = isKeyCode(KeyCode.KEY_D);
export const isKEY_E = isKeyCode(KeyCode.KEY_E);
export const isKEY_F = isKeyCode(KeyCode.KEY_F);
export const isKEY_G = isKeyCode(KeyCode.KEY_G);
export const isKEY_H = isKeyCode(KeyCode.KEY_H);
export const isKEY_I = isKeyCode(KeyCode.KEY_I);
export const isKEY_J = isKeyCode(KeyCode.KEY_J);
export const isKEY_K = isKeyCode(KeyCode.KEY_K);
export const isKEY_L = isKeyCode(KeyCode.KEY_L);
export const isKEY_M = isKeyCode(KeyCode.KEY_M);
export const isKEY_N = isKeyCode(KeyCode.KEY_N);
export const isKEY_O = isKeyCode(KeyCode.KEY_O);
export const isKEY_P = isKeyCode(KeyCode.KEY_P);
export const isKEY_Q = isKeyCode(KeyCode.KEY_Q);
export const isKEY_R = isKeyCode(KeyCode.KEY_R);
export const isKEY_S = isKeyCode(KeyCode.KEY_S);
export const isKEY_T = isKeyCode(KeyCode.KEY_T);
export const isKEY_U = isKeyCode(KeyCode.KEY_U);
export const isKEY_V = isKeyCode(KeyCode.KEY_V);
export const isKEY_W = isKeyCode(KeyCode.KEY_W);
export const isKEY_X = isKeyCode(KeyCode.KEY_X);
export const isKEY_Y = isKeyCode(KeyCode.KEY_Y);
export const isKEY_Z = isKeyCode(KeyCode.KEY_Z);
export const isLEFT_META = isKeyCode(KeyCode.LEFT_META);
export const isRIGHT_META = isKeyCode(KeyCode.RIGHT_META);
export const isSELECT = isKeyCode(KeyCode.SELECT);
export const isNUMPAD_0 = isKeyCode(KeyCode.NUMPAD_0);
export const isNUMPAD_1 = isKeyCode(KeyCode.NUMPAD_1);
export const isNUMPAD_2 = isKeyCode(KeyCode.NUMPAD_2);
export const isNUMPAD_3 = isKeyCode(KeyCode.NUMPAD_3);
export const isNUMPAD_4 = isKeyCode(KeyCode.NUMPAD_4);
export const isNUMPAD_5 = isKeyCode(KeyCode.NUMPAD_5);
export const isNUMPAD_6 = isKeyCode(KeyCode.NUMPAD_6);
export const isNUMPAD_7 = isKeyCode(KeyCode.NUMPAD_7);
export const isNUMPAD_8 = isKeyCode(KeyCode.NUMPAD_8);
export const isNUMPAD_9 = isKeyCode(KeyCode.NUMPAD_9);
export const isMULTIPLY = isKeyCode(KeyCode.MULTIPLY);
export const isADD = isKeyCode(KeyCode.ADD);
export const isSUBTRACT = isKeyCode(KeyCode.SUBTRACT);
export const isDECIMAL = isKeyCode(KeyCode.DECIMAL);
export const isDIVIDE = isKeyCode(KeyCode.DIVIDE);
export const isF1 = isKeyCode(KeyCode.F1);
export const isF2 = isKeyCode(KeyCode.F2);
export const isF3 = isKeyCode(KeyCode.F3);
export const isF4 = isKeyCode(KeyCode.F4);
export const isF5 = isKeyCode(KeyCode.F5);
export const isF6 = isKeyCode(KeyCode.F6);
export const isF7 = isKeyCode(KeyCode.F7);
export const isF8 = isKeyCode(KeyCode.F8);
export const isF9 = isKeyCode(KeyCode.F9);
export const isF10 = isKeyCode(KeyCode.F10);
export const isF11 = isKeyCode(KeyCode.F11);
export const isF12 = isKeyCode(KeyCode.F12);
export const isNUM_LOCK = isKeyCode(KeyCode.NUM_LOCK);
export const isSCROLL_LOCK = isKeyCode(KeyCode.SCROLL_LOCK);
export const isSEMICOLON = isKeyCode(KeyCode.SEMICOLON);
export const isEQUALS = isKeyCode(KeyCode.EQUALS);
export const isCOMMA = isKeyCode(KeyCode.COMMA);
export const isDASH = isKeyCode(KeyCode.DASH);
export const isPERIOD = isKeyCode(KeyCode.PERIOD);
export const isFORWARD_SLASH = isKeyCode(KeyCode.FORWARD_SLASH);
export const isGRAVE_ACCENT = isKeyCode(KeyCode.GRAVE_ACCENT);
export const isOPEN_BRACKET = isKeyCode(KeyCode.OPEN_BRACKET);
export const isBACK_SLASH = isKeyCode(KeyCode.BACK_SLASH);
export const isCLOSE_BRACKET = isKeyCode(KeyCode.CLOSE_BRACKET);
export const isSINGLE_QUOTE = isKeyCode(KeyCode.SINGLE_QUOTE);

export const optBACKSPACE = fromPredicate(isKeyCode(KeyCode.BACKSPACE));
export const optTAB = fromPredicate(isKeyCode(KeyCode.TAB));
export const optENTER = fromPredicate(isKeyCode(KeyCode.ENTER));
export const optSHIFT = fromPredicate(isKeyCode(KeyCode.SHIFT));
export const optCTRL = fromPredicate(isKeyCode(KeyCode.CTRL));
export const optALT = fromPredicate(isKeyCode(KeyCode.ALT));
export const optPAUSE = fromPredicate(isKeyCode(KeyCode.PAUSE));
export const optCAPS_LOCK = fromPredicate(isKeyCode(KeyCode.CAPS_LOCK));
export const optESCAPE = fromPredicate(isKeyCode(KeyCode.ESCAPE));
export const optSPACE = fromPredicate(isKeyCode(KeyCode.SPACE));
export const optPAGE_UP = fromPredicate(isKeyCode(KeyCode.PAGE_UP));
export const optPAGE_DOWN = fromPredicate(isKeyCode(KeyCode.PAGE_DOWN));
export const optEND = fromPredicate(isKeyCode(KeyCode.END));
export const optHOME = fromPredicate(isKeyCode(KeyCode.HOME));
export const optLEFT_ARROW = fromPredicate(isKeyCode(KeyCode.LEFT_ARROW));
export const optUP_ARROW = fromPredicate(isKeyCode(KeyCode.UP_ARROW));
export const optRIGHT_ARROW = fromPredicate(isKeyCode(KeyCode.RIGHT_ARROW));
export const optDOWN_ARROW = fromPredicate(isKeyCode(KeyCode.DOWN_ARROW));
export const optINSERT = fromPredicate(isKeyCode(KeyCode.INSERT));
export const optDELETE = fromPredicate(isKeyCode(KeyCode.DELETE));
export const optKEY_0 = fromPredicate(isKeyCode(KeyCode.KEY_0));
export const optKEY_1 = fromPredicate(isKeyCode(KeyCode.KEY_1));
export const optKEY_2 = fromPredicate(isKeyCode(KeyCode.KEY_2));
export const optKEY_3 = fromPredicate(isKeyCode(KeyCode.KEY_3));
export const optKEY_4 = fromPredicate(isKeyCode(KeyCode.KEY_4));
export const optKEY_5 = fromPredicate(isKeyCode(KeyCode.KEY_5));
export const optKEY_6 = fromPredicate(isKeyCode(KeyCode.KEY_6));
export const optKEY_7 = fromPredicate(isKeyCode(KeyCode.KEY_7));
export const optKEY_8 = fromPredicate(isKeyCode(KeyCode.KEY_8));
export const optKEY_9 = fromPredicate(isKeyCode(KeyCode.KEY_9));
export const optKEY_A = fromPredicate(isKeyCode(KeyCode.KEY_A));
export const optKEY_B = fromPredicate(isKeyCode(KeyCode.KEY_B));
export const optKEY_C = fromPredicate(isKeyCode(KeyCode.KEY_C));
export const optKEY_D = fromPredicate(isKeyCode(KeyCode.KEY_D));
export const optKEY_E = fromPredicate(isKeyCode(KeyCode.KEY_E));
export const optKEY_F = fromPredicate(isKeyCode(KeyCode.KEY_F));
export const optKEY_G = fromPredicate(isKeyCode(KeyCode.KEY_G));
export const optKEY_H = fromPredicate(isKeyCode(KeyCode.KEY_H));
export const optKEY_I = fromPredicate(isKeyCode(KeyCode.KEY_I));
export const optKEY_J = fromPredicate(isKeyCode(KeyCode.KEY_J));
export const optKEY_K = fromPredicate(isKeyCode(KeyCode.KEY_K));
export const optKEY_L = fromPredicate(isKeyCode(KeyCode.KEY_L));
export const optKEY_M = fromPredicate(isKeyCode(KeyCode.KEY_M));
export const optKEY_N = fromPredicate(isKeyCode(KeyCode.KEY_N));
export const optKEY_O = fromPredicate(isKeyCode(KeyCode.KEY_O));
export const optKEY_P = fromPredicate(isKeyCode(KeyCode.KEY_P));
export const optKEY_Q = fromPredicate(isKeyCode(KeyCode.KEY_Q));
export const optKEY_R = fromPredicate(isKeyCode(KeyCode.KEY_R));
export const optKEY_S = fromPredicate(isKeyCode(KeyCode.KEY_S));
export const optKEY_T = fromPredicate(isKeyCode(KeyCode.KEY_T));
export const optKEY_U = fromPredicate(isKeyCode(KeyCode.KEY_U));
export const optKEY_V = fromPredicate(isKeyCode(KeyCode.KEY_V));
export const optKEY_W = fromPredicate(isKeyCode(KeyCode.KEY_W));
export const optKEY_X = fromPredicate(isKeyCode(KeyCode.KEY_X));
export const optKEY_Y = fromPredicate(isKeyCode(KeyCode.KEY_Y));
export const optKEY_Z = fromPredicate(isKeyCode(KeyCode.KEY_Z));
export const optLEFT_META = fromPredicate(isKeyCode(KeyCode.LEFT_META));
export const optRIGHT_META = fromPredicate(isKeyCode(KeyCode.RIGHT_META));
export const optSELECT = fromPredicate(isKeyCode(KeyCode.SELECT));
export const optNUMPAD_0 = fromPredicate(isKeyCode(KeyCode.NUMPAD_0));
export const optNUMPAD_1 = fromPredicate(isKeyCode(KeyCode.NUMPAD_1));
export const optNUMPAD_2 = fromPredicate(isKeyCode(KeyCode.NUMPAD_2));
export const optNUMPAD_3 = fromPredicate(isKeyCode(KeyCode.NUMPAD_3));
export const optNUMPAD_4 = fromPredicate(isKeyCode(KeyCode.NUMPAD_4));
export const optNUMPAD_5 = fromPredicate(isKeyCode(KeyCode.NUMPAD_5));
export const optNUMPAD_6 = fromPredicate(isKeyCode(KeyCode.NUMPAD_6));
export const optNUMPAD_7 = fromPredicate(isKeyCode(KeyCode.NUMPAD_7));
export const optNUMPAD_8 = fromPredicate(isKeyCode(KeyCode.NUMPAD_8));
export const optNUMPAD_9 = fromPredicate(isKeyCode(KeyCode.NUMPAD_9));
export const optMULTIPLY = fromPredicate(isKeyCode(KeyCode.MULTIPLY));
export const optADD = fromPredicate(isKeyCode(KeyCode.ADD));
export const optSUBTRACT = fromPredicate(isKeyCode(KeyCode.SUBTRACT));
export const optDECIMAL = fromPredicate(isKeyCode(KeyCode.DECIMAL));
export const optDIVIDE = fromPredicate(isKeyCode(KeyCode.DIVIDE));
export const optF1 = fromPredicate(isKeyCode(KeyCode.F1));
export const optF2 = fromPredicate(isKeyCode(KeyCode.F2));
export const optF3 = fromPredicate(isKeyCode(KeyCode.F3));
export const optF4 = fromPredicate(isKeyCode(KeyCode.F4));
export const optF5 = fromPredicate(isKeyCode(KeyCode.F5));
export const optF6 = fromPredicate(isKeyCode(KeyCode.F6));
export const optF7 = fromPredicate(isKeyCode(KeyCode.F7));
export const optF8 = fromPredicate(isKeyCode(KeyCode.F8));
export const optF9 = fromPredicate(isKeyCode(KeyCode.F9));
export const optF10 = fromPredicate(isKeyCode(KeyCode.F10));
export const optF11 = fromPredicate(isKeyCode(KeyCode.F11));
export const optF12 = fromPredicate(isKeyCode(KeyCode.F12));
export const optNUM_LOCK = fromPredicate(isKeyCode(KeyCode.NUM_LOCK));
export const optSCROLL_LOCK = fromPredicate(isKeyCode(KeyCode.SCROLL_LOCK));
export const optSEMICOLON = fromPredicate(isKeyCode(KeyCode.SEMICOLON));
export const optEQUALS = fromPredicate(isKeyCode(KeyCode.EQUALS));
export const optCOMMA = fromPredicate(isKeyCode(KeyCode.COMMA));
export const optDASH = fromPredicate(isKeyCode(KeyCode.DASH));
export const optPERIOD = fromPredicate(isKeyCode(KeyCode.PERIOD));
export const optFORWARD_SLASH = fromPredicate(isKeyCode(KeyCode.FORWARD_SLASH));
export const optGRAVE_ACCENT = fromPredicate(isKeyCode(KeyCode.GRAVE_ACCENT));
export const optOPEN_BRACKET = fromPredicate(isKeyCode(KeyCode.OPEN_BRACKET));
export const optBACK_SLASH = fromPredicate(isKeyCode(KeyCode.BACK_SLASH));
export const optCLOSE_BRACKET = fromPredicate(isKeyCode(KeyCode.CLOSE_BRACKET));
export const optSINGLE_QUOTE = fromPredicate(isKeyCode(KeyCode.SINGLE_QUOTE));
