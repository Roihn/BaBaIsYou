import { store } from '@/core'
import { getSceneSetup } from '@/core/resource/sceneSetup'
import { GameResult } from '@/core/types'
import { sleep } from '@/core/utils/time'
import { createInstructionDispatchServer } from '@/core/controllers/dispatcher'
import { createMapController } from '@/core/controllers/map'
import { createRuleController } from '@/core/controllers/rule'
import { createRuleScanner } from '@/core/controllers/tools/ruleScanner'
import { RESOURCE_LOCATION } from '@/core/app/configs'

// let lastGameResult: GameResult | null = null
export type GameStatus = "playing" | "win"
let currentGameStatus: GameStatus = "playing"

// export const getLastGameResult = () => lastGameResult
export const getCurrentGameStatus = () => currentGameStatus

export const startLevel = async (setupFileName: string) => {
  currentGameStatus = "playing"
  const stageBuilder = store.getStageBuilder()

  if (store.getDispatchServer()) {
    // stop command listen service.
    store.disposeDispatchServer()
  }

  await store.loadResources(RESOURCE_LOCATION)

  const mapController = createMapController()
  store.setMapController(mapController)

  const ruleController = createRuleController(mapController)
  store.setRuleController(ruleController)

  const scanner = createRuleScanner(ruleController, mapController)
  store.setScanner(scanner)

  // create a new dispatcher.
  const dispatcher = createInstructionDispatchServer()
  store.setDispatchServer(dispatcher)
  store.connectDispatchListener(dispatcher.commandListener)

  // remove container on stage.
  await stageBuilder.removeScene()

  // fetch sceneSetup.
  const sceneSetup = await getSceneSetup(setupFileName)

  // build the scene.
  await stageBuilder.addGameScene(sceneSetup)

  // start command dispatcher.
  store.initDispatchServer()

  // start listen keyboard event
  store.initCommandWatchService()
}

export let gameOver: (gameResult: GameResult) => Promise<void>
export let youGone: (existYou: boolean) => Promise<void>

export const setYouGoneOutsideHandler = (outsideHandler: (existYou: boolean) => Promise<void>): void => {
  youGone = async (existYou: boolean) => {
    await outsideHandler(existYou)
  }
}

export const setGameOverOutsideHandler = (outsideHandler: (gameResult: GameResult) => Promise<void>): void => {
  gameOver = async (gameResult: GameResult) => {
    if (gameResult === GameResult.WIN) {
      currentGameStatus = "win"
    }
    // lastGameResult = gameResult
    const stageBuilder = store.getStageBuilder()

    // stop command listen service.
    store.disposeDispatchServer()

    // wait a little time to perform an import event feeling. (?
    await sleep(300)

    // call outside layer.
    await outsideHandler(gameResult)

    // remove container on stage.
    await stageBuilder.removeScene()
  }
}

export const pause = () => {
  // stop command listen service.
  store.disposeDispatchServer()
}

export const resume = () => {
  // start command dispatcher.
  store.initDispatchServer()
}

export const printMap = () => {
  const mapController = store.getMapController()
  if (mapController) {
    mapController.printMap()
  } else {
    console.log('Map controller not initialized')
  }
}

export const getMapAsString = (): string => {
  const mapController = store.getMapController()
  if (mapController) {
    return mapController.getMapAsString()
  } else {
    return 'Map controller not initialized'
  }
}

export const getMapAsObject = (): object => {
  const mapController = store.getMapController()
  if (mapController) {
    return mapController.getMapAsObject()
  } else {
    return 'Map controller not initialized'
  }
}

export const printYouExists = async () => {
  const ruleController = store.getRuleController()
  if (ruleController) {
    const exists = await ruleController.checkYouExistsInLevel()
    console.log(exists)
    return exists
  } else {
    console.log('Rule controller not initialized')
    return false
  }
}