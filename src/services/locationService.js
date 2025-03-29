import axios from 'axios';

// Username for GeoNames API from environment variables
const VITE_GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME;

const locationService = {
    /**
     * Fetches city suggestions based on search term
     * Uses GeoNames API to find cities in India
     */
    getCitySuggestions: async (searchTerm) => {
        // Return empty array for short search terms (less than 2 chars)
        if (!searchTerm || searchTerm.length < 2) {
            return [];
        }

        try {
            // First try with name_startsWith for better partial matches
            const nameStartsResponse = await axios.get(
                'https://secure.geonames.org/searchJSON', {
                params: {
                    name_startsWith: searchTerm,
                    country: 'IN',        // Only Indian cities
                    featureClass: 'P',    // Only populated places
                    orderby: 'population', // Sort by population (largest first)
                    maxRows: 5,           // Limit to 5 results
                    username: VITE_GEONAMES_USERNAME
                },
                timeout: 5000             // Timeout after 5 seconds
            });

            // Then try with regular search for broader matches
            const containsResponse = await axios.get(
                'https://secure.geonames.org/searchJSON', {
                params: {
                    q: searchTerm,
                    country: 'IN',
                    featureClass: 'P',
                    orderby: 'relevance', // Sort by relevance to query
                    maxRows: 5,
                    username: VITE_GEONAMES_USERNAME
                },
                timeout: 5000
            });

            // Combine both results and remove duplicates
            const startsWithResults = nameStartsResponse.data.geonames || [];
            const containsResults = containsResponse.data.geonames || [];

            // Get all results and remove duplicates by geonameId
            const allResults = [...startsWithResults];
            containsResults.forEach(city => {
                // Only add if not already in results (avoid duplicates)
                if (!allResults.some(existing => existing.geonameId === city.geonameId)) {
                    allResults.push(city);
                }
            });

            // Format the results with cleaner structure
            const formattedCities = allResults.map(city => ({
                name: city.name,
                fullName: city.adminName1 ? `${city.name}, ${city.adminName1}, India` : `${city.name}, India`,
                latitude: city.lat,
                longitude: city.lng
            })).slice(0, 5); // Limit to 5 total results

            return formattedCities;
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
            return [];
        }
    }
};

export default locationService;