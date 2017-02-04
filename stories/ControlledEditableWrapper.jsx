import React from 'react'

export default class Wrapper extends React.Component {
  constructor(props, context) {
    super(props, context);
    let { children, editing = false, ...childState } = this.props
    this.state = { editing, childState }
  }
  update = (newState) => {
    this.setState({childState: Object.assign({}, this.state.childState, newState)})
  }
  render() {
    let { editing, childState } = this.state
    return (
      <div className="controlled-editable-wrapper">
        <p>
          <button onClick={_ => this.setState({editing: !editing})}>{editing ? 'stop editing' : 'edit'}</button>
        </p>
        {React.cloneElement( React.Children.only(this.props.children), Object.assign({update: editing ? this.update : undefined}, childState))}
      </div>
    )
  }
}
