import { describe, expect, it } from 'vitest'
import { propagateHiddenToChildren } from '../../tree/propagateHiddenToChildren'
import { TreeFns } from '../../tree/type'

interface TestNode {
  id: string
  children?: TestNode[]
}

describe('propagateHiddenToChildren', () => {
  const treeFns: TreeFns<TestNode> = {
    getId: (node) => node.id,
    getChildren: (node) => node.children,
  }

  describe('single node input', () => {
    it('should handle single node', () => {
      const node: TestNode = { id: 'root' }
      const hiddenNodes = ['root']

      const result = propagateHiddenToChildren(node, hiddenNodes, treeFns)
      expect(result).toEqual(['root'])
    })

    it('should propagate hidden state to children with single node', () => {
      const node: TestNode = {
        id: 'root1',
        children: [{ id: 'child1' }, { id: 'child2' }],
      }
      const hiddenNodes = ['root1']

      const result = propagateHiddenToChildren(node, hiddenNodes, treeFns)
      expect(result).toContain('root1')
      expect(result).toContain('child1')
      expect(result).toContain('child2')
    })

    it('should handle deep nested structure with single node', () => {
      const node: TestNode = {
        id: 'root1',
        children: [
          {
            id: 'branch1',
            children: [{ id: 'leaf1' }, { id: 'leaf2' }],
          },
        ],
      }
      const hiddenNodes = ['branch1']

      const result = propagateHiddenToChildren(node, hiddenNodes, treeFns)
      expect(result).toContain('branch1')
      expect(result).toContain('leaf1')
      expect(result).toContain('leaf2')
      expect(result).not.toContain('root1')
    })
  })

  describe('array input', () => {
    it('should handle array with single node', () => {
      const node: TestNode = { id: 'root' }
      const hiddenNodes = ['root']

      const result = propagateHiddenToChildren([node], hiddenNodes, treeFns)
      expect(result).toEqual(['root'])
    })

    it('should handle multiple root nodes', () => {
      const nodes: TestNode[] = [{ id: 'root1' }, { id: 'root2' }, { id: 'root3' }]
      const hiddenNodes = ['root1', 'root3']

      const result = propagateHiddenToChildren(nodes, hiddenNodes, treeFns)
      expect(result).toContain('root1')
      expect(result).not.toContain('root2')
      expect(result).toContain('root3')
    })

    it('should propagate hidden state to children with array', () => {
      const nodes: TestNode[] = [
        {
          id: 'root1',
          children: [{ id: 'child1' }, { id: 'child2' }],
        },
        {
          id: 'root2',
          children: [{ id: 'child3' }, { id: 'child4' }],
        },
      ]
      const hiddenNodes = ['root1', 'child3']

      const result = propagateHiddenToChildren(nodes, hiddenNodes, treeFns)
      expect(result).toContain('root1')
      expect(result).toContain('child1')
      expect(result).toContain('child2')
      expect(result).toContain('child3')
      expect(result).not.toContain('root2')
      expect(result).not.toContain('child4')
    })

    it('should handle deep nested structure with array', () => {
      const nodes: TestNode[] = [
        {
          id: 'root1',
          children: [
            {
              id: 'branch1',
              children: [{ id: 'leaf1' }, { id: 'leaf2' }],
            },
          ],
        },
        {
          id: 'root2',
          children: [
            {
              id: 'branch2',
              children: [{ id: 'leaf3' }, { id: 'leaf4' }],
            },
          ],
        },
      ]
      const hiddenNodes = ['branch1', 'leaf3']

      const result = propagateHiddenToChildren(nodes, hiddenNodes, treeFns)
      expect(result).toContain('branch1')
      expect(result).toContain('leaf1')
      expect(result).toContain('leaf2')
      expect(result).toContain('leaf3')
      expect(result).not.toContain('root1')
      expect(result).not.toContain('root2')
      expect(result).not.toContain('branch2')
      expect(result).not.toContain('leaf4')
    })

    it('should handle empty array', () => {
      const nodes: TestNode[] = []
      const hiddenNodes = ['something']

      const result = propagateHiddenToChildren(nodes, hiddenNodes, treeFns)
      expect(result).toEqual([])
    })

    it('should handle nodes without children', () => {
      const nodes: TestNode[] = [{ id: 'node1' }, { id: 'node2', children: [] }, { id: 'node3', children: undefined }]
      const hiddenNodes = ['node1', 'node3']

      const result = propagateHiddenToChildren(nodes, hiddenNodes, treeFns)
      expect(result).toContain('node1')
      expect(result).not.toContain('node2')
      expect(result).toContain('node3')
    })
  })
})
