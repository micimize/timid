import React from 'react'
import t, { propTypes } from 'tcomb-react'
import Input from 'react-maskedinput'

if($ES.CONTEXT == 'BROWSER')
  require('./masked-input.scss');

const formatCharacters = {
  'H': {
    defaultChar: '0',
    validate: char => ['0', '1'].includes(char)
  },
  'o': {
    defaultChar(char){
      return 'a' > char > '2' ? '2' : char != '0' ? '0' : undefined
    },
    validateContextually(char, index, value){
      let H = value[index-1]
      return !(H != '1' && ('a' <= char || char == '0'))
    },
    transformContextually(char, index, value){
      let H = value[index-1]
      if(H == '1' && 'a' > char > '2')
        return '2';
    },
    validate: char => /^\d$/.test(char)
  },
  '2': {
    defaultChar: '0',
    validate: char => ['0', '1', '2'].includes(char)
  },
  '4': {
    defaultChar(char){
      return 'a' > char > '4' ? '4' : '0'
    },
    transformContextually(char, index, value){
      let H = value[index-1]
      if(H > '1' && char > '4')
        return '4';
    },
    validate: char => /^\d$/.test(char)
  },
  'M': {
    defaultChar: '0',
    validate: char => ['0', '1', '2', '3', '4', '5'].includes(char)
  },
  'i': {
    defaultChar: '0',
    validate: char => /^\d$/.test(char)
  },
  'a': {
    validate: char => ['a', 'p'].includes(char)
  },
}

function configure({ formatCharacters: additionalFormatCharacters, ...config}){
  return Object.assign({
    isRevealingMask: false, 
    backspaceSkipsStatic: true, 
    placeholder: "", 
    formatCharacters: Object.assign(formatCharacters, additionalFormatCharacters)
  }, config)
}


export default class MaskedInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.defaultValue || "" }
  }

  getConfig = () => configure(this.props.config)

  maskIsFull = (value) => {
    if(this.getConfig().mask.length == value.length){
      let { selectionEnd, selectionStart } = this.input
      return selectionStart == selectionEnd == value.length
    }
    return false
  }

  maskIsEmpty = (newValue) => {
    let value = this.props.value ||
      this.state.value ||
      this.props.defaultValue || ""
    let { selectionEnd, selectionStart } = this.input
    return (selectionStart == selectionEnd == newValue.length == 0) && !value.length
  }

  onChange = event => {
    // wrap onChange to handle uncontrolled components
    let { onChange = _ => null, onFull, onEmpty } = this.props
    if(onEmpty && this.maskIsEmpty(event.target.value)){
      debugger;
      onEmpty()
    }
    if(!this.props.value){
      let { value } = event.target
      this.setState({ value })
      onChange(event)
      if(this.maskIsFull(value) && onFull){
        onFull(event)
      }
    } else {
      onChange(event)
    }
  }

  componentWillReceiveProps = ({ value, onFull }) => {
    // controlled components can still have onFull callbacks
    if(onFull && value && this.maskIsFull(value)){
      onFull(value)
    }
  }

  handleRef = ref => {
    this.input = ref
    if(this.props.reference){
      this.props.reference(ref)
    }
  }

  render() {
    let {
      config: _,
      onChange,
      onClick,
      onFull,
      defaultValue,
      className = '',
      value = this.state.value,
      ...props
    } = this.props
    return (
      <div className={`masked-input ${className}`}>
        <Input isRevealingMask={true} {...this.getConfig()} {...props} value={value}
               reference={this.handleRef} onChange={this.onChange} />
      </div>
    )
  }
}
