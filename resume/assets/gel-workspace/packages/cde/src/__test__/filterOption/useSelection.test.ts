import { CDEFilterItem } from 'gel-api'
import { describe, expect, it } from 'vitest'
import { _checkItem, _uncheckItem } from '../../hooks/useSelection'
import { buildRelationMaps } from '../../utils/checkBoxSelection'

// Comprehensive mock data with multiple nesting levels
const mockOptions: CDEFilterItem['itemOption'] = [
  {
    label: 'Asia',
    name: 'Asia',
    value: 'asia',
    itemOption: [
      {
        label: 'China',
        name: 'China',
        value: 'china',
        itemOption: [
          { label: 'Shanghai', name: 'Shanghai', value: 'shanghai' },
          { label: 'Beijing', name: 'Beijing', value: 'beijing' },
        ],
      },
      {
        label: 'Japan',
        name: 'Japan',
        value: 'japan',
        itemOption: [{ label: 'Tokyo', name: 'Tokyo', value: 'tokyo' }],
      },
    ],
  },
  {
    label: 'Europe',
    name: 'Europe',
    value: 'europe',
    itemOption: [
      { label: 'Germany', name: 'Germany', value: 'germany' },
      { label: 'France', name: 'France', value: 'france' },
    ],
  },
]

describe('Selection Logic Static Functions', () => {
  const maps = buildRelationMaps(mockOptions)

  describe('_checkItem', () => {
    it('should add a single leaf node to the set', () => {
      const currentValues = new Set<string>()
      const newValues = _checkItem('germany', currentValues, maps)
      expect(newValues).toEqual(new Set(['germany']))
    })

    it('should select a parent and remove its descendants from the set', () => {
      const currentValues = new Set(['shanghai'])
      const newValues = _checkItem('china', currentValues, maps)
      expect(newValues).toEqual(new Set(['china']))
    })

    it('should consolidate children into a parent when the last child is selected', () => {
      const currentValues = new Set(['germany'])
      const newValues = _checkItem('france', currentValues, maps)
      expect(newValues).toEqual(new Set(['europe']))
    })

    it('should perform multi-level consolidation', () => {
      let currentValues = _checkItem('shanghai', new Set(), maps)
      currentValues = _checkItem('beijing', currentValues, maps) // Consolidates to 'china'
      currentValues = _checkItem('tokyo', currentValues, maps) // Consolidates 'japan', then 'asia'
      expect(currentValues).toEqual(new Set(['asia']))
    })
  })

  describe('_uncheckItem', () => {
    it('should remove a single, individually selected leaf node', () => {
      const currentValues = new Set(['germany', 'france'])
      const newValues = _uncheckItem('germany', currentValues, maps)
      expect(newValues).toEqual(new Set(['france']))
    })

    it('should break apart a parent when a child is unchecked', () => {
      const currentValues = new Set(['europe'])
      const newValues = _uncheckItem('germany', currentValues, maps)
      expect(newValues).toEqual(new Set(['france']))
    })

    it('should break apart an ancestor when a descendant is unchecked', () => {
      const currentValues = new Set(['asia'])
      const newValues = _uncheckItem('shanghai', currentValues, maps)
      expect(newValues).toEqual(new Set(['japan', 'beijing']))
    })

    it('BUGFIX VERIFICATION: unchecking an item should NOT add siblings if the parent was not selected', () => {
      const currentValues = new Set(['beijing', 'shanghai'])
      const newValues = _uncheckItem('beijing', currentValues, maps)
      // 'beijing' is removed, 'shanghai' remains. No other items should be added.
      expect(newValues).toEqual(new Set(['shanghai']))
    })

    it('BUGFIX VERIFICATION: unchecking an item and then checking a sibling should not re-check the first', () => {
      // 1. Start with 'beijing' and 'france' checked
      let currentValues = new Set(['beijing', 'france'])

      // 2. Uncheck 'beijing'
      currentValues = _uncheckItem('beijing', currentValues, maps)
      expect(currentValues).toEqual(new Set(['france']))

      // 3. Check 'shanghai'
      currentValues = _checkItem('shanghai', currentValues, maps)
      // Should now have 'shanghai' and 'france'. Critically, 'beijing' should not have reappeared.
      expect(currentValues).toEqual(new Set(['france', 'shanghai']))
    })
  })
})
