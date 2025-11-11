import swaggerJsdoc from "swagger-jsdoc"

const apiVersion = process.env.npm_package_version || "1.0.0"
const serverPort = process.env.PORT || 3000
const serverUrl = process.env.API_BASE_URL || `http://localhost:${serverPort}`

const options = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "Academic Performance Tracker API",
			version: apiVersion,
			description:
				"REST API documentation for the Academic Performance Tracking System.",
		},
		servers: [
			{
				url: serverUrl,
				description: "Current server",
			},
		],
	},
	apis: ["./routes/*.js", "./controllers/*.js", "./models/*.js"],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec


