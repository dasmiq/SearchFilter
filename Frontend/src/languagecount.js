'use strict'

import {View} from './view.js'
import * as d3 from 'd3'

export class LanguageCount extends View {
  prepare () {
    let t = this
    t.x = d3.scaleBand().range([0, t.width])
    t.xAxis = d3.axisBottom().scale(t.x)
    t.y = d3.scaleLog().range([t.height, 0])
    t.yAxis = d3.axisLeft().scale(t.y)
    t.mainShape = 'rect'
    t.mainClass = 'bar'
    t.dotMainClass = '.bar'
    t.svg.append('g').attr('class', 'x axis')
    t.svg.append('g').attr('class', 'y axis')
    t.addTitle('Number of Documents per Language')
  }

  update (data) {
    let t = this
    t.x.domain(data.map(function (d) {
      return d.key
    }))
    t.y.domain([1, d3.max(data, function (d) {
      return d.value
    })])
    let updateSelection = t.svg.selectAll(t.dotMainClass)
      .data(data, function (d) {
        return d.key
      })
    updateSelection.exit().remove()
    updateSelection.transition()
      .duration(t.transition)
      .attr('y', function (d) {
        return t.y(d.value + 1)
      })
      .attr('height', function (d) {
        return t.height - t.y(d.value + 1)
      })
    updateSelection.enter()
      .append(t.mainShape)
      .attr('class', t.mainClass)
      .attr('fill', '#666666')
      .attr('x', function (d) {
        return t.x(d.key)
      })
      .attr('y', function (d) {
        return t.y(d.value + 1)
      })
      .attr('width', t.x.bandwidth())
      .attr('height', function (d) {
        return t.height - t.y(d.value + 1)
      })
      .on('mouseover', function (d) {
        t.dispatch.call('languageSelection', t, d.key)
      })
      .on('mouseout', function () {
        t.dispatch.call('languageClear')
      })
    t.svg.select('.x.axis').transition()
      .duration(t.transition)
      .attr('transform', 'translate(0,' + t.height + ')')
      .call(t.xAxis)
    t.svg.select('.y.axis').transition()
      .duration(t.transition)
      .call(t.yAxis.ticks(5, '.3s'))
  }
}