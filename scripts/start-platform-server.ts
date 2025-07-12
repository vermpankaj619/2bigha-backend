import { spawn } from "child_process"
import { logInfo } from "../src/utils/logger"

async function startPlatformServer() {
    logInfo("Starting Platform User Server...")

    const server = spawn("npx", ["ts-node", "src/platform-user-server.ts"], {
        stdio: "inherit",
        env: { ...process.env, NODE_ENV: "development" },
    })

    server.on("error", (error) => {
        console.error("Failed to start platform server:", error)
    })

    server.on("close", (code) => {
        console.log(`Platform server exited with code ${code}`)
    })

    // Handle graceful shutdown
    process.on("SIGINT", () => {
        console.log("\nShutting down platform server...")
        server.kill("SIGINT")
        process.exit(0)
    })

    process.on("SIGTERM", () => {
        console.log("\nShutting down platform server...")
        server.kill("SIGTERM")
        process.exit(0)
    })
}

startPlatformServer()
