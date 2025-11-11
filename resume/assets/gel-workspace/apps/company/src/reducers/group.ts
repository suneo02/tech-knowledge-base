/**
 * for redux
 * Created by Calvin
 *
 *  @format
 */

const initialState = {
  // expandedNodes: [],
  selectedNode: [],
  shouldUpdateSelected: true,
  expandedKeys: [],
}

const group = (state = initialState, action) => {
  switch (action.type) {
    // case "EXPAND_NODE":
    //   return {
    //     ...state,
    //     expandedNodes: [...state.expandedNodes, action.payload],
    //   };
    case 'SET_UPDATE_SELECTED':
      return {
        ...state,
        shouldUpdateSelected: action.payload,
      }
    case 'SET_SELECTED_NODE':
      return {
        ...state,
        selectedNode: action.payload,
      }
    case 'SET_EXPANDED_KEYS':
      console.log('SET_EXPANDED_KEYS', action.payload)
      return {
        ...state,
        selectedNode: action.payload,
      }
    default:
      return state
  }
}

export default group
