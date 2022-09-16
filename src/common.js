import countries from './assets/json/country.json'

const getCountryTag = (countryCode, type = 'movie') => {
    if(!countryCode) return null
    const code = countryCode.toLowerCase()
    
    switch(type) {
        case 'tv':
            return countries[code].drama_cn || countries[code].chinese;
        case 'movie':
        default:
            return countries[code].chinese
    }
}

export { getCountryTag }