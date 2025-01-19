'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Globe from 'react-globe.gl'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { fetchWorldBankDataForAllCountries, CountryData as WorldBankCountryData } from '@/lib/worldbank-api'

interface CountryData {
  name: string
  lat: number
  lng: number
  value: number
  alertLevel: 'low' | 'medium' | 'high'
  continent: string
  windSpeed?: number
  windPotential?: number
  gdpPerCapita?: number
  co2Emissions?: number
  population?: number
}

const alertColors = {
  low: '#00ff00',
  medium: '#ffff00',
  high: '#ff0000'
}

const heatmapColors = {
  low: ['#f7fbff', '#08519c'],
  medium: ['#fff5f0', '#a50f15'],
  high: ['#f7fcf5', '#005a32']
}

export function GlobeVisualization() {
  const globeRef = useRef<any>()
  const containerRef = useRef<HTMLDivElement>(null)
  const [countries, setCountries] = useState<CountryData[]>([])
  const [heatmapVisible, setHeatmapVisible] = useState(true)
  const [bordersVisible, setBordersVisible] = useState(true)
  const [windDataVisible, setWindDataVisible] = useState(false)
  const [economicDataVisible, setEconomicDataVisible] = useState(false)
  const [co2DataVisible, setCo2DataVisible] = useState(false)
  const [heatmapIntensity, setHeatmapIntensity] = useState(1)
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite'>('default')
  const [hoverD, setHoverD] = useState(null)
  const [polygonsData, setPolygonsData] = useState([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [windParticles, setWindParticles] = useState<any[]>([])

  const handlePolygonHover = useCallback((polygon: any) => {
    setHoverD(polygon === null ? null : polygon.properties)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const [countriesResponse, worldBankData] = await Promise.all([
        fetch('/countries.json').then(res => res.json()),
        fetchWorldBankDataForAllCountries()
      ]);

      const mergedData = countriesResponse.map((country: CountryData) => {
        const worldBankInfo = worldBankData.find(wbCountry => wbCountry.country === country.name);
        return {
          ...country,
          gdpPerCapita: worldBankInfo?.gdpPerCapita,
          co2Emissions: worldBankInfo?.co2Emissions,
          population: worldBankInfo?.population
        };
      });

      setCountries(mergedData);
    };

    fetchData();

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    window.addEventListener('resize', updateDimensions)
    updateDimensions()

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true
      globeRef.current.controls().autoRotateSpeed = 0.5
    }
  }, [dimensions])

  useEffect(() => {
    if (bordersVisible) {
      fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
        .then(res => res.json())
        .then(data => setPolygonsData(data.features))
    } else {
      setPolygonsData([])
    }
  }, [bordersVisible])

  const maxValue = Math.max(...countries.map(c => c.value))

  const getColor = useCallback((t: number, alertLevel: 'low' | 'medium' | 'high') => {
    const color = d3.scaleLinear<string>()
      .domain([0, 1])
      .range(heatmapColors[alertLevel])
    return color(t * heatmapIntensity)
  }, [heatmapIntensity])

  const getPointColor = useCallback((d: CountryData) => {
    if (economicDataVisible && d.gdpPerCapita) {
      return d3.interpolateGreens(Math.log(d.gdpPerCapita) / Math.log(100000)) // Log scale for GDP per capita
    }
    if (co2DataVisible && d.co2Emissions) {
      return d3.interpolateReds(d.co2Emissions / 20) // Assuming max CO2 emissions is 20 metric tons per capita
    }
    return alertColors[d.alertLevel]
  }, [economicDataVisible, co2DataVisible])

  const getPointRadius = useCallback((d: CountryData) => {
    if (economicDataVisible && d.population) {
      return (Math.log(d.population) / Math.log(1500000000)) * 5 // Log scale for population
    }
    if (co2DataVisible && d.population) {
      return (Math.log(d.population) / Math.log(1500000000)) * 5 // Log scale for population
    }
    return ((d.value / maxValue) * 2)
  }, [economicDataVisible, co2DataVisible, maxValue])

  const getPointLabel = useCallback((d: CountryData) => {
    let label = `${d.name}: `
    if (economicDataVisible) {
      label += `GDP per capita: $${d.gdpPerCapita?.toLocaleString()}, Population: ${d.population?.toLocaleString()}`
    } else if (co2DataVisible) {
      label += `CO2 Emissions: ${d.co2Emissions?.toFixed(2)} metric tons per capita, Population: ${d.population?.toLocaleString()}`
    } else {
      label += `Alert Level: ${d.alertLevel.toUpperCase()}`
    }
    return label
  }, [economicDataVisible, co2DataVisible])

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Interactive Global Analytics</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div ref={containerRef} className="w-full lg:w-3/4 h-[400px] lg:h-[600px]">
            <Globe
              ref={globeRef}
              width={dimensions.width}
              height={dimensions.height}
              globeImageUrl={mapStyle === 'default' 
                ? "//unpkg.com/three-globe/example/img/earth-day.jpg"
                : "//unpkg.com/three-globe/example/img/earth-night.jpg"}
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              hexBinPointsData={heatmapVisible ? countries : []}
              hexBinPointWeight="value"
              hexBinResolution={4}
              hexTopColor={d => getColor(d.sumWeight / maxValue, d.points[0].alertLevel)}
              hexSideColor={d => getColor(d.sumWeight / maxValue, d.points[0].alertLevel)}
              hexBinMerge={true}
              hexTransitionDuration={1000}
              polygonsData={polygonsData}
              polygonAltitude={0.01}
              polygonCapColor={({ properties: d }) => {
                const country = countries.find(c => c.name === d.ADMIN);
                return country ? `${alertColors[country.alertLevel]}80` : 'rgba(200, 200, 200, 0.3)';
              }}
              polygonSideColor={({ properties: d }) => {
                const country = countries.find(c => c.name === d.ADMIN);
                return country ? alertColors[country.alertLevel] : 'rgba(150, 150, 150, 0.3)';
              }}
              polygonStrokeColor={() => '#ffffff'}
              polygonLabel={({ properties: d }: any) => {
                const country = countries.find(c => c.name === d.ADMIN);
                return `
                  <div style="color: ${country ? alertColors[country.alertLevel] : 'white'};">
                    <b>${d.ADMIN} (${d.ISO_A2})</b>
                    ${hoverD === d ? `<br />GDP per capita: $${country?.gdpPerCapita?.toLocaleString()}<br/>CO2 Emissions: ${country?.co2Emissions?.toFixed(2)} metric tons per capita` : ''}
                  </div>
                `;
              }}
              polygonLabelPosition={({ properties: d }) => d.LABEL_X && d.LABEL_Y ? [+d.LABEL_X, +d.LABEL_Y] : null}
              polygonLabelAltitude={0.02}
              polygonLabelResolution={2}
              polygonLabelDotRadius={0.1}
              polygonLabelColor={({ properties: d }) => {
                const country = countries.find(c => c.name === d.ADMIN);
                return country ? alertColors[country.alertLevel] : 'rgba(255, 255, 255, 0.75)';
              }}
              onPolygonHover={handlePolygonHover}
              polygonsTransitionDuration={300}
              pointsData={countries}
              pointColor={getPointColor}
              pointAltitude={0.01}
              pointRadius={getPointRadius}
              pointLabel={getPointLabel}
              labelsData={countries}
              labelLat={d => d.lat}
              labelLng={d => d.lng}
              labelText={d => d.name}
              labelSize={d => Math.sqrt(d.value) * 4e-4}
              labelDotRadius={d => Math.sqrt(d.value) * 4e-4}
              labelColor={() => 'rgba(255, 255, 255, 0.75)'}
              labelResolution={2}
              atmosphereColor="lightskyblue"
              atmosphereAltitude={0.25}
              onPointClick={(point, event) => console.log(point, event)}
            />
          </div>
          <div className="w-full lg:w-1/4 p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="heatmap-toggle"
                checked={heatmapVisible}
                onCheckedChange={setHeatmapVisible}
              />
              <Label htmlFor="heatmap-toggle">Show Heatmap</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="borders-toggle"
                checked={bordersVisible}
                onCheckedChange={setBordersVisible}
              />
              <Label htmlFor="borders-toggle">Show Borders</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="economic-data-toggle"
                checked={economicDataVisible}
                onCheckedChange={(checked) => {
                  setEconomicDataVisible(checked)
                  if (checked) {
                    setCo2DataVisible(false)
                    setWindDataVisible(false)
                  }
                }}
              />
              <Label htmlFor="economic-data-toggle">Show Economic Data</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="co2-data-toggle"
                checked={co2DataVisible}
                onCheckedChange={(checked) => {
                  setCo2DataVisible(checked)
                  if (checked) {
                    setEconomicDataVisible(false)
                    setWindDataVisible(false)
                  }
                }}
              />
              <Label htmlFor="co2-data-toggle">Show CO2 Emissions Data</Label>
            </div>
            <div>
              <Label htmlFor="heatmap-intensity">Heatmap Intensity</Label>
              <Slider
                id="heatmap-intensity"
                min={0.1}
                max={2}
                step={0.1}
                value={[heatmapIntensity]}
                onValueChange={([value]) => setHeatmapIntensity(value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Map Style</Label>
              <div className="flex space-x-2">
                <Button
                  variant={mapStyle === 'default' ? 'default' : 'outline'}
                  onClick={() => setMapStyle('default')}
                >
                  Default
                </Button>
                <Button
                  variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                  onClick={() => setMapStyle('satellite')}
                >
                  Satellite
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data Legend</Label>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>High GDP per capita / Low CO2 Emissions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  <span>Medium GDP per capita / Medium CO2 Emissions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Low GDP per capita / High CO2 Emissions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

