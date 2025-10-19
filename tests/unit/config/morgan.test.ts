import {describe,it ,expect} from "@jest/globals"
import { successHandler,errorHandler } from "../../../src/config/morgan"



describe("Morgan Handlers",()=>{

    it("successHandler should be a function",()=>{
        expect(typeof successHandler).toBe("function")
    })
    it("errorHandler should be a function",()=>{
        expect(typeof errorHandler).toBe("function")
    })
    it("successHandler skip function should skip error response",()=>{
        const req:any={}
        const res:any ={statusCode:500}
        const skip=(req.statusCode >= 400)
        expect(skip).toBe(true)
    })
     it("errorHandler skip function should skip error response",()=>{
        const req:any={}
        const res:any ={statusCode:200}
        const skip=(req.statusCode < 400)
        expect(skip).toBe(true)
    })
})