import { execSync } from "child_process"
import logger from "node-color-log"
import { Recipe } from "./parse"
import { canExecRecipe } from "./utils/recipeMatch"

export function ExecBundle(recipes: Recipe[]): void {
    logger.info("Executing Bundle ...")

    if (process.env.RECIPE !== undefined) {
        logger.warn("Bundle recipes will be skipped")
        logger.warn("cause: Running with RECIPE env variable set")
        return
    }

    // directly call the deploy scrips from the recipes
    for (const recipe of recipes) {
        // check if the recipe has a build script
        if (recipe.bundleRecipes && recipe.bundleRecipes.length > 0) {
            logger.info(`Executing bundle for ${recipe.name} ...`)

            // execute the build scripts
            for (const bundleRecipe of recipe.bundleRecipes) {
                process.env.META = JSON.stringify(recipe)

                logger.info(`Executing bundle script ${bundleRecipe} ...`)
                execSync(
                    `exec ${bundleRecipe}`,
                    {
                        cwd: recipe.recipeOrigin,
                        shell: "/bin/bash",
                        stdio: "inherit",
                        encoding: "utf-8",
                        env: process.env
                    }
                )
            }
        }
    }
}
