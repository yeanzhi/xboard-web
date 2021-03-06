import React, { PropTypes,Component } from 'react';
import TableCell from './TableCell';
import ExpandIcon from './ExpandIcon';

export default class extends Component{
  static propTypes = {
    onDestroy: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    record: PropTypes.object,
    prefixCls: PropTypes.string,
    expandIconColumnIndex: PropTypes.number,
    onHover: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    visible: PropTypes.bool,
    index: PropTypes.number,
    hoverKey: PropTypes.any,
    expanded: PropTypes.bool,
    expandable: PropTypes.any,
    onExpand: PropTypes.func,
    needIndentSpaced: PropTypes.bool,
    className: PropTypes.string,
    indent: PropTypes.number,
    indentSize: PropTypes.number,
    expandIconAsCell: PropTypes.bool,
    expandRowByClick: PropTypes.bool,
    store: PropTypes.object.isRequired,
  }
  static defaultProps = {
    onRowClick:function(){},
    onRowDoubleClick:function(){},
    onDestroy:function(){},
    expandIconColumnIndex: 0,
    expandRowByClick: false,
    onHover:function(){}
  }
  constructor(){
    super();
    this.state = {
      hovered: false
    }
  }
  componentWillMount(){
    //this.state = {
    //  hovered: false
    //}
  }


  componentDidMount() {
    const { store, hoverKey } = this.props;
    this.unsubscribe = store.subscribe(() => {
      if (store.getState().currentHoverKey === hoverKey) {
        this.setState({ hovered: true });
      } else if (this.state.hovered === true) {
        this.setState({ hovered: false });
      }
    });
  }

  componentWillUnmount() {
    const { record, onDestroy, index } = this.props;
    onDestroy(record, index);
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  onRowClick(event) {
    const {
      record,
      index,
      onRowClick,
      expandable,
      expandRowByClick,
      expanded,
      onExpand,
    } = this.props;
    if (expandable && expandRowByClick) {
      onExpand(!expanded, record, event, index);
    }
    onRowClick(record, index, event);
  }

  onRowDoubleClick(event) {
    const { record, index, onRowDoubleClick } = this.props;
    onRowDoubleClick(record, index, event);
  }

  onMouseEnter() {
    const { onHover, hoverKey } = this.props;
    onHover(true, hoverKey);
  }

  onMouseLeave() {
    const { onHover, hoverKey } = this.props;
    onHover(false, hoverKey);
  }

  render() {
    const {
      prefixCls, columns, record, height, visible, index,
      expandIconColumnIndex, expandIconAsCell, expanded, expandRowByClick,
      expandable, onExpand, needIndentSpaced, indent, indentSize,
    } = this.props;

    let { className } = this.props;

    if (this.state.hovered) {
      className += ` ${prefixCls}-hover`;
    }

    const cells = [];

    const expandIcon = (
      <ExpandIcon
        expandable={expandable}
        prefixCls={prefixCls}
        onExpand={onExpand.bind(this)}
        needIndentSpaced={needIndentSpaced}
        expanded={expanded}
        record={record}
      />
    );

    for (let i = 0; i < columns.length; i++) {
      if (expandIconAsCell && i === 0) {
        cells.push(
          <td
            className={`${prefixCls}-expand-icon-cell`}
            key="nx-table-expand-icon-cell"
          >
            {expandIcon}
          </td>
        );
      }
      const isColumnHaveExpandIcon = (expandIconAsCell || expandRowByClick)
        ? false : (i === expandIconColumnIndex);
      cells.push(
        <TableCell
          prefixCls={prefixCls}
          record={record}
          indentSize={indentSize}
          indent={indent}
          index={index}
          column={columns[i]}
          key={columns[i].key}
          expandIcon={isColumnHaveExpandIcon ? expandIcon : null}
        />
      );
    }
    const style = { height };
    if (!visible) {
      style.display = 'none';
    }

    return (
      <tr
        onClick={this.onRowClick.bind(this)}
        onDoubleClick={this.onRowDoubleClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        className={`${prefixCls} ${className} ${prefixCls}-level-${indent}`}
        style={style}
      >
        {cells}
      </tr>
    );
  }
}
