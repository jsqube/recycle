import {ENTER_KEY, ESC_KEY} from '../../utils'

export default function actions (sources) {
  const toggleCheckbox = sources.DOM.select('.toggle')
  const destroyIcon = sources.DOM.select('.destroy')
  const editInput = sources.DOM.select('.edit')
  const todoLabel = sources.DOM.select('label')

  return [
    destroyIcon
      .events('click')
      .latestFrom(sources.props)
      .map(props => ({ type: 'destroy', id: props.id })),

    toggleCheckbox
      .events('change')
      .latestFrom(sources.props)
      .action(props => ({ type: 'toggle', id: props.id })),

    editInput
      .events('keyup')
      .filter(ev => ev.keyCode === ENTER_KEY)
      .merge(editInput.events('blur', true))
      .latestFrom(sources.props, sources.state)
      .map(({props, state}) => ({ type: 'titleChanged', id: props.id, title: state.inputVal })),

    todoLabel
      .events('dblclick')
      .latestFrom(sources.props)
      .map(props => ({ type: 'startEdit', id: props.id })),

    editInput
      .events('input')
      .map(ev => ({ type: 'inputVal', value: ev.target.value })),

    editInput
      .events('keyup')
      .filter(ev => ev.keyCode === ESC_KEY)
      .map(() => ({ type: 'cancelEdit' })),

    sources.actions
      .filterByType('cancelEdit')
      .latestFrom(sources.props)
      .map(props => ({ type: 'inputVal', value: props.title })),

    sources.actions
      .filterByType('startEdit')
      .latestFrom(sources.props)
      .map(props => ({ type: 'inputVal', value: props.title }))
  ]
}
