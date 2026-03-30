/*
  Application Constants
  Created: 2026-03-30
*/

// Set IS_B2B to 1 for wholesale mode
// Set IS_B2C to 1 for retail mode
export const IS_B2B = 0;
export const IS_B2C = true;

// Scalable Theme System
export const THEME_VERSIONS = {
    PRO: 'fgstore.pro',
    BETA: 'fgstore.pro.beta',
    V1: 'fgstore.pro.v1',
};

// Current active theme configuration
export const ACTIVE_THEME = THEME_VERSIONS.BETA;

export const currentActiveFlow = IS_B2C;
export const ActiveMode = ACTIVE_THEME === THEME_VERSIONS.BETA; 
