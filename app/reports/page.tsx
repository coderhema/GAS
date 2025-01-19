'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const data = [
  { country: 'USA', gdp: 21433225, population: 331002651 },
  { country: 'China', gdp: 14342903, population: 1439323776 },
  { country: 'Japan', gdp: 5082465, population: 126476461 },
  { country: 'Germany', gdp: 3845630, population: 83783942 },
  { country: 'UK', gdp: 2827113, population: 67886011 },
]

export default function ReportsPage() {
  const d3Container = useRef(null)

  useEffect(() => {
    if (d3Container.current) {
      const svg = d3.select(d3Container.current)
      
      // Clear any existing content
      svg.selectAll("*").remove()

      const width = 400
      const height = 300
      const margin = { top: 20, right: 30, bottom: 40, left: 90 }

      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.gdp) || 0]) // Default to 0 if max is undefined
        .range([margin.left, width - margin.right])

      const y = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([margin.top, height - margin.bottom])
        .padding(0.1)

      svg.attr('width', width)
         .attr('height', height)

      svg.append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(data)
        .join('rect')
          .attr('x', x(0))
          .attr('y', (d: { country: string }) => y(d.country) || 0) // Ensure y calculation is always a number
          .attr('width', d => (x(d.gdp) ? x(d.gdp) - x(0) : 0)) // Ensure width calculation is always a number
          .attr('height', y.bandwidth())

      svg.append('g')
         .call(d3.axisLeft(y))
         .attr('transform', `translate(${margin.left},0)`)

      svg.append('g')
         .attr('transform', `translate(0,${height - margin.bottom})`)
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>GDP by Country (D3.js)</CardTitle>
          </CardHeader>
          <CardContent>
            <svg ref={d3Container} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Country Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>GDP (USD)</TableHead>
                  <TableHead>Population</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.country}>
                    <TableCell>{item.country}</TableCell>
                    <TableCell>{item.gdp.toLocaleString()}</TableCell>
                    <TableCell>{item.population.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

