const API_BASE_URL = 'https://api.worldbank.org/v2';

export interface CountryData {
  country: string;
  gdpPerCapita: number;
  co2Emissions: number;
  population: number;
}

async function fetchWorldBankData(indicator: string, year: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/country/all/indicator/${indicator}?date=${year}&format=json&per_page=300`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const [metadata, data] = await response.json();
    return data || [];
  } catch (error) {
    console.error(`Error fetching data for indicator ${indicator}:`, error);
    return [];
  }
}

export async function fetchWorldBankDataForAllCountries(): Promise<CountryData[]> {
  try {
    const [gdpData, co2Data, populationData] = await Promise.all([
      fetchWorldBankData('NY.GDP.PCAP.CD', '2021'),
      fetchWorldBankData('EN.ATM.CO2E.PC', '2019'),
      fetchWorldBankData('SP.POP.TOTL', '2021')
    ]);

    if (!Array.isArray(gdpData) || !Array.isArray(co2Data) || !Array.isArray(populationData)) {
      console.error('Invalid data structure received from World Bank API');
      return [];
    }

    const countryData: { [key: string]: CountryData } = {};

    gdpData.forEach((item: any) => {
      if (item && item.country && item.country.value && item.value !== null) {
        countryData[item.country.value] = {
          country: item.country.value,
          gdpPerCapita: item.value,
          co2Emissions: 0,
          population: 0
        };
      }
    });

    co2Data.forEach((item: any) => {
      if (item && item.country && item.country.value && item.value !== null && countryData[item.country.value]) {
        countryData[item.country.value].co2Emissions = item.value;
      }
    });

    populationData.forEach((item: any) => {
      if (item && item.country && item.country.value && item.value !== null && countryData[item.country.value]) {
        countryData[item.country.value].population = item.value;
      }
    });

    return Object.values(countryData);
  } catch (error) {
    console.error('Error fetching World Bank data:', error);
    return [];
  }
}

