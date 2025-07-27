import { MapPropertiesService } from "../services/map-properties.service"

interface MapBounds {
    northEast: { lat: number; lng: number }
    southWest: { lat: number; lng: number }
}

interface MapPropertyFilters {
    bounds?: MapBounds
    minPrice?: number
    maxPrice?: number
    propertyTypes?: string[]
    minArea?: number
    maxArea?: number
    areaUnit?: string
    cities?: string[]
    states?: string[]
    verified?: boolean
    saleBy?: string[]
    beds?: number[]
    baths?: number[]
}

export const mapPropertiesResolvers = {
    Query: {
        // Get all properties for map rendering
        mapProperties: async (_: any, { limit = 1000 }: { limit?: number }) => {
            try {
                console.log(`🗺️ GraphQL: Fetching map properties with limit ${limit}`)

                return await MapPropertiesService.getMapProperties()
            } catch (error) {
                console.error("❌ GraphQL Error fetching map properties:", error)
                throw new Error(`Failed to fetch map properties: ${error}`)
            }
        },


    },


}
