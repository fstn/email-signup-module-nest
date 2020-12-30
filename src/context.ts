import {Generate, get} from "@fstn/typescript-data-generator"
import {get as getForSnapshot, MapToForSnapshot} from "@fstn/typescript-jest-snapshot-mapper";

export const Scope = {
  FAKE: "FAKE",
  EMPTY: "EMPTY",
  TEST_SAFE: "TEST_SAFE"
}

export const Fake = Generate(Scope.FAKE)
export const Empty = Generate(Scope.EMPTY)
export const TestSafe = MapToForSnapshot(Scope.TEST_SAFE)

export const getFake = get(Scope.FAKE)
export const getEmpty = get(Scope.EMPTY)
export const getTestSafe = getForSnapshot(Scope.TEST_SAFE)
