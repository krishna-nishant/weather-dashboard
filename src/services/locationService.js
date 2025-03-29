import axios from 'axios';

const VITE_GEONAMES_USERNAME = import.meta.env.VITE_GEONAMES_USERNAME;

const locationService = {
    getCitySuggestions: async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            return [];
        }

        try {
            // First try with name_startsWith for better partial matches
            const nameStartsResponse = await axios.get(
                'https://secure.geonames.org/searchJSON', {
                params: {
                    name_startsWith: searchTerm,
                    country: 'IN',
                    featureClass: 'P',
                    orderby: 'population',
                    maxRows: 5,
                    username: VITE_GEONAMES_USERNAME
                },
                timeout: 5000
            });

            // Then try with regular search for broader matches
            const containsResponse = await axios.get(
                'https://secure.geonames.org/searchJSON', {
                params: {
                    q: searchTerm,
                    country: 'IN',
                    featureClass: 'P',
                    orderby: 'relevance',
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
                if (!allResults.some(existing => existing.geonameId === city.geonameId)) {
                    allResults.push(city);
                }
            });

            // Format the results
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