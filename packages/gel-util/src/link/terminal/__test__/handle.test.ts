import { describe, expect, it } from 'vitest'
import { getIfTerminalCmd } from '../handle'

describe('getIfTerminalCmd', () => {
  it('should return false for empty or undefined input', () => {
    expect(getIfTerminalCmd('')).toBe(false)
  })

  it('should return true for CommandParam format', () => {
    const input = '!CommandParam[8514,CompanyCode=123,SubjectID=4778,grid=target]'
    expect(getIfTerminalCmd(input)).toBe(true)
  })

  it('should return true for Page format', () => {
    const input = '!Page[Minute,1810,HK]'
    expect(getIfTerminalCmd(input)).toBe(true)
  })

  it('should return true for simple command format', () => {
    const input = '![simple,command,test]'
    expect(getIfTerminalCmd(input)).toBe(true)
  })

  it('should return true for command format with various characters before [', () => {
    expect(getIfTerminalCmd('!####[simple,command,test]')).toBe(true)
    expect(getIfTerminalCmd('!abc123[simple,command,test]')).toBe(true)
    expect(getIfTerminalCmd('!@#$%^&*[simple,command,test]')).toBe(true)
    expect(getIfTerminalCmd('!测试[simple,command,test]')).toBe(true)
  })

  it('should return false for non-matching formats', () => {
    expect(getIfTerminalCmd('regular text')).toBe(false)
    expect(getIfTerminalCmd('!invalid[format')).toBe(false)
    expect(getIfTerminalCmd('[not,a,command]')).toBe(false)
  })

  it('should return false for partial or embedded commands', () => {
    expect(getIfTerminalCmd('prefix!CommandParam[test]')).toBe(false)
    expect(getIfTerminalCmd('!CommandParam[test]suffix')).toBe(false)
    expect(getIfTerminalCmd('text!Page[test]more')).toBe(false)
    expect(getIfTerminalCmd('start![test]end')).toBe(false)
  })

  it('should return true for strings containing multiple formats', () => {
    // String with CommandParam format
    const input1 = '!CommandParam[test] !Page[test2]'
    expect(getIfTerminalCmd(input1)).toBe(true)

    // String with Page format
    const input2 = '!Page[test] ![test2]'
    expect(getIfTerminalCmd(input2)).toBe(true)
  })
})
