import js from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"
import stylistic from "@stylistic/eslint-plugin"
import globals from "globals"

export default defineConfig({ignores:["node_modules/**", "dist/**", "build/**"]}, {
    files:["**/*.{js,ts}"],
    extends:[js.configs.recommended, tseslint.configs.recommended],
    languageOptions:{
        globals:{
            ...globals.node
        }
    },
    plugins:{
        "@stylistic":stylistic
    },
    rules:{
        "no-unused-vars":"off",
        "@typescript-eslint/no-unused-vars":"off",
        "@stylistic/linebreak-style":["error", "unix"],
        "@stylistic/no-trailing-spaces":"error",
        "@stylistic/eol-last":["error", "never"],
        "@stylistic/indent":["error", 4],
        "@stylistic/quotes":["error", "double"],
        "@stylistic/semi":["error", "never"],
        "@stylistic/semi-spacing":"off",
        "@stylistic/key-spacing":["error", {
            beforeColon:false,
            afterColon:false,
            mode:"strict"
        }],
        "@stylistic/object-curly-spacing":["error", "never", {
            overrides:{
                ImportDeclaration:"always"
            }
        }],
        "@stylistic/array-bracket-spacing":["error", "never"],
        "@stylistic/comma-spacing":["error", {
            before:false,
            after:true
        }],
        "@stylistic/comma-dangle":["error", "never"],
        "@stylistic/space-before-function-paren":["error", {
            anonymous:"never",
            named:"never",
            asyncArrow:"always",
            catch:"never"
        }],
        "@stylistic/space-before-blocks":["error", {
            functions:"always",
            keywords:"never",
            classes:"always",
            modules:"always"
        }],
        "@stylistic/keyword-spacing":["error", {
            before:false,
            after:true,
            overrides:{
                "else":{after:false},
                "continue":{before:true},
                "from":{before:true, after:true},
                "as":{before:true, after:true},
                "throw":{before:true, after:true},
                "return":{before:true, after:true}
            }
        }],
        "@stylistic/space-infix-ops":["error", {
            ignoreTypes:true
        }],
        "@stylistic/space-unary-ops":["error"],
        "@stylistic/brace-style":["error", "1tbs", {
            allowSingleLine:true
        }],
        "@stylistic/object-curly-newline":"off",
        "@stylistic/function-call-argument-newline":["error", "never"],
        "@stylistic/function-paren-newline":["error", "never"],
        "@stylistic/implicit-arrow-linebreak":["error", "beside"],
        "@stylistic/operator-linebreak":["error", "before"],
        "@stylistic/arrow-parens":["error", "always"],
        "@stylistic/space-in-parens":["error", "never"],
        "@stylistic/computed-property-spacing":["error", "never"],
        "@stylistic/no-multi-spaces":"error",
        "@stylistic/padded-blocks":"off",
        "@stylistic/lines-between-class-members":["error", "always", {
            exceptAfterSingleLine:true
        }],
        "@stylistic/spaced-comment":["error", "never", {
            line:{markers:["/", "="]},
            block:{markers:["!"], exceptions:["*", "-", "="]}
        }],
        "eqeqeq":["error", "smart"],
        "no-empty":"off",

        //typescript stuff
        "@typescript-eslint/consistent-type-imports":"off",
        "@typescript-eslint/explicit-function-return-type":"off",
        "@typescript-eslint/no-explicit-any":"off",
        "@typescript-eslint/prefer-as-const":"off"
    }
})