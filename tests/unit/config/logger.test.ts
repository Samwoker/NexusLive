import { describe,it,expect,beforeEach,jest } from "@jest/globals";

jest.mock("../../src/config/config.ts",()=>({
    _esModule:true,
    config:{nodeEnv:"development"}
}))

import logger from "../../../src/config/logger.ts"
import { transport, transports } from "winston";

describe("Logger Module",()=>{
    it("should have debug level in development",()=>{
        expect(logger.level).toBe("debug")
})
it("should include console transport",()=>{
    const hasConsole = logger.transports.some(t=> t instanceof transports.Console)
    expect(hasConsole).toBe(true)
})
it("should have a format defined",()=>{
    expect(logger.format).toBeDefined()
})
})